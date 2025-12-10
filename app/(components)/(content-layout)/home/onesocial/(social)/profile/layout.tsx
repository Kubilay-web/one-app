'use client'
import GlightBox from '../../components/GlightBox'
import { useFetchData } from '../../hooks/useFetchData'
import type { ChildrenType } from '../../types/component'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  BsBookmark,
  BsBriefcase,
  BsCalendar2Plus,
  BsCalendarDate,
  BsChatLeftText,
  BsEnvelope,
  BsFileEarmarkPdf,
  BsGear,
  BsGeoAlt,
  BsHeart,
  BsLock,
  BsPatchCheckFill,
  BsPencilFill,
  BsPersonX,
  BsThreeDots,
} from 'react-icons/bs'
import { FaPlus } from 'react-icons/fa6'

import { PROFILE_MENU_ITEMS } from '../../assets/data/menu-items'
import { getAllUsers } from '../../helpers/data'
import { experienceData } from './data'

import avatar7 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/07.jpg'
import background5 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/bg/05.jpg'

import album1 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/albums/01.jpg'
import album2 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/albums/02.jpg'
import album3 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/albums/03.jpg'
import album4 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/albums/04.jpg'
import album5 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/albums/05.jpg'

const Experience = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h5 className="text-lg font-semibold text-gray-900">Experience</h5>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100">
          <FaPlus className="h-4 w-4" />
        </button>
      </div>
      <div className="p-6 pt-0">
        {experienceData.map((experience, idx) => (
          <div className="flex items-start py-4 first:pt-6 last:pb-0" key={idx}>
            <div className="mr-3 flex-shrink-0">
              <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={experience.logo}
                    alt={experience.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <h6 className="text-sm font-semibold text-gray-900">
                <Link href="#" className="hover:text-blue-600">
                  {experience.title}
                </Link>
              </h6>
              <div className="mt-1 flex items-center">
                <p className="text-sm text-gray-600">{experience.description}</p>
                <Link
                  href="#"
                  className="ml-2 rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Photos = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col items-start justify-between border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center">
        <h5 className="text-lg font-semibold text-gray-900">Photos</h5>
        <button className="mt-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 sm:mt-0">
          See all photo
        </button>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div className="col-span-2 sm:col-span-1">
            <GlightBox href={album1.src} data-gallery="image-popup">
              <div className="overflow-hidden rounded-lg">
                <Image
                  className="h-32 w-full object-cover transition-transform hover:scale-105"
                  src={album1}
                  alt="Album image 1"
                  width={300}
                  height={128}
                />
              </div>
            </GlightBox>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <GlightBox href={album2.src} data-gallery="image-popup">
              <div className="overflow-hidden rounded-lg">
                <Image
                  className="h-32 w-full object-cover transition-transform hover:scale-105"
                  src={album2}
                  alt="Album image 2"
                  width={300}
                  height={128}
                />
              </div>
            </GlightBox>
          </div>
          <div>
            <GlightBox href={album3.src} data-gallery="image-popup">
              <div className="overflow-hidden rounded-lg">
                <Image
                  className="h-32 w-full object-cover transition-transform hover:scale-105"
                  src={album3}
                  alt="Album image 3"
                  width={300}
                  height={128}
                />
              </div>
            </GlightBox>
          </div>
          <div>
            <GlightBox href={album4.src} data-gallery="image-popup">
              <div className="overflow-hidden rounded-lg">
                <Image
                  className="h-32 w-full object-cover transition-transform hover:scale-105"
                  src={album4}
                  alt="Album image 4"
                  width={300}
                  height={128}
                />
              </div>
            </GlightBox>
          </div>
          <div>
            <GlightBox href={album5.src} data-gallery="image-popup">
              <div className="overflow-hidden rounded-lg">
                <Image
                  className="h-32 w-full object-cover transition-transform hover:scale-105"
                  src={album5}
                  alt="Album image 5"
                  width={300}
                  height={128}
                />
              </div>
            </GlightBox>
          </div>
        </div>
      </div>
    </div>
  )
}

const Friends = () => {
  const allFriends = useFetchData(getAllUsers)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col items-start justify-between border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center">
          <h5 className="text-lg font-semibold text-gray-900">Friends</h5>
          <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">230</span>
        </div>
        <button className="mt-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 sm:mt-0">
          See all friends
        </button>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-3">
          {allFriends?.slice(0, 4).map((friend, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="p-3 pb-2 text-center">
                <div className={clsx('relative mx-auto', { 
                  'before:absolute before:-inset-1 before:rounded-full before:border-2 before:border-blue-500': friend.isStory 
                })}>
                  <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src={friend.avatar}
                        alt={friend.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                </div>
                <h6 className="mt-3 text-sm font-semibold text-gray-900">
                  <Link href="#" className="hover:text-blue-600">
                    {friend.name}
                  </Link>
                </h6>
                <p className="mt-1 text-xs text-gray-600 leading-snug">
                  {friend.mutualCount} mutual connections
                </p>
              </div>
              <div className="flex border-t border-gray-100 p-2">
                <button
                  className="mr-1 flex-1 rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
                  data-tooltip="Send message"
                  title="Send message"
                >
                  <BsChatLeftText className="mx-auto h-4 w-4" />
                </button>
                <button
                  className="ml-1 flex-1 rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                  data-tooltip="Remove friend"
                  title="Remove friend"
                >
                  <BsPersonX className="mx-auto h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
        aria-expanded={isOpen}
        aria-label="Profile actions"
      >
        <BsThreeDots className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BsBookmark className="mr-3 h-4 w-4 text-gray-400" />
              Share profile in a message
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BsFileEarmarkPdf className="mr-3 h-4 w-4 text-gray-400" />
              Save your profile to PDF
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BsLock className="mr-3 h-4 w-4 text-gray-400" />
              Lock profile
            </a>
            <div className="my-1 border-t border-gray-100" />
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <BsGear className="mr-3 h-4 w-4 text-gray-400" />
              Profile settings
            </a>
          </div>
        </>
      )}
    </div>
  )
}

const ProfileLayout = ({ children }: ChildrenType) => {
  const pathName = usePathname()

  return (
    <>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  {/* Cover Photo */}
                  <div
                    className="h-48 rounded-t-xl bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${background5.src})`,
                    }}
                  />

                  {/* Profile Info */}
                  <div className="relative px-6 pb-6">
                    <div className="flex flex-col items-start sm:flex-row sm:items-start">
                      {/* Avatar */}
                      <div className="-mt-12 sm:-mt-16">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg sm:h-32 sm:w-32">
                          <Image
                            src={avatar7}
                            alt="Sam Lanson"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Profile Details */}
                      <div className="mt-4 sm:ml-6 sm:mt-3">
                        <h1 className="flex items-center text-xl font-bold text-gray-900 sm:text-2xl">
                          Sam Lanson
                          <BsPatchCheckFill className="ml-1 h-4 w-4 text-green-500 sm:h-5 sm:w-5" />
                        </h1>
                        <p className="mt-1 text-gray-600">250 connections</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex sm:ml-auto sm:mt-3">
                        <button className="mr-3 flex items-center rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100">
                          <BsPencilFill className="mr-2 h-4 w-4" />
                          Edit profile
                        </button>
                        <ProfileDropdown />
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 sm:justify-start">
                      <span className="flex items-center">
                        <BsBriefcase className="mr-1.5 h-4 w-4" />
                        Lead Developer
                      </span>
                      <span className="flex items-center">
                        <BsGeoAlt className="mr-1.5 h-4 w-4" />
                        New Hampshire
                      </span>
                      <span className="flex items-center">
                        <BsCalendar2Plus className="mr-1.5 h-4 w-4" />
                        Joined on Nov 26, 2019
                      </span>
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="border-t border-gray-100 px-6 py-4">
                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                      {PROFILE_MENU_ITEMS.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.url ?? ''}
                          className={clsx(
                            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            pathName === item.url
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          )}
                        >
                          {item.label}
                          {item.badge && (
                            <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                              {item.badge.text}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                {children}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div>
              <div className="space-y-6">
                {/* About Card */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-100 px-6 py-4">
                    <h5 className="text-lg font-semibold text-gray-900">About</h5>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700">
                      He moonlights difficult engrossed it, sportsmen. Interested has all Devonshire difficulty gay assistance joy.
                    </p>
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-center text-sm text-gray-600">
                        <BsCalendarDate className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                        Born: <span className="ml-1 font-medium text-gray-900">October 20, 1990</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <BsHeart className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                        Status: <span className="ml-1 font-medium text-gray-900">Single</span>
                      </li>
                      <li className="flex items-center text-sm text-gray-600">
                        <BsEnvelope className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                        Email: <span className="ml-1 font-medium text-gray-900">stackbros07@gmail.com</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Experience */}
                <Experience />

                {/* Photos */}
                <Photos />

                {/* Friends */}
                <Friends />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ProfileLayout