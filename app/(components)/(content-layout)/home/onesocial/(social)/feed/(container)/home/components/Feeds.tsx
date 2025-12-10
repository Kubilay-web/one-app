'use client'

import { useEffect, useState } from 'react'
import { getAllFeeds } from '../../../../../helpers/data'
import Image from 'next/image'
import type { ReactNode } from 'react'
import {
  BsBookmark,
  BsBookmarkCheck,
  BsChatFill,
  BsEnvelope,
  BsFlag,
  BsHeart,
  BsHeartFill,
  BsInfoCircle,
  BsLink,
  BsPencilSquare,
  BsPersonX,
  BsReplyFill,
  BsSendFill,
  BsShare,
  BsSlashCircle,
  BsThreeDots,
  BsXCircle,
} from 'react-icons/bs'
import People from './People'

import avatar4 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/04.jpg'
import logo11 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/logo/11.svg'
import logo12 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/logo/12.svg'
import logo13 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/logo/13.svg'
import postImg2 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/post/3by2/02.jpg'
import postImg4 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/post/3by2/03.jpg'
import PostCard from '../../../../../components/cards/PostCard'
import Link from 'next/link'
import LoadMoreButton from './LoadMoreButton'
import SuggestedStories from './SuggestedStories'

const ActionMenu = ({ name }: { name?: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded-md transition-colors duration-200"
      >
        <BsThreeDots size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <BsBookmark className="mr-3" size={18} />
              Save post
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <BsPersonX className="mr-3" size={18} />
              Unfollow {name}
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <BsXCircle className="mr-3" size={18} />
              Hide post
            </button>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <BsSlashCircle className="mr-3" size={18} />
              Block
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <BsFlag className="mr-3" size={18} />
              Report post
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const SponsoredCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-4">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-3">
              <button className="w-full h-full">
                <Image 
                  className="rounded-full object-cover w-full h-full" 
                  src={logo12} 
                  alt="Bootstrap logo" 
                  width={40}
                  height={40}
                />
              </button>
            </div>

            <div>
              <h6 className="font-semibold text-gray-800 dark:text-white mb-0">
                <Link href="#" className="hover:text-blue-500 dark:hover:text-blue-400">
                  Bootstrap: Front-end framework
                </Link>
              </h6>
              <Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 flex items-center">
                Sponsored
                <BsInfoCircle className="ml-1.5" size={14} title="You're seeing this ad because your activity meets the intended audience of our site." />
              </Link>
            </div>
          </div>
          <ActionMenu />
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">Quickly design and customize responsive mobile-first sites with Bootstrap.</p>
      </div>
      
      <div className="relative w-full h-64">
        <Image 
          src={postImg2} 
          alt="Bootstrap framework showcase" 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400 mb-0">Currently v5.1.3</p>
        <button className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-sm font-medium transition-colors">
          Download now
        </button>
      </div>
    </div>
  )
}

const Post2 = () => {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-4">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-3">
              <button className="w-full h-full">
                <Image 
                  className="rounded-full object-cover w-full h-full" 
                  src={logo13} 
                  alt="Apple Education logo" 
                  width={40}
                  height={40}
                />
              </button>
            </div>

            <div>
              <h6 className="font-semibold text-gray-800 dark:text-white mb-0">
                <Link href="#" className="hover:text-blue-500 dark:hover:text-blue-400">
                  Apple Education
                </Link>
              </h6>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-0">9 November at 23:29</p>
            </div>
          </div>
          <ActionMenu />
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Find out how you can save time in the classroom this year. Earn recognition while you learn new skills on iPad and Mac. Start recognition
          your first Apple Teacher badge today!
        </p>

        <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-3 text-sm">
          <div className="flex items-center">
            <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
              <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center mr-2">
                <BsHeartFill size={10} />
              </span>
              Louis, Billy and 126 others
            </Link>
          </div>
          <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
            <BsChatFill size={18} className="mr-2" />
            Comments (12)
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <BsHeart className="mr-2" size={18} />
            Liked (56)
          </Link>

          <div className="relative">
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <BsReplyFill className="transform rotate-180 mr-2" size={18} />
              Share (3)
            </button>

            {shareOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsEnvelope className="mr-3" size={18} />
                    Send via Direct Message
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsBookmarkCheck className="mr-3" size={18} />
                    Bookmark
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsLink className="mr-3" size={18} />
                    Copy link to post
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsShare className="mr-3" size={18} />
                    Share post via …
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsPencilSquare className="mr-3" size={18} />
                    Share to News Feed
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <BsSendFill className="mr-2" size={18} />
            Send
          </Link>
        </div>
      </div>
    </div>
  )
}

