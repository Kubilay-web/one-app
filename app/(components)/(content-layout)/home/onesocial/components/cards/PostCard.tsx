import type { SocialPostType } from '../../types/data'
import { timeSince } from '../../utils/date'
import Image from 'next/image'
import { useState } from 'react'
import {
  BsBookmark,
  BsBookmarkCheck,
  BsChatFill,
  BsEnvelope,
  BsFlag,
  BsHandThumbsUpFill,
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
import GlightBox from '../GlightBox'
import LoadContentButton from '../LoadContentButton'
import CommentItem from './components/CommentItem'
import Link from 'next/link'

import avatar12 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/12.jpg'
import postImg3 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/post/1by1/03.jpg'
import postImg1 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/post/3by2/01.jpg'
import postImg2 from '@/app/(components)/(content-layout)/home/onesocial/assets/images/post/3by2/02.jpg'
import VideoPlayer from './components/VideoPlayer'

const ActionMenu = ({ name }: { name?: string }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="text-gray-600 hover:bg-gray-100 py-1 px-2 rounded transition-colors"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <BsThreeDots />
      </button>
      
      {dropdownOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10 border">
          <div className="py-1">
            <Link 
              href="#" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <BsBookmark size={22} className="mr-2" />
              Save post
            </Link>
            <Link 
              href="#" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <BsPersonX size={22} className="mr-2" />
              Unfollow {name}
            </Link>
            <Link 
              href="#" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <BsXCircle size={22} className="mr-2" />
              Hide post
            </Link>
            <Link 
              href="#" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <BsSlashCircle size={22} className="mr-2" />
              Block
            </Link>
            <div className="border-t my-1"></div>
            <Link 
              href="#" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <BsFlag size={22} className="mr-2" />
              Report post
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

const PostCard = ({ createdAt, likesCount, caption, comments, commentsCount, image, socialUser, photos, isVideo }: SocialPostType) => {
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-12 h-12 mr-3">
              {socialUser?.avatar && (
                <span role="button" className="cursor-pointer">
                  <Image 
                    className="rounded-full object-cover w-full h-full" 
                    src={socialUser.avatar} 
                    alt={socialUser.name}
                    width={48}
                    height={48}
                  />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h6 className="font-semibold text-base cursor-pointer hover:text-blue-600 transition-colors">
                  {socialUser?.name}
                </h6>
                <span className="text-sm text-gray-500">{timeSince(createdAt)}</span>
              </div>
              <p className="text-sm text-gray-600">Web Developer at StackBros</p>
            </div>
          </div>
          <ActionMenu name={socialUser?.name} />
        </div>
      </div>

      <div className="p-4">
        {caption && <p className="text-gray-800 mb-4">{caption}</p>}

        {image && (
          <div className="relative w-full h-96 mb-4">
            <Image 
              className="rounded-lg object-cover" 
              src={image} 
              alt="Post"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {photos && (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="h-48">
                <GlightBox className="h-full" href={postImg3.src} data-gallery="image-popup">
                  <div className="relative h-full w-full">
                    <Image 
                      className="rounded-lg object-cover" 
                      src={postImg3} 
                      alt="Image"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </GlightBox>
              </div>
              <div>
                <GlightBox href={postImg1.src} data-glightbox data-gallery="image-popup">
                  <div className="relative h-24 w-full mb-3">
                    <Image 
                      className="rounded-lg object-cover" 
                      src={postImg1} 
                      alt="Image"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </GlightBox>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Link className="text-white font-medium hover:text-gray-200 transition-colors" href="#">
                      View all
                    </Link>
                  </div>
                  <GlightBox href={postImg2.src} data-glightbox data-gallery="image-popup">
                    <div className="relative h-24 w-full opacity-50">
                      <Image 
                        className="object-cover" 
                        src={postImg2} 
                        alt="image"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  </GlightBox>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isVideo && <VideoPlayer />}
        
        <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 text-sm">
          <Link
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            href="#"
          >
            <BsHandThumbsUpFill size={18} className="mr-1" />
            Liked ({likesCount})
          </Link>
          <Link 
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors" 
            href="#"
          >
            <BsChatFill size={18} className="mr-1" />
            Comments ({commentsCount})
          </Link>

          <div className="relative">
            <button
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
            >
              <BsReplyFill size={16} className="mr-1 transform -scale-x-100" />
              Share (3)
            </button>
            
            {shareDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <Link 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <BsEnvelope size={22} className="mr-2" />
                    Send via Direct Message
                  </Link>
                  <Link 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <BsBookmarkCheck size={22} className="mr-2" />
                    Bookmark
                  </Link>
                  <Link 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <BsLink size={22} className="mr-2" />
                    Copy link to post
                  </Link>
                  <Link 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <BsShare size={22} className="mr-2" />
                    Share post via …
                  </Link>
                  <div className="border-t my-1"></div>
                  <Link 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <BsPencilSquare size={22} className="mr-2" />
                    Share to News Feed
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {comments && (
          <>
            <div className="flex mb-3 mt-4">
              <div className="relative w-8 h-8 mr-2">
                <span role="button" className="cursor-pointer">
                  <Image 
                    className="rounded-full object-cover w-full h-full" 
                    src={avatar12} 
                    alt="avatar12"
                    width={32}
                    height={32}
                  />
                </span>
              </div>

              <div className="relative w-full">
                <textarea 
                  className="w-full p-2 pr-10 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" 
                  rows={1} 
                  placeholder="Add a comment..." 
                  defaultValue={''}
                />
                <button 
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-transparent border-0 text-gray-500 hover:text-blue-600 transition-colors" 
                  type="button"
                >
                  <BsSendFill />
                </button>
              </div>
            </div>

            <ul className="space-y-4">
              {comments.map((comment) => (
                <CommentItem {...comment} key={comment.id} />
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        {comments && <LoadContentButton name="Load more comments" />}
      </div>
    </div>
  )
}

export default PostCard