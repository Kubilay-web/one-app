"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

const NormalCarousel = ({ 
  images = [], 
  autoplay = true, 
  delay = 5000, 
  section = {},
  className = ""
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const intervalRef = useRef(null);

  // Handle autoplay
  useEffect(() => {
    if (isPlaying && autoplay && images?.length > 1) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, delay);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentSlide, images?.length, autoplay, delay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  const getSlideData = () => {
    // If section has data property with slides, use that
    if (section?.data?.slides && Array.isArray(section.data.slides)) {
      return section.data.slides;
    }
    
    // Fallback to images array
    return images.map((image, index) => ({
      id: image.id || index,
      image: image.url,
      title: section?.title || "Special Offer",
      subtitle: section?.subtitle || "Limited Time",
      link: "/ecommerce/customer/shop",
      alt: image.alt
    }));
  };

  const slides = getSlideData();

  if (!slides || slides.length === 0) {
    return (
      <div className="h-96 bg-light flex items-center justify-center rounded-lg">
        <div className="text-center">
          <i className="bi bi-image text-4xl text-textmuted mb-3"></i>
          <p>No banner images uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      {/* Main Carousel Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={slide.id || index}
            className="w-full flex-shrink-0 relative"
            style={{ height: "400px" }}
          >
            <Image
              src={slide.image || slide.url}
              alt={slide.alt || slide.title || "Banner"}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay for text */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
              <div className="p-8 text-white max-w-lg">
                <h2 className="text-4xl font-bold mb-3">{slide.title}</h2>
                <p className="text-lg mb-6 opacity-90">{slide.subtitle}</p>
                <Link
                  href={slide.link || "/ecommerce/customer/shop"}
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black w-10 h-10 rounded-full flex items-center justify-center transition-all z-10"
            aria-label="Previous slide"
          >
            <i className="bi bi-chevron-left text-xl"></i>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black w-10 h-10 rounded-full flex items-center justify-center transition-all z-10"
            aria-label="Next slide"
          >
            <i className="bi bi-chevron-right text-xl"></i>
          </button>
        </>
      )}

      {/* Indicators/Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Autoplay Control */}
      {slides.length > 1 && (
        <button
          onClick={toggleAutoplay}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center z-10"
          aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
        >
          <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
        </button>
      )}

      {/* Slide Counter */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded z-10">
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </div>
  );
};

export default NormalCarousel;