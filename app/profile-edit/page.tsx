"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { User, updateProfile } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useDropzone } from 'react-dropzone'
import { Camera, Loader2 } from 'lucide-react'
import { auth, firestore, storage } from '@/configs/firebaseConfig'
import { useToast } from '@/hooks/use-toast'

const ProfileEdit = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Check auth state and redirect if not signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/signup')
      } else {
        setCurrentUser(user)
        checkExistingProfile(user.uid)
      }
    })
    return unsubscribe
  }, [router])

  const checkExistingProfile = async (uid: string) => {
    const docRef = doc(firestore, 'users', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists() && docSnap.data().username) {
      router.push('/home')
    }
  }

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setProfilePic(acceptedFiles[0])
      setPreviewUrl(URL.createObjectURL(acceptedFiles[0]))
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !username || isLoading) return

    setIsLoading(true)

    try {
      // 1. Upload profile picture if selected
      let photoURL = currentUser.photoURL || ''
      if (profilePic) {
        const storageRef = ref(storage, `profile-pics/${currentUser.uid}`)
        const snapshot = await uploadBytes(storageRef, profilePic)
        photoURL = await getDownloadURL(snapshot.ref)
      }

      // 2. Update Firebase auth profile
      await updateProfile(currentUser, {
        displayName: username,
        photoURL: photoURL
      })

      // 3. Create user document in Firestore
      const userDoc = {
        uid: currentUser.uid,
        email: currentUser.email,
        username: username.toLowerCase(),
        displayName: username,
        photoURL,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // 4. Save user document to Firestore
      await setDoc(doc(firestore, 'users', currentUser.uid), userDoc)

      toast({
        title: 'Profile updated!',
        description: 'Your profile has been successfully created.',
      })

      router.push('/')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-poppins">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 relative">
        <h1 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div {...getRootProps()} className="relative group cursor-pointer">
              <Avatar className="w-24 h-24 border-2 border-gray-200">
                <AvatarImage src={previewUrl || currentUser?.photoURL || ''} />
                <AvatarFallback className="bg-gray-100">
                  {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <input {...getInputProps()} />
            </div>
            <p className="text-sm text-gray-500 mt-2">Click to change profile photo</p>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              minLength={3}
              className="w-full"
            />
            {username.length > 0 && username.length < 3 && (
              <p className="text-sm text-red-500 mt-1">Username must be at least 3 characters</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!username || username.length < 3 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ProfileEdit