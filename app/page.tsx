'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { app } from "@/configs/firebaseConfig"
import Image from "next/image"

const featuredImages = [
  '/images/gallery7.jpg', // Large base image
  '/images/gallery6.jpg', // Overlapping smaller image
]

export default function Home() {
  const router = useRouter()
  const auth = getAuth(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/home')
      }
    })

    return () => unsubscribe()
  }, [auth, router])

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12 relative">
      {/* Title Section */}
      <h1 className="text-4xl sm:text-5xl font-poppins text-gray-900 mb-4 tracking-wide z-10">D L I R I A V E R S E</h1>
      <p className="text-xl sm:text-2xl font-poppins text-gray-600 mb-8 text-center max-w-xl z-10">
        Discover, Share, and Explore Kenya in a way that feels yours.
      </p>

      {/* Image Section */}
      <div className="relative w-full flex justify-center items-center mt-6 mb-12">
        {/* Large Image */}
        <div className="relative w-[90%] sm:w-[600px] h-[400px] rounded-3xl overflow-hidden shadow-xl">
          <Image 
            src={featuredImages[0]}
            alt="Main"
            fill
            className="object-cover"
          />
        </div>

        {/* Overlapping Image */}
        <div className="absolute -bottom-10 -right-4 sm:-right-10 sm:-bottom-12 w-48 h-64 rounded-2xl overflow-hidden shadow-md border-4 border-white">
          <Image 
            src={featuredImages[1]}
            alt="Overlapping"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Button & Footer */}
      <Button 
        onClick={() => router.push('/auth')} 
        className="font-poppins px-6 py-3 text-base rounded-md bg-gray-800 hover:bg-gray-900 transition-colors z-10 mt-5"
      >
        Get Started
      </Button>

      <p className="text-sm text-gray-400 font-poppins mt-6 z-10">Now with 20+ early users 🌿</p>
    </div>
  )
}