const CommonPost = ({ children }: { children: ReactNode }) => {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-4">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-3">
              <button className="w-full h-full">
                <Image 
                  className="rounded-full object-cover w-full h-full" 
                  src={avatar4} 
                  alt="All in the Mind" 
                  width={40}
                  height={40}
                />
              </button>
            </div>

            <div>
              <h6 className="font-semibold text-gray-800 dark:text-white mb-0">
                <Link href="#" className="hover:text-blue-500 dark:hover:text-blue-400">
                  All in the Mind
                </Link>
              </h6>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-0">9 November at 23:29</p>
            </div>
          </div>
          <ActionMenu />
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">How do you protect your business against cyber-crime?</p>

        {children}

        <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-3 my-4 text-sm">
          <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
            263 votes
          </Link>
          <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
            2d left
          </Link>
        </div>

        <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-3 text-sm">
          <div className="flex items-center">
            <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
              <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center mr-2">
                <BsHeartFill size={10} />
              </span>
              Louis, Billy and 126 others
            </Link>
          </div>
          <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
            <BsChatFill size={18} className="mr-2" />
            Comments (12)
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <BsHeart className="mr-2" size={18} />
            Liked (56)
          </Link>

          <div className="relative">
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <BsReplyFill className="transform rotate-180 mr-2" size={18} />
              Share (3)
            </button>

            {shareOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsEnvelope className="mr-3" size={18} />
                    Send via Direct Message
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsBookmarkCheck className="mr-3" size={18} />
                    Bookmark
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsLink className="mr-3" size={18} />
                    Copy link to post
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsShare className="mr-3" size={18} />
                    Share post via …
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsPencilSquare className="mr-3" size={18} />
                    Share to News Feed
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <BsSendFill className="mr-2" size={18} />
            Send
          </Link>
        </div>
      </div>
    </div>
  )
}

const Post3 = () => {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-4">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-3">
              <button className="w-full h-full">
                <Image 
                  className="rounded-full object-cover w-full h-full" 
                  src={logo11} 
                  alt="StackBros logo" 
                  width={40}
                  height={40}
                />
              </button>
            </div>
            <div>
              <h6 className="font-semibold text-gray-800 dark:text-white mb-0">
                <Link href="#" className="hover:text-blue-500 dark:hover:text-blue-400">
                  StackBros
                </Link>
              </h6>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-0">9 December at 10:00</p>
            </div>
          </div>
          <ActionMenu />
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          The next-generation blog, news, and magazine theme for you to start sharing your content today with beautiful aesthetics! This minimal &amp;
          clean Bootstrap 5 based theme is ideal for all types of sites that aim to provide users with content. <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">#bootstrap</Link>{' '}
          <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">#stackbros</Link> <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">#getbootstrap</Link>{' '}
          <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">#bootstrap5</Link>
        </p>
      </div>

      <button className="w-full relative h-64">
        <Image 
          src={postImg4} 
          alt="Blogzine theme showcase" 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </button>

      <div className="p-6 bg-gray-50 dark:bg-gray-700">
        <Link href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline block mb-1">
          https://stackbros.in/blogzine/
        </Link>
        <h6 className="font-semibold text-gray-800 dark:text-white mb-1">Blogzine - Blog and Magazine Bootstrap 5 Theme</h6>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">Bootstrap based News, Magazine and Blog Theme</p>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <BsHeart className="mr-2" size={18} />
            Liked (56)
          </Link>
          
          <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <BsChatFill className="mr-2" size={18} />
            Comments (12)
          </Link>

          <div className="relative">
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <BsReplyFill className="transform rotate-180 mr-2" size={18} />
              Share (3)
            </button>

            {shareOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsEnvelope className="mr-3" size={18} />
                    Send via Direct Message
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsBookmarkCheck className="mr-3" size={18} />
                    Bookmark
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsLink className="mr-3" size={18} />
                    Copy link to post
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsShare className="mr-3" size={18} />
                    Share post via …
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BsPencilSquare className="mr-3" size={18} />
                    Share to News Feed
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <BsSendFill className="mr-2" size={18} />
            Send
          </Link>
        </div>
      </div>
    </div>
  )
}

const Feeds = () => {
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const postData = [
    { progress: 25, title: 'We have cybersecurity insurance coverage' },
    { progress: 15, title: 'Our dedicated staff will protect us' },
    { progress: 10, title: 'We give regular training for best practices' },
    { progress: 55, title: 'Third-party vendor protection' },
  ]

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getAllFeeds()
        setAllPosts(posts)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/6"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {allPosts.map((post, idx) => (
        <PostCard {...post} key={idx} />
      ))}

      <SponsoredCard />
      <Post2 />
      {/* <People /> */}
      
      <CommonPost>
        <div className="space-y-3">
          {['option', 'option2', 'option3', 'option4'].map((id, idx) => (
            <div key={id}>
              <input type="radio" className="hidden peer" name="poll" id={id} />
              <label 
                htmlFor={id}
                className="block w-full p-3 text-center border border-blue-200 dark:border-blue-700 rounded-lg text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:border-blue-500 dark:peer-checked:border-blue-500"
              >
                {postData[idx].title}
              </label>
            </div>
          ))}
        </div>
      </CommonPost>

      <CommonPost>
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>16/20 responded</span>
            <span>Results not visible to participants</span>
          </div>
          
          <div className="space-y-4">
            {postData.map((item, idx) => (
              <div className="flex items-center justify-between" key={idx}>
                <div className="flex-1 mr-4 relative">
                  <div className="bg-blue-50 dark:bg-blue-900/20 h-8 rounded overflow-hidden relative">
                    <div 
                      className="bg-blue-100 dark:bg-blue-800 h-full transition-all duration-500 ease-out"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center px-3 text-sm font-normal text-gray-700 dark:text-gray-300 truncate">
                      {item.title}
                    </span>
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">{item.progress}%</div>
              </div>
            ))}
          </div>
        </div>
      </CommonPost>

      <Post3 />

      {/* <SuggestedStories /> */}

      <LoadMoreButton />
    </div>
  )
}

export default Feeds