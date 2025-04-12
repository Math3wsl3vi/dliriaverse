"use client"
import { auth } from '@/configs/firebaseConfig'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Navbar = () => {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const handleLogout = () => {
        auth.signOut();
        localStorage.removeItem("user");
        router.push("/");
        setSidebarOpen(false);
      };
    
  return (
    <div className='flex items-center justify-between md:px-10 px-5 py-5 bg-slate-50'>
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
          <Link href="/" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
            Home
          </Link>
          <Link href="/profile" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
            Settings
          </Link>
          <Link href="/profile" className="py-2 text-lg border-b" onClick={() => setSidebarOpen(false)}>
            Profile
          </Link>
          <button className="mt-4 w-full text-center bg-green-1 text-white py-2 rounded" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar