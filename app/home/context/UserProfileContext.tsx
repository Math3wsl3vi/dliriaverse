"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, firestore } from '@/configs/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

interface UserProfile {
  username: string;
  profilePic: string;
}

interface UserProfileContextType {
  userProfile: UserProfile | null;
  loading: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // Fetch user profile from Firestore with real-time listener
        const userDocRef = doc(firestore, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserProfile({
              username: data.username || 'Unknown User',
              profilePic: data.photoURL || '/images/newpic.jpeg',
            });
          } else {
            // Fallback to Firebase Auth data if Firestore doc doesn't exist
            setUserProfile({
              username: user.displayName || 'Unknown User',
              profilePic: user.photoURL || '/images/newpic.jpeg',
            });
          }
          setLoading(false);
        }, (err) => {
          console.error('Error fetching user profile:', err);
          setUserProfile({
            username: user.displayName || 'Unknown User',
            profilePic: user.photoURL || '/images/newpic.jpeg',
          });
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <UserProfileContext.Provider value={{ userProfile, loading }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};