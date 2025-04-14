
import Image from 'next/image'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-gray-100 p-4 font-poppins mt-[78px]">
      <nav className="flex flex-col gap-5">
        <Link href="/home" className="hover:rounded-md hover:bg-gray-200 p-2 text-lg flex flex-row items-center gap-4">
        <Image src='/images/home.png' alt='image' width={20} height={20} className='object-contain'/>
        <h1>HOME</h1>
        </Link>
        <Link href="/home/events-page" className="hover:rounded-md hover:bg-gray-200 p-2 text-lg flex flex-row items-center gap-4">
        <Image src='/images/home.png' alt='image' width={20} height={20} className='object-contain'/>
        <h1>EVENTS</h1>
        </Link>
        <Link href="/home/upload" className="hover:rounded-md hover:bg-gray-200 p-2 text-lg flex flex-row items-center gap-4">
        <Image src='/images/home.png' alt='image' width={20} height={20} className='object-contain'/>
        <h1>UPLOAD</h1>
        </Link>
        <Link href="/home/meetups" className="hover:rounded-md hover:bg-gray-200 p-2 text-lg flex flex-row items-center gap-4">
        <Image src='/images/home.png' alt='image' width={20} height={20} className='object-contain'/>
        <h1>MEETUPS</h1>
        </Link>
        <Link href="/home/profile" className="hover:rounded-md hover:bg-gray-200 p-2 text-lg flex flex-row items-center gap-4">
        <Image src='/images/home.png' alt='image' width={20} height={20} className='object-contain'/>
        <h1>PROFILE</h1>
        </Link>
      </nav>
    </div>
  )
}

export default Sidebar
