import Navbar from '@/components/shared/navbar-form';
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
      <div>
        test
      </div>
      {children}
    </div>
              <Footer />
              </>
  )
}
