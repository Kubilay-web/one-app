"use client"

import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Link from 'next/link' // Using Next.js Link component
import Image from 'next/image' // Using Next.js Image component
import { assets } from '../assets/assets'

const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const { setShowSearch, navigate, getCartCount } = useContext(ShopContext)

    return (
        <div className="flex items-center justify-between py-5 font-medium">
            {/* Logo */}
            <Link href="/home/store">
                <Image
                    className="w-36"
                    src={assets.logo}
                    alt="Logo"
                    width={144}
                    height={36}
                />
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
                <Link href="/home/store">
                    <div className="flex flex-col items-center gap-1">
                        <p>HOME</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                    </div>
                </Link>
                <Link href="/home/store/collection">
                    <div className="flex flex-col items-center gap-1">
                        <p>COLLECTION</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                    </div>
                </Link>
                <Link href="/home/store/about">
                    <div className="flex flex-col items-center gap-1">
                        <p>ABOUT</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                    </div>
                </Link>
                <Link href="/home/store/contact">
                    <div className="flex flex-col items-center gap-1">
                        <p>CONTACT</p>
                        <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
                    </div>
                </Link>
            </ul>

            {/* Navbar Icons and Cart */}
            <div className="flex items-center gap-6">
                <Image
                    onClick={() => { setShowSearch(true); navigate('/home/store/collection') }}
                    className="w-5 cursor-pointer"
                    src={assets.search_icon}
                    alt="Search"
                    width={20}
                    height={20}
                />
                <div className="group relative">
                    <Image
                        onClick={() => { navigate('/home/store') }}
                        className="w-5 cursor-pointer"
                        src={assets.profile_icon}
                        alt="Profile"
                        width={20}
                        height={20}
                    />

                    {/* Dropdown Menu */}
                    <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                        <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                            <p onClick={() => { }} className="cursor-pointer hover:text-black">My Profile</p>
                            <p onClick={() => navigate('/home/store/orders')} className="cursor-pointer hover:text-black">Orders</p>
                            <p onClick={() => { }} className="cursor-pointer hover:text-black">Logout</p>
                        </div>
                    </div>
                </div>
                <Link href="/home/store/cart">
                    <div className="relative">
                        <Image
                            className="w-5 min-w-5"
                            src={assets.cart_icon}
                            alt="Cart"
                            width={20}
                            height={20}
                        />
                        <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                            {getCartCount()}
                        </p>
                    </div>
                </Link>
                <Image
                    onClick={() => setVisible(true)}
                    className="w-5 cursor-pointer sm:hidden"
                    src={assets.menu_icon}
                    alt="Menu"
                    width={20}
                    height={20}
                />
            </div>

            {/* Sidebar Menu For Small Screens */}
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className="flex flex-col text-gray-600">
                    <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3">
                        <Image className="h-4 rotate-180" src={assets.dropdown_icon} alt="Back" width={16} height={16} />
                        <p>Back</p>
                    </div>
                    <Link href="/home/store">
                        <div onClick={() => setVisible(false)} className="py-2 pl-6 border">HOME</div>
                    </Link>
                    <Link href="/home/store/collection">
                        <div onClick={() => setVisible(false)} className="py-2 pl-6 border">COLLECTION</div>
                    </Link>
                    <Link href="/home/store/about">
                        <div onClick={() => setVisible(false)} className="py-2 pl-6 border">ABOUT</div>
                    </Link>
                    <Link href="/home/store/contact">
                        <div onClick={() => setVisible(false)} className="py-2 pl-6 border">CONTACT</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar;
