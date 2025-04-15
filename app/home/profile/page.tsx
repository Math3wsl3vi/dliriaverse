"use client"
import React, { useState, useEffect } from "react";
import EventsPart from "@/components/profile/EventsPart";
import MeetupsPart from "@/components/profile/MeetupsPart";
import PostsPart from "@/components/profile/PostsPart";
import TopPart from "@/components/profile/TopPart";
import Image from "next/image";
import { auth, firestore } from '@/configs/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface UserProfile {
  username: string;
  profilePic: string;
  email: string;
  bio: string;
}

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState<"posts" | "events" | "meetups">("posts");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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

      {/* Rest of your component remains the same */}
      <div className="flex justify-center md:justify-between items-center gap-2 my-4 md:w-[calc(100%-250px)] px-20">
        <Image
          src="/images/more.png"
          alt="Posts"
          width={24}
          height={24}
          className={`cursor-pointer object-contain ${
            activeSection === "posts"
              ? "opacity-100 grayscale-0"
              : "opacity-50 grayscale"
          }`}
          onClick={() => setActiveSection("posts")}
        />
        <h1>|</h1>
        <Image
          src="/images/event.png"
          alt="Events"
          width={24}
          height={24}
          className={`cursor-pointer object-contain ${
            activeSection === "events"
              ? "opacity-100 grayscale-0"
              : "opacity-50 grayscale"
          }`}
          onClick={() => setActiveSection("events")}
        />
        <h1>|</h1>
        <Image
          src="/images/group.png"
          alt="Meetups"
          width={26}
          height={26}
          className={`cursor-pointer object-contain ${
            activeSection === "meetups"
              ? "opacity-100 grayscale-0"
              : "opacity-50 grayscale"
          }`}
          onClick={() => setActiveSection("meetups")}
        />
      </div>

      <div>
        {activeSection === "posts" && <PostsPart />}
        {activeSection === "events" && <EventsPart />}
        {activeSection === "meetups" && <MeetupsPart />}
      </div>
    </div>
  );
};

export default ProfilePage;