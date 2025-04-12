import React from 'react'
import { uploadData } from './../../lib/data'
import Image from 'next/image'

const HomePage = () => {
  return (
    <div className='mt-5 p-3 grid grid-cols-1 md:grid-cols-3 gap-5 '>
      {uploadData.map((item)=>(
        <div key={item.id} className='mb-2 hover:border hover:shadow-sm hover:rounded-md py-4 cursor-pointer' >
          <div className='pl-3 flex items-center gap-3 mb-2'>
          <Image src='/images/newpic.jpeg' alt={item.name} width={40} height={40} className='rounded-full w-10 h-10 object-cover'/>
          <h1 className='font-poppins'>math3wsl3vi</h1>
          </div>
          <div className='flex items-center justify-center'>
          <Image src={item.imageUrl} alt={item.name} width={300} height={300} className='w-[95%] md:w-1/3 rounded-md'/>
          </div>
          <div className='flex justify-between mt-2'>
         <h1 className='font-poppins pl-3'>{item.name}</h1>
         <p className='font-poppins pr-3'>{item.county}</p>
         </div>
          <div className='flex flex-row justify-between items-center mt-2'>
            <div className='flex gap-3'>
              <div className='pl-3 grid grid-cols-2 items-center gap-1'>
              <Image src='/images/heart.png' alt={item.name} width={20} height={20} className=''/>
              <h1 className='font-poppins'> {item.likes}</h1>
              </div>
              <div className='pl-3 grid grid-cols-2 items-center gap-1'>
              <Image src='/images/bookmark.png' alt={item.name} width={20} height={20} className=''/>
              <h1 className='font-poppins'> {item.bookmarks}</h1>
              </div>
            </div>
            <div className='pr-3 grid grid-cols-2 items-center gap-1'>
              <Image src='/images/star.png' alt={item.name} width={20} height={20} className=''/>
              <h1 className='font-poppins'> {item.rating}</h1>
              </div>
          </div>
        </div>
      ))}
      <div className='h-[55px]'></div>
    </div>
  )
}

export default HomePage