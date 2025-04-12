"use client"
import Image from "next/image";
import React from "react";

const TopPartUser = () => {
       
  return (
    <div className="mt-5">
     
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
  );
};

export default TopPartUser;
