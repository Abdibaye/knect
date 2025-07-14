import Navbar from '@/components/shared/navbar-form';
import CreatePost from '@/components/post/CreatePost';
import Footer from '@/components/shared/Footer';
import React from 'react'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)  {
  return (
    <>
    <div className='flex'>
        <CreatePost />
      {children}
    </div>
              <Footer />
              </>
  )
}
