"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import eventImg from '@/app/(components)/(content-layout)/home/onesocial/assets/images/events/01.jpg'
import { BsBookmark, BsCalendarCheck, BsFileEarmarkPdf, BsGear, BsGeoAlt, BsLock, BsPeople, BsThreeDots } from 'react-icons/bs'



const Events = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAlertVisible, setIsAlertVisible] = useState(true)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Card Header */}
      <div className="flex flex-col items-start justify-between border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 sm:mb-0">Discover Events</h2>
        <button className="inline-flex items-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">
          <FaPlus className="mr-2 h-4 w-4" />
          Create events
        </button>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Alert */}
        {isAlertVisible && (
          <div className="relative mb-6 rounded-lg bg-green-50 p-4">
            <button
              onClick={() => setIsAlertVisible(false)}
              className="absolute right-3 top-3 text-green-600 hover:text-green-800"
              aria-label="Close alert"
            >
              ×
            </button>
            <div className="flex flex-col items-start md:flex-row md:items-center">
              <p className="text-sm text-green-800">
                <strong>Upcoming event:</strong> The learning conference on Sep 19 2024
              </p>
              <Link
                href="/events"
                className="mt-2 inline-block rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 md:mt-0 md:ml-4"
              >
                View event
              </Link>
            </div>
          </div>
        )}

        {/* Event Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col items-start sm:flex-row sm:items-center">
            {/* Event Image */}
            <div className="mb-4 sm:mb-0 sm:mr-4">
              <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border-4 border-white shadow-sm">
                  <Image
                    src={eventImg}
                    alt="Comedy on the green event"
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            </div>

            {/* Event Info */}
            <div className="flex-1 sm:ml-4">
              <h5 className="mb-2 text-lg font-semibold text-gray-900">
                <Link href="/event/details" className="hover:text-blue-600">
                  Comedy on the green
                </Link>
              </h5>
              
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <BsCalendarCheck className="mr-2 h-4 w-4 flex-shrink-0" />
                  Mon, Sep 25, 2020 at 9:30 AM
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <BsGeoAlt className="mr-2 h-4 w-4 flex-shrink-0" />
                  San francisco
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <BsPeople className="mr-2 h-4 w-4 flex-shrink-0" />
                  77 going
                </li>
              </ul>
            </div>

            {/* Dropdown Menu */}
            <div className="relative mt-4 sm:mt-0 sm:ml-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                aria-expanded={isDropdownOpen}
                aria-label="Event actions"
              >
                <BsThreeDots className="h-5 w-5" />
              </button>

              {isDropdownOpen && (
                <>
                  {/* Overlay to close dropdown when clicking outside */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <BsBookmark className="mr-3 h-4 w-4 text-gray-400" />
                      Share profile in a message
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <BsFileEarmarkPdf className="mr-3 h-4 w-4 text-gray-400" />
                      Save your profile to PDF
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <BsLock className="mr-3 h-4 w-4 text-gray-400" />
                      Lock profile
                    </a>
                    
                    {/* Divider */}
                    <div className="my-1 border-t border-gray-100" />
                    
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <BsGear className="mr-3 h-4 w-4 text-gray-400" />
                      Profile settings
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events