"use client";
import { useEffect, useState } from "react";
import { Feeling, LiveVideo, Photo } from "../../svg";
import Post from "../post/page";
import "./style.css";

export default function CreatePost({
  user,
  setVisible,
  posts,
  showMyPostsOnly,
  setShowMyPostsOnly,
}) {

  const [explorePosts, setExplorePosts] = useState([]);
  const [showExplorePosts, setShowExplorePosts] = useState(false);

  const handleExploreClick = async () => {
    if (showExplorePosts) {
      // Eğer açıkken tekrar tıklanırsa kapat
      setShowExplorePosts(false);
      setExplorePosts([]);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/social/posts/explore`);
      const data = await res.json();
      setExplorePosts(data);
      setShowExplorePosts(true);
    } catch (error) {
      console.error("Explore fetch error:", error);
    }
  };

  return (
    <div className="createPost bg-white dark:bg-neutral-800 rounded-md shadow-sm">
      {/* Header */}
      <div className="createPost_header bg-white dark:bg-neutral-800">
        <img src={user?.avatarUrl} alt="profile" />
        <div
          className="open_post hover2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          onClick={() => setVisible(true)}
        >
          What's on your mind, {user?.username}?
        </div>
      </div>

      {/* Splitter */}
      <div className="create_splitter bg-neutral-200 dark:bg-neutral-600 h-px my-2" />

      {/* Icons */}
      <div className="createPost_body bg-white dark:bg-neutral-800">
        <div className="createPost_icon hover1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors">
          <LiveVideo color="#f3425f" />
          Live Video
        </div>
        <div className="createPost_icon hover1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors">
          <Photo color="#4bbf67" />
          Photo/Video
        </div>
        <div
          className={`createPost_icon hover1 rounded-md transition-colors cursor-pointer ${
            showExplorePosts
              ? "bg-neutral-200 dark:bg-neutral-600"
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
          }`}
          onClick={handleExploreClick}
        >
          <Feeling color="#f7b928" />
          Discover One
        </div>
      </div>


      {/* Explore postları */}
      {showExplorePosts && (
        <div className="explorePosts p-3 bg-neutral-100 dark:bg-neutral-700 rounded-md mt-2">
          {explorePosts.length > 0 ? (
            explorePosts.map((post) => (
              <Post key={post.id} post={post} user={user} />
            ))
          ) : (
            <p className="text-sm text-neutral-500">No post found.</p>
          )}
        </div>
      )}
    </div>
  );
}
