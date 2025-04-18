import { myUploads } from '@/lib/data'
import Image from 'next/image'
import React from 'react'

const PostsPart = () => {
  return (
    <div className="p-4">
      <h1 className="font-poppins font-semibold text-xl mb-4">My posts</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {myUploads.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 p-2 border rounded-md hover:shadow-md transition"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={300}
              height={200}
              className="w-full h-auto rounded-md object-cover"
            />
            <div className="text-left">
              <h2 className="font-poppins text-base">{item.name}</h2>
              <p className="text-sm text-gray-600">{item.county}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="h-[85px]" /> {/* For spacing at bottom */}
    </div>
  )
}

export default PostsPart
