import { getAllUserConnections } from '../../../helpers/data'
import clsx from 'clsx'
import Image from 'next/image'
import LoadMoreButton from './components/LoadMoreButton'
import Link from 'next/link'


const Connections = async () => {
  const allConnections = await getAllUserConnections()
  
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Card Header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Connections</h2>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {allConnections.map((connection, idx) => (
          <div 
            key={idx} 
            className="mb-6 last:mb-0 md:flex md:items-center"
          >
            {/* Avatar */}
            <div className="mb-4 md:mb-0 md:mr-4">
              {connection.user?.avatar && (
                <button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <div className="relative h-14 w-14 overflow-hidden rounded-full">
                    <Image
                      src={connection.user.avatar}
                      alt={connection.user.name || 'User avatar'}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              {/* Name and Role */}
              <div className="mb-2 flex flex-col sm:flex-row sm:items-start">
                <h6 className="text-sm font-medium text-gray-900">
                  <Link href="#" className="hover:text-blue-600">
                    {connection.user?.name}
                  </Link>
                </h6>
                <p className="mt-1 text-xs text-gray-500 sm:mt-0 sm:ml-2">
                  {connection.role}
                </p>
              </div>

              {/* Shared Connections and Description */}
              <div className="flex flex-wrap items-center">
                {connection?.sharedConnectionAvatars && (
                  <div className="mb-2 mr-3 flex items-center md:mb-0">
                    <div className="-space-x-2 flex">
                      {connection.sharedConnectionAvatars.map((avatar, idx) => (
                        <div 
                          key={idx} 
                          className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-white"
                        >
                          <Image
                            src={avatar}
                            alt="Shared connection"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-500">
                        <span className="text-xs font-medium text-white">
                          +{Math.floor(Math.random() * 10)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className={clsx(
                  'text-xs text-gray-600',
                  { 'mt-2 md:mt-0': connection.sharedConnectionAvatars }
                )}>
                  {connection.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex md:mt-0 md:ml-auto">
              <button className="mr-2 rounded-lg bg-red-50 px-4 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Remove
              </button>
              <button className="rounded-lg bg-blue-50 px-4 py-2 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Message
              </button>
            </div>
          </div>
        ))}

        {/* Load More Button */}
        <div className="mt-8 flex justify-center">
          <LoadMoreButton />
        </div>
      </div>
    </div>
  )
}

export default Connections