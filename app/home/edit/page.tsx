import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import React from 'react'

const EditProfile = () => {
  return (
    <div className="pl-3 flex flex-col items-center gap-3 mb-2">
    <div className="border-2 border-blue-300 p-1.5 rounded-full">
    <Image
       src="/images/newpic.jpeg"
       alt="profile pic"
       width={150}
       height={150}
       className="rounded-full w-32 h-32 object-center cursor-pointer"
     />
    </div>
    <button className='font-poppins text-blue-600 underline text-sm'>Change Profile Picture</button>
    <div className='w-[90%]'>
    <Label id='username' className='font-poppins'>Enter Username</Label>
    <Input placeholder='Username' name='username' className='w-full font-poppins'/>
    </div>
    <div className='w-[90%]'>
    <Label className='font-poppins' id='bio'>Bio</Label>
    <Textarea className='w-full font-poppins' name='bio' placeholder='Enter Bio'/>
    </div>
    <div className='w-[90%]'>
        <Button className='w-full bg-navy-1 font-poppins mt-5'>Save Changes</Button>
    </div>
   </div>
  )
}

export default EditProfile