"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/configs/firebaseConfig';

interface Post {
  id: string;
  name: string;
  imageUrl: string;
  county: string;
  likes: number;
  bookmarks: number;
  rating: number;
  username: string;
  profilePic: string;
}

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const postsQuery = query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      try {
        const fetchedPosts = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || data.caption || data.userEmail || 'Untitled Post', // Use name field if available
            imageUrl: data.images && data.images.length > 0 ? data.images[0] : '/images/placeholder.jpg',
            county: data.location || 'Unknown County',
            likes: data.likes ? data.likes.length : 0,
            bookmarks: data.bookmarks ? data.bookmarks.length : 0,
            rating: data.rating || 0,
            username: data.username || 'Unknown User', // Use username from post
            profilePic: data.profilePic || '/images/newpic.jpeg', // Use profilePic from post
          };
        });
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    }, (err) => {
      console.error('Firestore listener error:', err);
      setError('Failed to load posts. Please try again later.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <div className="mt-[80px] pt-3 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
        {posts.map((item) => (
          <div
            key={item.id}
            className="hover:border-t hover:shadow-sm hover:rounded-md py-4 cursor-pointer transition-all duration-200 ease-in-out bg-white"
          >
            <Link
              href={"/home/user"}
              className="pl-3 flex items-center gap-3 mb-2"
            >
              <Image
                src={item.profilePic}
                alt={item.username}
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover"
              />
              <h1 className="font-poppins">{item.username}</h1>
            </Link>
            <div className="w-full relative">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={900}
                height={900}
                className="object-cover w-full h-auto md:w-[400px] md:h-[300px]"
                quality={100}
              />
            </div>

            <div className="flex justify-between mt-2 px-3">
              <h1 className="font-poppins text-sm">{item.name}</h1>
              <p className="font-poppins text-sm">{item.county}</p>
            </div>
            <div className="flex justify-between items-center mt-2 px-3">
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Image
                    src="/images/heart.png"
                    alt={item.name}
                    width={20}
                    height={20}
                  />
                  <h1 className="font-poppins">{item.likes}</h1>
                </div>
                <div className="flex items-center gap-1">
                  <Image
                    src="/images/bookmark.png"
                    alt={item.name}
                    width={20}
                    height={20}
                  />
                  <h1 className="font-poppins">{item.bookmarks}</h1>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Image
                  src="/images/star.png"
                  alt={item.name}
                  width={20}
                  height={20}
                />
                <h1 className="font-poppins">{item.rating}</h1>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-[100px]"></div>
    </div>
  );
};

export default HomePage;