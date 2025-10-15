"use client"

import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ShopContext } from '../../context/ShopContext'
import Image from 'next/image'
import { assets } from '../../assets/assets'
import RelatedProducts from '../../components/RelatedProducts'

const Product = () => {
  const { productId } = useParams()
  const { products, currency, addToCart } = useContext(ShopContext)

  const [productData, setProductData] = useState<any>(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  useEffect(() => {
    const fetchProductData = () => {
      const product = products.find((item) => item.id === productId)
      if (product) {
        setProductData(product)
        setImage(product.images?.[0] || '') // ✅ Güvenli erişim
      }
    }

    if (productId && products.length > 0) {
      fetchProductData()
    }
  }, [productId, products])

  if (!productData) return <div className="opacity-0"></div> // loading state


  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Display */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        
        {/* Image Gallery */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.images?.map((item: string, index: number) => (
              <div key={index} className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer">
                <Image
                  src={item}
                  alt={`product-image-${index}`}
                  width={100}
                  height={100}
                  objectFit="cover"
                  onClick={() => setImage(item)}
                />
              </div>
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <Image
              className="w-full h-auto"
              src={image}
              alt="Main Product Image"
              width={600}
              height={600}
              objectFit="contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, index) => (
              <Image key={index} src={assets.star_icon} alt="Star" width={16} height={16} />
            ))}
            <Image src={assets.star_dull_icon} alt="Star" width={16} height={16} />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{currency}{productData.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          {/* Size Selection */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes?.map((item: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(productData.id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the buying and selling of products or
            services over the internet. It serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct transactions without the need for a
            physical presence.
          </p>
          <p>
            E-commerce websites typically display products or services along with detailed descriptions, images,
            prices, and any available variations (e.g., sizes, colors).
          </p>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  )
}

export default Product
