"use client";

import { useSession } from "@/app/SessionProvider";
import CreatePost from "../../components/createPost/page";
import CreatePostPopup from "../../components/createPostPopup/page";
import Header from "../../components/header/page";
import { useState, useEffect } from "react";
import LeftHome from "../../components/home/left/page";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories/page";
import Post from "../../components/post/page";
import "./style.css";
import axios from "axios";

export default function Home() {
  const { user } = useSession();

  // Popup görünürlüğü
  const [visible, setVisible] = useState(false);

  const [showMyPostsOnly, setShowMyPostsOnly] = useState(false); // Feeling/Activity durumu

  // Postları tutacak state
  const [posts, setPosts] = useState([]);

  // Sayfa yüklendiğinde postları çek
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/social/posts");
        setPosts(res.data);
        console.log("res", res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load posts");
      }
    };

    fetchPosts();
  }, []);

  const handleAddNewPost = async (newPost) => {
    // Yeni postu önce local state'e ekliyoruz
    setPosts((prev) => [newPost, ...prev]);

    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/social/posts");
        setPosts(res.data);
        console.log("res", res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load posts");
      }
    };

    // Sonrasında sunucudan tekrar postları çekiyoruz
    await fetchPosts(); // Yeni post ekledikten sonra veriyi güncelle
  };

  const displayedPosts = showMyPostsOnly
    ? posts.filter((p) => p.userId === user?.id)
    : posts;

  return (
    <div className="home">
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          onPostCreated={handleAddNewPost}
        />
      )}
      {/* <Header />  */}
      <div className="middle-container">
        <div className="home_middle">
          <div>{/* <LeftHome user={user} /> */}</div>
          <div>
            <Stories />
            <CreatePost
              user={user}
              setVisible={setVisible}
              posts={posts}
              showMyPostsOnly={showMyPostsOnly}
              setShowMyPostsOnly={setShowMyPostsOnly}
            />
            <div className="posts">
              {displayedPosts.length > 0 ? (
                displayedPosts.map((post, index) =>
                  post.message ? (
                    // 🔔 Arkadaş Aktivitesi Kartı
                    <div
                      key={post.id || index}
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          const el = document.getElementById(
                            `post-${post.postId}`
                          );
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                            // 🎨 Geçici highlight efekti
                            el.classList.add(
                              "ring",
                              "ring-blue-400",
                              "ring-offset-2"
                            );
                            setTimeout(() => {
                              el.classList.remove(
                                "ring",
                                "ring-blue-400",
                                "ring-offset-2"
                              );
                            }, 1500);
                          }
                        }
                      }}
                      className="flex items-start gap-3 bg-blue-50 dark:bg-gray-800 p-4 rounded-2xl border border-blue-100 dark:border-gray-700 transition hover:shadow-md mb-3 cursor-pointer hover:bg-blue-100/60"
                    >
                      <img
                        src={post.actor?.avatarUrl || "/default-avatar.png"}
                        alt={post.actor?.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          <span className="font-semibold">
                            {post.actor?.username}
                          </span>{" "}
                          {post.type === "like"
                            ? "gönderiyi beğendi"
                            : "gönderiye yorum yaptı"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(post.createdAt).toLocaleString("tr-TR")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // 📝 Normal Post Kartı
                    <div
                      id={`post-${post.id}`}
                      key={post.id || index}
                      className="transition-all duration-500"
                    >
                      <Post post={post} user={user} />
                    </div>
                  )
                )
              ) : (
                <p className="text-center text-gray-500">No posts.</p>
              )}
            </div>
          </div>
          <div>
            <RightHome user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
