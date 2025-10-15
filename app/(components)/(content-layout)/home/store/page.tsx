"use client"

import React from 'react'
import Hero from './components/Hero'
import LatestCollection from './components/LatestCollection'
import BestSeller from './components/BestSeller'
import OurPolicy from './components/OurPolicy'
import NewsletterBox from './components/NewsletterBox'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Latest Collection */}
      <LatestCollection />

      {/* Best Seller Section */}
      <BestSeller />

      {/* Our Policy Section */}
      <OurPolicy />

      {/* Newsletter Box Section */}
      <NewsletterBox />
    </div>
  )
}

export default Home
