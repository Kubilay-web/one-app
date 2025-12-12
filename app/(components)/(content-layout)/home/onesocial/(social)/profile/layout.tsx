'use client'

import { useState, useEffect } from 'react'
import GlightBox from '../../components/GlightBox'
import { ChildrenType } from '../../types/component'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
import EditProfileModal from '../../components/EditProfileModal'
import avatar7 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/07.jpg'
import background5 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/bg/05.jpg'

import album1 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/albums/01.jpg'
import album2 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/albums/02.jpg'
import album3 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/albums/03.jpg'
import album4 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/albums/04.jpg'
import album5 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/albums/05.jpg'

// Experience component
const Experience = ({ experiences }: { experiences: any[] }) => {
  const [showAll, setShowAll] = useState(false)
  
  const displayExperiences = showAll ? experiences : experiences.slice(0, 3)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h5>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
          <FaPlus className="h-4 w-4" />
        </button>
      </div>
      <div className="p-6 pt-0">
        {displayExperiences.length > 0 ? (
          <>
            {displayExperiences.map((experience, idx) => (
              <div className="flex items-start py-4 first:pt-6 last:pb-0" key={idx}>
                <div className="mr-3 flex-shrink-0">
                  <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={experience.logo || '/default-company.png'}
                        alt={experience.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <h6 className="text-sm font-semibold text-gray-900 dark:text-white">
                    <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                      {experience.title}
                    </Link>
                  </h6>
                  <div className="mt-1 flex items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{experience.description}</p>
                    <Link
                      href="#"
                      className="ml-2 rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {experiences.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {showAll ? 'Show Less' : `Show All (${experiences.length})`}
              </button>
            )}
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No experience added yet</p>
            <button className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Add Experience
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Photos component
const Photos = ({ photos }: { photos: string[] }) => {
  const albumImages = [album1, album2, album3, album4, album5]
  const displayPhotos = photos.length > 0 ? photos.slice(0, 9) : albumImages

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700 sm:flex-row sm:items-center">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Photos</h5>
        <button className="mt-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 sm:mt-0">
          See all photos
        </button>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {displayPhotos.map((photo, idx) => (
            <div key={idx} className="col-span-2 sm:col-span-1">
              <GlightBox href={typeof photo === 'string' ? photo : photo.src} data-gallery="image-popup">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    className="h-32 w-full object-cover transition-transform hover:scale-105"
                    src={typeof photo === 'string' ? photo : photo}
                    alt={`Album image ${idx + 1}`}
                    width={300}
                    height={128}
                  />
                </div>
              </GlightBox>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Friends component
const Friends = ({ friends }: { friends: any[] }) => {
  const [showAll, setShowAll] = useState(false)
  
  const displayFriends = showAll ? friends : friends.slice(0, 4)
  const mockFriends = [
    { id: 1, name: 'John Doe', avatar: avatar7, isStory: true, mutualCount: 24 },
    { id: 2, name: 'Jane Smith', avatar: avatar7, isStory: false, mutualCount: 18 },
    { id: 3, name: 'Alex Johnson', avatar: avatar7, isStory: true, mutualCount: 32 },
    { id: 4, name: 'Sarah Miller', avatar: avatar7, isStory: false, mutualCount: 15 },
  ]
  
  const finalFriends = friends.length > 0 ? friends : mockFriends

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700 sm:flex-row sm:items-center">
        <div className="flex items-center">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Friends</h5>
          <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {finalFriends.length}
          </span>
        </div>
        <button className="mt-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 sm:mt-0">
          See all friends
        </button>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-3">
          {displayFriends.map((friend) => (
            <div key={friend.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="p-3 pb-2 text-center">
                <div className={clsx('relative mx-auto', { 
                  'before:absolute before:-inset-1 before:rounded-full before:border-2 before:border-blue-500': friend.isStory 
                })}>
                  <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src={friend.avatar || avatar7}
                        alt={friend.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                </div>
                <h6 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                  <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                    {friend.name}
                  </Link>
                </h6>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 leading-snug">
                  {friend.mutualCount} mutual connections
                </p>
              </div>
              <div className="flex border-t border-gray-100 dark:border-gray-700 p-2">
                <button
                  className="mr-1 flex-1 rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  data-tooltip="Send message"
                  title="Send message"
                >
                  <BsChatLeftText className="mx-auto h-4 w-4" />
                </button>
                <button
                  className="ml-1 flex-1 rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  data-tooltip="Remove friend"
                  title="Remove friend"
                >
                  <BsPersonX className="mx-auto h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {finalFriends.length > 4 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {showAll ? 'Show Less' : `Load More Friends (${finalFriends.length - 4})`}
          </button>
        )}
      </div>
    </div>
  )
}

// ProfileDropdown component
const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
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
          <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <BsBookmark className="mr-3 h-4 w-4 text-gray-400" />
              Share profile in a message
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <BsFileEarmarkPdf className="mr-3 h-4 w-4 text-gray-400" />
              Save your profile to PDF
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <BsLock className="mr-3 h-4 w-4 text-gray-400" />
              Lock profile
            </a>
            <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
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

// Main ProfileLayout component
const ProfileLayout = ({ children }: ChildrenType) => {
  const pathName = usePathname()
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    fetchProfileData()
  }, [pathName])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/onesocial/profile', {
        credentials: 'include'
      })
      
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setProfileData(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (formData: any) => {
    try {
      const res = await fetch('/api/onesocial/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          // Update local state
          setProfileData((prev: any) => ({
            ...prev,
            user: {
              ...prev.user,
              ...data.data,
              ...formData
            }
          }))
          return data
        }
      }
      throw new Error('Failed to update profile')
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const user = profileData?.user || {}

  console.log("user--",user)
  const friends = profileData?.friends || []
  const photos = profileData?.photos || []
  
  const experienceData = [
    {
      id: 1,
      title: 'Lead Developer',
      description: 'Google Inc. • 2018 - Present',
      logo: '/default-company.png'
    },
    {
      id: 2,
      title: 'Senior Software Engineer',
      description: 'Facebook • 2015 - 2018',
      logo: '/default-company.png'
    },
    {
      id: 3,
      title: 'Software Engineer',
      description: 'Microsoft • 2012 - 2015',
      logo: '/default-company.png'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  {/* Cover Photo */}
                  <div
                    className="h-48 rounded-t-xl bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${user.bannerUrl || user.cover || background5.src})`,
                    }}
                  />

                  {/* Profile Info */}
                  <div className="relative px-6 pb-6">
                    <div className="flex flex-col items-start sm:flex-row sm:items-start">
                      {/* Avatar */}
                      <div className="-mt-12 sm:-mt-16">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-gray-800 sm:h-32 sm:w-32">
                          <Image
                            src={user.avatarUrl || avatar7}
                            alt={user.displayName || 'User'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Profile Details */}
                      <div className="mt-4 sm:ml-6 sm:mt-3">
                        <h1 className="flex items-center text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                          {user.displayName || user.username}
                          <BsPatchCheckFill className="ml-1 h-4 w-4 text-green-500 sm:h-5 sm:w-5" />
                        </h1>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                          {profileData?.stats?.following || 0} connections
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex sm:ml-auto sm:mt-3">
                        <button 
                          onClick={() => setIsEditModalOpen(true)}
                          className="mr-3 flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          <BsPencilFill className="mr-2 h-4 w-4" />
                          Edit profile
                        </button>
                        <ProfileDropdown />
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 sm:justify-start">
                      {user.job && (
                        <span className="flex items-center">
                          <BsBriefcase className="mr-1.5 h-4 w-4" />
                          {user.job}
                        </span>
                      )}
                      {user.location && (
                        <span className="flex items-center">
                          <BsGeoAlt className="mr-1.5 h-4 w-4" />
                          {user.location}
                        </span>
                      )}
                      <span className="flex items-center">
                        <BsCalendar2Plus className="mr-1.5 h-4 w-4" />
                        Joined on {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-700">
                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                      {PROFILE_MENU_ITEMS.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.url ?? ''}
                          className={clsx(
                            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                            pathName === item.url
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                          )}
                        >
                          {item.label}
                          {item.badge && (
                            <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
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
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white">About</h5>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300">
                      {user.bio || user.biosocial || "No bio added yet."}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {user.job && (
                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <BsBriefcase className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                          Works at <span className="ml-1 font-medium text-gray-900 dark:text-white">{user.job}</span>
                        </li>
                      )}
                      {user.relationship && (
                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <BsHeart className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                          Status: <span className="ml-1 font-medium text-gray-900 dark:text-white capitalize">
                            {user.relationship.replace('_', ' ')}
                          </span>
                        </li>
                      )}
                      {user.email && (
                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <BsEnvelope className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                          Email: <span className="ml-1 font-medium text-gray-900 dark:text-white">{user.email}</span>
                        </li>
                      )}
                      {user.college && (
                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <BsCalendarDate className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                          Studied at <span className="ml-1 font-medium text-gray-900 dark:text-white">{user.college}</span>
                        </li>
                      )}
                      {user.hometown && (
                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <BsGeoAlt className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                          From <span className="ml-1 font-medium text-gray-900 dark:text-white">{user.hometown}</span>
                        </li>
                      )}
                      {user.currentCity && (
                        <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <BsGeoAlt className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                          Lives in <span className="ml-1 font-medium text-gray-900 dark:text-white">{user.currentCity}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Experience */}
                <Experience experiences={experienceData} />

                {/* Photos */}
                <Photos photos={photos} />

                {/* Friends */}
                <Friends friends={friends} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdate={handleUpdateProfile}
      />
    </>
  )
}

export default ProfileLayout