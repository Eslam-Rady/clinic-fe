import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={ assets.about_image } alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
        <p>Welcome to medical cahtbot based on LLM Models — your go-to platform for booking doctor appointments and getting instant medical assistance through our intelligent chatbot. We get it: waiting on hold, navigating confusing portals, and not knowing where to start can be a pain. That’s why we built a simpler, smarter solution.</p>
        <p>
      medical cahtbot based on LLM Models combines smart scheduling with AI-powered medical chat support to streamline your healthcare journey. Whether you're booking a consultation or asking quick health-related questions, our platform is designed to save you time and hassle.</p>
        <b className='text-gray-800'>Our Vision</b>
        <p>
       At  medical cahtbot based on LLM Models, our vision is to make healthcare more accessible, responsive, and user-friendly. We’re bridging the gap between patients and providers by using tech that actually works — when you need answers fast or need to see a doctor, we’re here.

.</p>
        </div>
      </div>
      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[var(--primary)] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>

      </div>
    </div>
  )
}

export default About