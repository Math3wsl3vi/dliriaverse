import React from "react";
import { uploadData } from "./../../lib/data";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="mt-[80px] pt-3 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
        {uploadData.map((item) => (
          <div
            key={item.id}
            className="hover:border-t hover:shadow-sm hover:rounded-md py-4 cursor-pointer transition-all duration-200 ease-in-out bg-white"
          >
            <Link
              href={"/home/user"}
              className="pl-3 flex items-center gap-3 mb-2"
            >
              <Image
                src="/images/newpic.jpeg"
                alt={item.name}
                width={40}
                height={40}
                className="rounded-full w-10 h-10 object-cover"
              />
              <h1 className="font-poppins">math3wsl3vi</h1>
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
