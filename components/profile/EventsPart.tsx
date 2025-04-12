import { myUploads } from '@/lib/data'
import Image from 'next/image'
import React from 'react'

const EventsPart = () => {
  return (
    <div className='p-2'>
           <h1 className='font-poppins font-semibold ml-2 text-xl mt-4'>My Events</h1>
           <div className='flex flex-col gap-4 p-2'>
          {myUploads.map((item)=>(
           <div key={item.id} className='flex flex-row gap-3 hover:shadow-sm hover:rounded-md p-1 hover:border'>
               <Image src={item.imageUrl} alt={item.name} width={300} height={300} className='w-[45%] md:w-1/3 rounded-md'/>
               <div className='text-left'>
                   <h1 className='font-poppins'>{item.name}</h1>
                   <h1 className='font-poppins'>{item.county}</h1>
                   </div>
   
           </div>
          ))}
          </div>
       </div>
  )
}

export default EventsPart