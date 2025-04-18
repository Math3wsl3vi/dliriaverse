import Image from 'next/image'
import React from 'react'

const MeetupsPage = () => {
  return (
    <div className='font-poppins mt-[105px]'>
      <h1 className='text-3xl font-poppins text-center font-semibold'>COMING SOON!!</h1>
      <div className='mt-10 flex items-center justify-center w-full'>
      <Image src='/images/soon.png' alt='comming soon' width={300} height={400}/>
      </div>
      <h2 className='p-4 text-xl'>Here, {"you'll"} get to organise meetups with other Kenyans who have the same interests as you; maybe organise road trips, sherehes, go to events together, visit hidden gems etc!! </h2>
    </div>
  )
}

export default MeetupsPage