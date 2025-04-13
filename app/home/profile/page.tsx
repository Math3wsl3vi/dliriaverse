"use client";

import React, { useState } from "react";
import EventsPart from "@/components/profile/EventsPart";
import MeetupsPart from "@/components/profile/MeetupsPart";
import PostsPart from "@/components/profile/PostsPart";
import TopPart from "@/components/profile/TopPart";
import Image from "next/image";

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState<
    "posts" | "events" | "meetups"
  >("posts");

  return (
    <div>
      {/* Top Part */}
      <TopPart />
      

      {/* Toggle Icons */}
      <div className="flex justify-between px-20 items-center gap-2">
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

      {/* Conditional Rendering Based on State */}
      <div className="px-4 md:px-20">
        {activeSection === "posts" && <PostsPart />}
        {activeSection === "events" && <EventsPart />}
        {activeSection === "meetups" && <MeetupsPart />}
      </div>
    </div>
  );
};

export default ProfilePage;
