"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, firestore } from "@/configs/firebaseConfig";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import * as Dialog from "@radix-ui/react-dialog"; // Import Dialog components

interface Post {
  id: string;
  images: string[];
  name: string;
  location: string;
  userId: string;
}

const EventsPart = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<string | null>(null); // Track the post to delete

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const postsRef = collection(firestore, "events");
          const q = query(postsRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const userPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];

          setPosts(userPosts);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDeletePost = async () => {
    if (postToDelete) {
      try {
        const postDocRef = doc(firestore, "events", postToDelete);
        await deleteDoc(postDocRef); // Delete the post
        setPosts(posts.filter((post) => post.id !== postToDelete)); // Remove post from UI
        setPostToDelete(null); // Reset postToDelete state
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (loading) {
    return <p className="p-4 text-center">Loading events...</p>;
  }

  if (posts.length === 0) {
    return <p className="p-4 text-center">You {"haven't"} uploaded any posts yet.</p>;
  }

  return (
    <div className="p-4 font-poppins">
      <h1 className="font-poppins font-semibold text-xl mb-4">My Events</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 p-2 border rounded-md hover:shadow-md transition"
          >
            <Image
              src={item.images[0]}
              alt={item.name}
              width={300}
              height={200}
              className="w-full h-[400px] rounded-md object-cover md:w-[400px] md:h-[300px]"
            />
            <div className="text-left flex justify-between p-2">
              <div>
                <h2 className="font-poppins text-base capitalize">{item.name}</h2>
                <p className="text-sm text-gray-600 capitalize">{item.location}</p>
              </div>
              <div>
                {/* Open the confirmation dialog */}
                <Dialog.Root open={postToDelete === item.id} onOpenChange={(open) => open ? setPostToDelete(item.id) : setPostToDelete(null)}>
                  <Dialog.Trigger className="text-red-500 text-sm cursor-pointer">
                    Delete
                  </Dialog.Trigger>

                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-96">
                      <Dialog.Title className="font-semibold text-lg">Confirm Deletion</Dialog.Title>
                      <Dialog.Description className="mt-2 text-sm">
                        Are you sure you want to delete this event?
                      </Dialog.Description>
                      <div className="mt-4 flex justify-between">
                        <Dialog.Close asChild>
                          <button className="text-gray-500">Cancel</button>
                        </Dialog.Close>
                        <button
                          onClick={handleDeletePost}
                          className="text-red-500 font-semibold"
                        >
                          Confirm
                        </button>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-[85px]" />
    </div>
  );
};

export default EventsPart;
