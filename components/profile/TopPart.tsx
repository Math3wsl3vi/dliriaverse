"use client"
import { auth } from "@/configs/firebaseConfig";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface TopPartProps{
  username:string;
  profilePic: string;
  email:string;
  bio?:string
}

const TopPart: React.FC<TopPartProps> = ({ username, profilePic, bio }) => {
        const router = useRouter();
        const [sidebarOpen, setSidebarOpen] = useState(false);
        const handleLogout = () => {
            auth.signOut();
            localStorage.removeItem("user");
            router.push("/");
            setSidebarOpen(false);
          };
  return (
    <div className="mt-5 md:w-[calc(100%-250px)]">
      <div className="flex items-end justify-end pr-4 cursor-pointer"
      onClick={() => setSidebarOpen(true)} 
      >
        <Image src="/images/settings.png" alt="menu" height={20} width={20} />
        {/* sidebar */}
        <div
          className={`fixed top-0 right-0 w-full h-full bg-white shadow-lg transform z-50 font-bab ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <button
            className="absolute top-4 right-4 text-gray-700 text-lg"
            onClick={() =>setSidebarOpen(false)}
          >
            <Image src="/images/close.png" alt="menu" height={20} width={20} />
          </button>

          <div className="flex flex-col mt-10 px-6">
          <button
              className="mt-4 w-full text-left font-poppins py-2 rounded"
              onClick={handleLogout}
            >
              Settings
            </button>
            <button
              className="mt-4 w-full text-left font-poppins py-2 rounded"
              onClick={handleLogout}
            >
              Edit Profile
            </button>
            <button
              className="mt-4 w-full text-center font-poppins bg-navy-1 text-white py-2 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="pl-3 flex flex-col items-center gap-3 mb-2">
       <div className="border-2 border-blue-300 p-1.5 rounded-full">
       <Image
          src={profilePic}
          alt="profile pic"
          width={150}
          height={150}
          className="rounded-full w-32 h-32 object-cover"
        />
       </div>
        <Link href={'/home/edit'} className="p-2 bg-navy-1 text-white font-poppins rounded-full px-4 cursor-pointer">Edit Profile</Link>
        <h1 className="font-poppins capitalize">{username}</h1>
        <h1 className="font-poppins text-sm text-gray-500 mb-5">{bio}</h1>
      </div>
    </div>
  );
};

export default TopPart;