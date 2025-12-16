"use client";

import { useEffect, useState } from "react";
import { getAllFeeds } from "../../../../../helpers/data";
import Image from "next/image";
import type { ReactNode } from "react";
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
} from "react-icons/bs";
import People from "./People";

import avatar4 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/04.jpg";
import logo11 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/logo/11.svg";
import logo12 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/logo/12.svg";
import logo13 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/logo/13.svg";
import postImg2 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/post/3by2/02.jpg";
import postImg4 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/post/3by2/03.jpg";
import PostCard from "../../../../../components/cards/PostCard";
import Link from "next/link";
import LoadMoreButton from "./LoadMoreButton";
import SuggestedStories from "./SuggestedStories";
import axios from "axios";
import usePostStore from "@/app/social-store/post";

const ActionMenu = ({ name }: { name?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

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
  );
};



const Feeds = () => {
  const { posts, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, []);


  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          createdAt={post.createdAt}
          caption={post.text}
          photos={post.images}
          socialUser={{
            name: post.user.username,
            avatar: post.user.avatarUrl,
          }}
          likesCount={post.likesCount}
          comments={post.comments}
          commentsCount={post.commentsCount}
          isVideo={false}
        />
      ))}

      <LoadMoreButton />
    </div>
  );
};


export default Feeds;
