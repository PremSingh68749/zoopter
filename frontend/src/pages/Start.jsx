
import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div >
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-center items-center flex-col w-full'>
         <div className='flex flex-col items-center justify-self-center text-center bg-white pb-8 py-4 px-4 w-80 border-4 rounded-md'>
          <h2 className='text-[30px] font-semibold'>Get Started with Zoopter</h2>
          <Link to='/login' className='text-center w-full bg-black text-white py-3 rounded-lg mt-5'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start