"use client"
import React, { useState, useEffect } from "react";
import TopPart from "@/components/profile/TopPart";
import { auth, firestore } from '@/configs/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import PostsPart from "@/components/profile/PostsPart";
import EventsPart from "@/components/profile/EventsPart";
import BookmarksPart from "@/components/profile/BookmarksPart";

interface UserProfile {
  username: string;
  profilePic: string;
  email: string;
  bio: string;
}

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<'posts' | 'events' | 'bookmarks'>('posts');

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserProfile({
              username: data.username || 'Unknown User',
              profilePic: data.photoURL || '/images/newpic.jpeg',
              email: data.email || user.email || 'No email',
              bio: data.bio || 'No bio available',
            });
          } else {
            setUserProfile({
              username: user.displayName || 'Unknown User',
              profilePic: user.photoURL || '/images/newpic.jpeg',
              email: user.email || 'No email',
              bio: 'No bio available',
            });
          }
          setLoading(false);
        }, (err) => {
          console.error('Error fetching user profile:', err);
          setUserProfile({
            username: user.displayName || 'Unknown User',
            profilePic: user.photoURL || '/images/newpic.jpeg',
            email: user.email || 'No email',
            bio: 'No bio available',
          });
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        router.push('/auth');
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="mt-[90px] ml-0 px-4 w-full text-center">
        <p className="font-poppins text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="mt-[90px] ml-0 px-4 w-full text-center">
        <p className="font-poppins text-lg text-red-500">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="mt-[90px] ml-0 px-4 w-full">
      <TopPart
        username={userProfile.username}
        profilePic={userProfile.profilePic}
        email={userProfile.email}
        bio={userProfile.bio}
      />

<div className="flex justify-center md:justify-between items-center gap-4 my-4 md:w-[calc(100%-250px)] px-4">
  <button
    onClick={() => setActiveSection('posts')}
    className={`px-4 py-2 rounded-md ${
      activeSection === 'posts' ? 'bg-navy-1 text-white' : 'bg-gray-200'
    }`}
  >
    My Posts
  </button>

  <button
    onClick={() => setActiveSection('events')}
    className={`px-4 py-2 rounded-md ${
      activeSection === 'events' ? 'bg-navy-1 text-white' : 'bg-gray-200'
    }`}
  >
    My Events
  </button>

  <button
    onClick={() => setActiveSection('bookmarks')}
    className={`px-4 py-2 rounded-md ${
      activeSection === 'bookmarks' ? 'bg-navy-1 text-white' : 'bg-gray-200'
    }`}
  >
    My Bookmarks
  </button>
</div>

<div className="mt-6">
  {activeSection === 'posts' && <PostsPart />}
  {activeSection === 'events' && <EventsPart />}
  {activeSection === 'bookmarks' && <BookmarksPart />}
</div>


    </div>
  );
};

export default ProfilePage;