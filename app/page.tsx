'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, getAuth } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { app } from "@/configs/firebaseConfig"

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
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center max-w-3xl mx-auto">
      <h1 className="text-blue-600 text-3xl mb-4 font-poppins">D L I R I A V E R S E </h1>
      <p className="mb-6 text-gray-700 font-poppins text-xl">
        Discover, Share and Explore Kenya
      </p>
      <Button onClick={() => router.push('/auth')} className="font-poppins">Get Started</Button>
      <h1 className="font-poppins text-sm text-gray-500 mt-4">20 users</h1>

    </div>
  )
}
