"use client"

import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Link from 'next/link' // Use Next.js Link component
import Image from 'next/image' // Use Next.js Image component

const ProductItem = ({ id,name,images, price }) => {

  const { currency,products } = useContext(ShopContext);
  


  return (
    <Link href={`/home/store/product/${id}`} passHref>
      <div className="text-gray-700 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>

        {/* Image Section */}
        <div className="overflow-hidden">
          <Image
            className="hover:scale-110 transition ease-in-out"
            src={images?.[0]}  // Assuming the `image` is an array
            alt={name} // Use the product name as alt text for accessibility
            width={400}  // You can adjust these values according to your design
            height={400} // You can adjust these values according to your design
            objectFit="cover" // Ensures the image covers the box while maintaining aspect ratio
          />
        </div>

        {/* Product Name and Price */}
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">{currency}{price}</p>

      </div>
    </Link>
  )
}

export default ProductItem;
