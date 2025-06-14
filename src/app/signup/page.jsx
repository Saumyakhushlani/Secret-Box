import React from 'react'
import Form from '@/Components/Form'
import Header from '@/Components/Header'
import Footer from '@/Components/Footer'

const page = () => {
  return (
    <div className='min-h-screen'>
     <Header/>
    <div className='flex flex-col justify-center items-center px-4 py-10 bg-gradient-to-br from-[#4212de30] to-[#4212de05]'>
      <Form/>
    </div>
    <Footer/>
    </div>
  )
}

export default page
