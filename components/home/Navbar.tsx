"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    
  return (
    <div className='flex items-center justify-between md:px-10 px-5 py-5 bg-slate-50 fixed top-0 w-full z-50'>
       <Link href='/home' className='text-lg'>D L I R I A V E R S E</Link>
       <div 
       className='border rounded-full border-gray-300 p-2 cursor-pointer'
        onClick={() => setSidebarOpen(true)} >
        <Image src='/images/bell.png' alt='menu' height={20} width={20} />
       </div>

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
         <Image src='/images/close.png' alt='menu' height={20} width={20} />
        </button>

        <div className="flex flex-col mt-10 px-6">
          <h1 className='font-poppins'>Notifications</h1>
          <p className='font-poppins text-gray-500'>You have no notifications for now</p>
          
        </div>
      </div>
    </div>
  )
}

export default Navbar