"use client"

import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import Image from 'next/image' // Use Next.js Image component

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        {/* Replaced img with Image component from Next.js */}
        <div className="relative w-full md:max-w-[480px]">
          <Image
            src={assets.contact_img} // Path to your image
            alt="Contact Us Image"
            layout="responsive" // Responsive layout for images
            width={480} // Width of the image
            height={320} // Height of the image
            objectFit="cover" // Ensures the image covers the container while maintaining aspect ratio
          />
        </div>

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className=' text-gray-500'>
            54709 Willms Station <br />
            Suite 350, Washington, USA
          </p>
          <p className=' text-gray-500'>
            Tel: (415) 555-0132 <br />
            Email: admin@forever.com
          </p>
          
          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className=' text-gray-500'>Learn more about our teams and job openings.</p>

          {/* Optional Link to Careers page */}
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Newsletter Box */}
      <NewsletterBox />
    </div>
  )
}

export default Contact
