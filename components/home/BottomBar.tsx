import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BottomBar = () => {
  return (
    <div className='flex items-center justify-between md:px-10 px-5 py-5 bg-slate-50 fixed bottom-0 w-full md:hidden border-t rounded-t-2xl border-gray-300 shadow-md'>
        <Link href='/home/home-personal' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/home.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Home</h1>
        </Link>
      <Link href='/home/home-personal/savings' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>  
            <Image src='/images/event.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Events</h1>
        </Link>
        <Link href='/home/home-personal/advisors' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/add.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Upload</h1>
        </Link>
      <Link href='/home/home-personal/invest' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/group.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Meetups</h1>
        </Link>
      <Link href='/home/home-personal/debt' className='flex items-center justify-center flex-col gap-2 cursor-pointer'>
            <Image src='/images/user.png' alt='budget' width={20} height={20}/>
            <h1 className='font-poppins text-sm font-semibold'>Profile</h1>
        </Link>
     
    </div>
  )
}

export default BottomBar