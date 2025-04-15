"use client"
import { useState, useCallback, useEffect } from 'react'
import { Upload, X, ImagePlus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDropzone } from 'react-dropzone'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, storage, firestore } from '@/configs/firebaseConfig'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const UploadPic = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [uploadType, setUploadType] = useState<'post' | 'event'>('post')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [profilePic, setProfilePic] = useState('') // Add profilePic state

  // Track auth state and get user profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        // Fetch user profile to get username and profile picture
        const userDoc = await getDoc(doc(firestore, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || '')
          setProfilePic(userData.photoURL || '') // Set profile picture
        }
      } else {
        router.push('/auth')
      }
    })
    return () => unsubscribe()
  }, [router])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 10,
    multiple: true
  })

  const removeImage = (index: number) => {
    const newFiles = [...files]
    const newPreviews = [...previews]
    
    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)
    
    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  const handleUpload = async () => {
    if (!currentUser || files.length === 0) {
      toast({
        title: 'Error',
        description: 'Please sign in to upload',
        variant: 'destructive',
      })
      return
    }
    
    setIsUploading(true)
    
    try {
      // Upload images to Firebase Storage
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `${uploadType}s/${currentUser.uid}/${Date.now()}_${file.name}`)
        const snapshot = await uploadBytes(storageRef, file)
        return getDownloadURL(snapshot.ref)
      })

      const imageUrls = await Promise.all(uploadPromises)

      // Save to Firestore with username and profile picture included
      const docData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        username, // Include username from profile
        profilePic, // Include profile picture from profile
        displayName: currentUser.displayName || '',
        images: imageUrls,
        caption,
        name,
        location,
        type: uploadType,
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
        ...(uploadType === 'event' && {
          eventDate: null,
          location: location || ''
        })
      }

      await addDoc(collection(firestore, 'posts'), docData)

      toast({
        title: 'Success!',
        description: `${uploadType === 'post' ? 'Post' : 'Event'} uploaded successfully`,
      })

      // Reset form
      setFiles([])
      setPreviews([])
      setCaption('')
      setName('')
      setLocation('')
    } catch (error) {
      console.error('Error uploading:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Clean up object URLs
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  if (!currentUser) {
    return null
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-poppins">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Create New</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs 
            defaultValue="post" 
            className="w-full mb-6"
            onValueChange={(value) => setUploadType(value as 'post' | 'event')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="post">
                <ImagePlus className="w-4 h-4 mr-2" />
                Post
              </TabsTrigger>
              <TabsTrigger value="event">
                <Calendar className="w-4 h-4 mr-2" />
                Event
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">
              {isDragActive ? (
                'Drop the files here'
              ) : (
                <>
                  Drag & drop photos here, or <span className="text-primary">click to select</span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG, GIF (max 10MB each)</p>
          </div>

          {previews.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <Image 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                      width={300}
                      height={300}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="block text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  placeholder={`Add a ${uploadType} title...`}
                  required
                />
              </div>

            
                <div className="space-y-2">
                  <Label htmlFor="location" className="block text-sm font-medium">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full"
                    placeholder="Add event location..."
                  />
                </div>

              <div className="space-y-2">
                <Label htmlFor="caption" className="block text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full"
                  rows={3}
                  placeholder={`Add a ${uploadType} description...`}
                />
              </div>
            </div>
          )}

          <Button 
            type="button" 
            className="w-full mt-6"
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading || !name}
          >
            {isUploading ? (
              <>
                Uploading...
              </>
            ) : (
              `Upload ${uploadType === 'post' ? 'Post' : 'Event'}`
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default UploadPic