"use client";

import React from 'react';
import Link from 'next/link'; // Next.js'in Link bileşenini kullanıyoruz.
import Image from 'next/image'; // Use next/image for optimized image loading

import addIcon from '../assets/add_icon.png';  // Import images using `next/image`
import orderIcon from '../assets/order_icon.png';

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
            
            <Link href="/dashboards/store/add" className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
                <Image className='w-5 h-5' src={addIcon} alt="Add Items Icon" width={20} height={20} />
                <p className='hidden md:block'>Add Items</p>
            </Link>

            <Link href="/dashboards/store/list" className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
                <Image className='w-5 h-5' src={orderIcon} alt="List Items Icon" width={20} height={20} />
                <p className='hidden md:block'>List Items</p>
            </Link>

            <Link href="/dashboards/store/orders" className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'>
                <Image className='w-5 h-5' src={orderIcon} alt="Orders Icon" width={20} height={20} />
                <p className='hidden md:block'>Orders</p>
            </Link>

        </div>
    </div>
  );
}

export default Sidebar;
