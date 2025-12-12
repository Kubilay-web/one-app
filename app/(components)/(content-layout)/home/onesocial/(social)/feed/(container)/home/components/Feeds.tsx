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
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const postData = [
    { progress: 25, title: "We have cybersecurity insurance coverage" },
    { progress: 15, title: "Our dedicated staff will protect us" },
    { progress: 10, title: "We give regular training for best practices" },
    { progress: 55, title: "Third-party vendor protection" },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/social/posts"); // await ekledik
        console.log("cevap", res.data);
        setAllPosts(res.data); // data kısmını alıyoruz
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
          >
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
    );
  }

  return (
    <div className="space-y-4">
      {allPosts.map((post, idx) => (
        
        <PostCard
          key={post.id} // 'id' string olduğu için burada sıkıntı yok
          id={post.id} // id'yi doğru şekilde geçiriyoruz
          createdAt={post.createdAt}
          caption={post.text || post.content || ""}
          photos={post.images} // tüm resimler için
          socialUser={{
            name: post.user.username,
            avatar: post.user.avatarUrl,
          }}
          likesCount={post.React?.length || 0}
          comments={post.comments || []}
          commentsCount={post.comments?.length || 0}
          isVideo={false} // isVideo yoksa false
        />
      ))}

      {/* <SponsoredCard />
      <Post2 /> */}
      {/* <People /> */}

      {/* <CommonPost>
        <div className="space-y-3">
          {["option", "option2", "option3", "option4"].map((id, idx) => (
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
      </CommonPost> */}
      {/* 
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
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  {item.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </CommonPost>

      <Post3 /> */}

      {/* <SuggestedStories /> */}

      <LoadMoreButton />
    </div>
  );
};

export default Feeds;
