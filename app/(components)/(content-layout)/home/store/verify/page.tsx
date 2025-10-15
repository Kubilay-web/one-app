"use client"

import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'  // Use Next.js's useRouter
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
  const router = useRouter()
  
  // Check if router.query is populated, and destructure only when it's available
  const { success, orderId } = router.query || {}

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { success, orderId },
        { headers: { token } }
      )

      if (response.data.success) {
        setCartItems({})
        router.push('/home/store/orders')  // Use Next.js's router.push for navigation
      } else {
        router.push('home/store/cart')  // Navigate to cart if payment is not successful
      }

    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (success && orderId) {
      verifyPayment()  // Only call verifyPayment if success and orderId are present
    }
  }, [success, orderId, token])  // Re-run when any dependency changes

  return (
    <div>
      {/* Optional loading spinner or message can go here */}
    </div>
  )
}

export default Verify
