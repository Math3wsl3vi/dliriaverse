"use client"
import { auth } from "@/configs/firebaseConfig";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TopPartUser = () => {
        const router = useRouter();
        const [sidebarOpen, setSidebarOpen] = useState(false);
        const handleLogout = () => {
            auth.signOut();
            localStorage.removeItem("user");
            router.push("/");
            setSidebarOpen(false);
          };
  return (
    <div className="mt-5">
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
            onClick={() => setSidebarOpen(false)}
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
              className="mt-4 w-full text-center font-poppins bg-green-1 text-white py-2 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
     <div>
     <div className="pl-3 flex items-center gap-3 mb-2">
        <Image
          src="/images/newpic.jpeg"
          alt="profile pic"
          width={80}
          height={80}
          className="rounded-full w-16 h-16 object-cover"
        />
        <h1 className="font-poppins">math3wsl3vi</h1>
      </div>
      <h1 className="pl-3 font-poppins text-sm text-gray-500">Small About section</h1>
     </div>
    </div>
  );
};

export default TopPartUser;
