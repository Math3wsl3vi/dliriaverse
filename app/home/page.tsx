"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  deleteDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { firestore, auth } from "@/configs/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  name: string;
  imageUrl: string;
  county: string;
  likes: string[]; // Changed to array of user IDs who liked
  bookmarks: number;
  rating: number;
  username: string;
  profilePic: string;
  caption: string;
  rate: string;
}

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [optimisticLikes, setOptimisticLikes] = useState<
    Record<string, string[]>
  >({});
  const { toast } = useToast();
  const [likedPostId, setLikedPostId] = useState<string | null>(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!currentUser) return;

      const ref = collection(firestore, "bookmarks", currentUser.uid, "posts");
      const snapshot = await getDocs(ref);
      const ids = snapshot.docs.map((doc) => doc.id);
      setBookmarkedPosts(ids);
    };

    fetchBookmarks();
  }, [currentUser]);

  useEffect(() => {
    const postsQuery = query(
      collection(firestore, "posts"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        try {
          const fetchedPosts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const postId = doc.id;

            const likes = optimisticLikes[postId] || data.likes || [];
            return {
              id: doc.id,
              name: data.name || data.caption || "Untitled Post",
              imageUrl: data.images?.[0] || "/images/placeholder.jpg",
              county: data.location || "Unknown County",
              likes: likes, // Array of user IDs who liked
              bookmarks: data.bookmarks?.length || 0,
              rating: data.rating || 0,
              username: data.username || "Unknown User",
              profilePic: data.profilePic || "/images/newpic.jpeg",
              caption: data.caption || "",
              rate: data.rate || "",
            };
          });
          setPosts(fetchedPosts);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching posts:", err);
          setError("Failed to load posts. Please try again later.");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore listener error:", err);
        setError("Failed to load posts. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleBookmark = async (postId: string) => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark posts",
        variant: "destructive",
      });
      return;
    }

    const ref = doc(firestore, "bookmarks", currentUser.uid, "posts", postId);

    try {
      const snap = await getDoc(ref);

      if (snap.exists()) {
        await deleteDoc(ref);
        setBookmarkedPosts((prev) => prev.filter((id) => id !== postId));
        toast({ title: "Removed from bookmarks" });
      } else {
        await setDoc(ref, {
          postId: postId,
          createdAt: new Date(),
        });
        setBookmarkedPosts((prev) => [...prev, postId]);
        toast({ title: "Bookmarked!" });
      }
    } catch (error) {
      console.error("Bookmark error", error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Optimistic update
    const isLiked = post.likes.includes(currentUser.uid);
    const newLikes = isLiked
      ? post.likes.filter((id) => id !== currentUser.uid)
      : [...post.likes, currentUser.uid];

    setOptimisticLikes((prev) => ({
      ...prev,
      [postId]: newLikes,
    }));

    try {
      const postRef = doc(firestore, "posts", postId);
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert optimistic update if there's an error
      setOptimisticLikes((prev) => ({
        ...prev,
        [postId]: post.likes, // Revert to original likes
      }));
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-[80px] pt-3 max-w-7xl mx-auto text-center">
        <p className="font-poppins text-lg">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-[80px] pt-3 max-w-7xl mx-auto text-center">
        <p className="font-poppins text-lg text-red-500">{error}</p>
      </div>
    );
  }

  const handleDoubleClickLike = (postId: string) => {
    setLikedPostId(postId);
    handleLike(postId);
    setTimeout(() => setLikedPostId(null), 1000); // hide heart after 1 second
  };

  return (
    <div className="mt-[80px] pt-3 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
        {posts.map((item) => (
          <div
            key={item.id}
            className="hover:border-t hover:shadow-sm hover:rounded-md py-4 cursor-pointer transition-all duration-200 ease-in-out bg-white"
          >
            <Link
              href={`/profile/${item.username}`}
              className="pl-3 flex items-center gap-3 mb-2"
            >
              <Image
                src={item.profilePic}
                alt={item.username}
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover"
              />
              <h1 className="font-poppins capitalize">{item.username}</h1>
            </Link>

            <div
              className="w-full relative"
              onDoubleClick={() => handleDoubleClickLike(item.id)}
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={900}
                height={900}
                className="object-cover w-full h-auto md:w-[400px] md:h-[300px]"
                quality={100}
              />
              {likedPostId === item.id && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src="/images/heart.png"
                    alt="Liked"
                    width={80}
                    height={80}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between mt-2 px-3">
              <h1 className="font-poppins text-sm capitalize">{item.name}</h1>
              <p className="font-poppins text-sm">{item.county}</p>
            </div>

            <div className="flex justify-between items-center mt-2 px-3">
              <div className="flex gap-4">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleLike(item.id)}
                >
                  <Image
                    src={
                      currentUser && item.likes.includes(currentUser.uid)
                        ? "/images/heart.png"
                        : "/images/heart-outline.png"
                    }
                    alt="Like"
                    width={20}
                    height={20}
                  />
                  <h1 className="font-poppins">{item.likes.length}</h1>
                </div>
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleBookmark(item.id)}
                >
                  <Image
                    src={
                      bookmarkedPosts.includes(item.id)
                        ? "/images/bookmark1.png" // highlighted icon
                        : "/images/bookmark.png" // default icon
                    }
                    alt="Bookmark"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/images/star.png"
                  alt="Rating"
                  width={20}
                  height={20}
                />
                <h1 className="font-poppins">{item.rate}/10</h1>
              </div>
            </div>

            <div className="p-2">
              <h1 className="pl-2 font-poppins text-sm capitalize">
                {item.caption}
              </h1>
            </div>
          </div>
        ))}
      </div>
      <div className="h-[100px]"></div>
    </div>
  );
};

export default HomePage;
