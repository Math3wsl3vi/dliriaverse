import PostUser from '@/components/user/PostUser'
import TopPartUser from '@/components/user/TopPartUser'
import React from 'react'

const UserPage = () => {
  return (
    <div>
      {/* top part */}
      <TopPartUser/>
      {/* my posts */}
      {/* my events */}
      <PostUser/>
      {/* my meetups */}
    </div>
  )
}

export default UserPage