"use client"
import { Input } from '@/components/ui/input';
import { useState } from 'react';

import React from 'react'

const MeetupsPage = () => {


  const [meetups, setMeetups] = useState([
    {
      id: 1,
      title: "Drive Up to Namanga",
      location: "Nairobi",
      date: "May 25, 2025",
      members: 10,
      isJoined: false,
      isAdmin: false,
      chatOpen: false
    },
    {
      id: 2,
      title: "Mara Nomads Meetup",
      location: "Nairobi",
      date: "May 20, 2025",
      members: 15,
      isJoined: false,
      isAdmin: false,
      chatOpen: false
    },

  ]);

  const toggleJoin = (id:number) => {
    setMeetups(meetups.map(meetup => 
      meetup.id === id ? { 
        ...meetup, 
        isJoined: !meetup.isJoined,
        members: meetup.isJoined ? meetup.members - 1 : meetup.members + 1,
        chatOpen: !meetup.isJoined // Open chat when joining
      } : meetup
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-[90px] font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upcoming Meetups</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Create Meetup
        </button>
      </div>

      {/* Meetups List */}
      <div className="space-y-4">
        {meetups.map((meetup) => (
          <div key={meetup.id} className="border rounded-xl p-4">
            {/* Meetup Info */}
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold text-lg">{meetup.title}</h2>
                <p className="text-gray-600">{meetup.location} • {meetup.date}</p>
                <p className="text-sm text-gray-500">{meetup.members} attending</p>
              </div>
              
              {/* Join Button */}
              <button
                onClick={() => toggleJoin(meetup.id)}
                className={`px-4 py-1 rounded-full self-center ${
                  meetup.isJoined 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-black text-white'
                }`}
              >
                {meetup.isJoined ? 'Joined ✓' : 'Join'}
              </button>
            </div>

            {/* Chat Section (Conditional) */}
            {meetup.chatOpen && (
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Group Chat</h3>
                  {meetup.isAdmin && (
                    <button className="text-sm text-red-500">
                      Remove Members
                    </button>
                  )}
                </div>
                
                {/* Messages Area */}
                <div className="h-48 overflow-y-auto mb-3 space-y-2">
                  {/* Sample messages would go here */}
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <p>Admin: Welcome everyone!</p>
                  </div>
                </div>
                
                {/* Message Input */}
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 border rounded-md px-4 py-2"
                  />
                  <button className="bg-blue-500 text-white px-4 rounded-md">
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default MeetupsPage
