"use client";

import { useSession } from "@/app/SessionProvider";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import clsx from "clsx";
import {
  BsHeart,
  BsHeartFill,
  BsChat,
  BsBookmark,
  BsBookmarkFill,
  BsSend,
} from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";

interface Post {
  id: string;
  text?: string;
  images: string[];
  createdAt: string | Date;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  comments: any[];
  React: any[];
  SavedPost: any[];
}

export default function PostList() {
  const { user } = useSession();
  const params = useParams<{ username?: string }>();
  const username = params?.username;

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const fetchPosts = useCallback(async () => {
    if (loading) return;

    const fetchUsername = username || user?.username;
    if (!fetchUsername) return;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/onesocial/profile/${fetchUsername}/posts?page=${page}&limit=6&type=${activeTab}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (data.success) {
        setPosts((prev) =>
          page === 1 ? data.data.posts : [...prev, ...data.data.posts]
        );
        setHasMore(data.data.hasMore);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [username, user?.username, page, activeTab, loading]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleReact = async (postId: string) => {
    await fetch("/api/onesocial/posts/react", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              React: post.React.some((r) => r.reactBy.id === user?.id)
                ? post.React.filter((r) => r.reactBy.id !== user?.id)
                : [
                    ...post.React,
                    { reactBy: { id: user?.id } },
                  ],
            }
          : post
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setActiveTab("posts");
            setPage(1);
          }}
          className={clsx(
            "px-5 py-2 rounded-lg",
            activeTab === "posts"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-800"
          )}
        >
          <HiOutlinePhotograph /> Posts
        </button>

        <button
          onClick={() => {
            setActiveTab("saved");
            setPage(1);
          }}
          className={clsx(
            "px-5 py-2 rounded-lg",
            activeTab === "saved"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-800"
          )}
        >
          <BsBookmark /> Saved
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl">
            <div className="flex gap-3 mb-3">
              <Image
                src={post.user.avatarUrl || "/default-avatar.png"}
                width={40}
                height={40}
                alt=""
                className="rounded-full"
              />
              <Link href={`/${post.user.username}`} className="font-semibold">
                {post.user.displayName}
              </Link>
            </div>

            <p>{post.text}</p>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {post.images.map((img, i) => (
                <Image key={i} src={img} alt="" width={300} height={300} />
              ))}
            </div>

            <div className="flex gap-4 mt-4">
              <button onClick={() => handleReact(post.id)}>
                {post.React.some((r) => r.reactBy.id === user?.id) ? (
                  <BsHeartFill className="text-red-500" />
                ) : (
                  <BsHeart />
                )}
                {post.React.length}
              </button>

              <button onClick={() => setCommentingPostId(post.id)}>
                <BsChat /> {post.comments.length}
              </button>

              <button>
                {post.SavedPost.length ? <BsBookmarkFill /> : <BsBookmark />}
              </button>
            </div>

            {commentingPostId === post.id && (
              <div className="flex gap-2 mt-3">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded"
                />
                <button>
                  <BsSend />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
