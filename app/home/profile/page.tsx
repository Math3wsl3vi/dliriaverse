import PostsPart from '@/components/profile/PostsPart'
import TopPart from '@/components/profile/TopPart'
import React from 'react'

const ProfilePage = () => {
  return (
    <div>
      {/* top part */}
      <TopPart/>
      {/* my posts */}
      <PostsPart/>
      {/* my events */}
      {/* my meetups */}
    </div>
  )
}

export default ProfilePage