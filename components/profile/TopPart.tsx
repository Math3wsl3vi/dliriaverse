import Image from "next/image";
import React from "react";

const TopPart = () => {
  return (
    <div className="mt-5">
      <div className="pl-3 flex flex-col items-center gap-3 mb-2">
        <Image
          src="/images/newpic.jpeg"
          alt='profile pic'
          width={150}
          height={150}
          className="rounded-full w-32 h-32 object-center"
        />
        <h1 className="font-poppins">math3wsl3vi</h1>
      </div>
    </div>
  );
};

export default TopPart;
