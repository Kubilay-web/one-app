import { getAllNotifications } from '../../../helpers/data'
import { timeSince } from '../../../utils/date'
import Image from 'next/image'
import { useState } from 'react'
import { BsBell, BsBellSlash, BsCheckLg, BsThreeDots, BsTrash, BsVolumeMute } from 'react-icons/bs'
import LoadMoreButton from './components/LoadMoreButton'

const Notifications = async () => {
  const allNotifications = await getAllNotifications()
  
  // Color mapping for text avatars
  const avatarColors: Record<string, string> = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-cyan-600',
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            
            {/* Settings Dropdown */}
            <div className="relative">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <BsThreeDots size={20} />
              </button>
              
              {/* Dropdown Menu */}
              <div className="hidden absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="py-1">
                  <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsCheckLg className="mr-3" size={18} />
                    Mark all read
                  </a>
                  <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsBellSlash className="mr-3" size={18} />
                    Push notifications
                  </a>
                  <a href="#" className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsBell className="mr-3" size={18} />
                    Email notifications
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-4">
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {allNotifications.map((notification, idx) => {
                const isUnread = !notification.isRead
                const avatarVariant = notification.textAvatar?.variant || 'primary'
                
                return (
                  <li 
                    key={idx} 
                    className={`
                      relative p-4 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-750
                      ${isUnread ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''}
                    `}
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              src={notification.avatar}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        ) : notification.textAvatar ? (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${avatarColors[avatarVariant]}`}>
                            <span className="text-white font-bold">
                              {notification.textAvatar.text}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notification.description ? 'mb-0' : 'mb-2'} text-gray-800 dark:text-gray-200`}>
                          {notification.title}
                        </p>
                        
                        {notification.description && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.description}
                          </div>
                        )}
                        
                        {/* Friend Request Actions */}
                        {notification.isFriendRequest && (
                          <div className="flex gap-2 mt-3">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                              Accept
                            </button>
                            <button className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm rounded-lg transition-colors">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Time and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {timeSince(notification.time)}
                        </span>
                        
                        {/* Notification Actions Dropdown */}
                        <div className="relative">
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <BsThreeDots size={16} />
                          </button>
                          
                          <div className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <div className="py-1">
                              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <BsTrash className="mr-3" size={16} />
                                Delete
                              </a>
                              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <BsBellSlash className="mr-3" size={16} />
                                Turn off
                              </a>
                              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <BsVolumeMute className="mr-3" size={16} />
                                Mute Judy Nguyen
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {isUnread && (
                      <div className="absolute top-4 left-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Load More Button */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <LoadMoreButton />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Notifications