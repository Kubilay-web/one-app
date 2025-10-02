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
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function Home() {
  const { user } = useSession();

  // Popup görünürlüğü
  const [visible, setVisible] = useState(false);

  // Postları tutacak state
  const [posts, setPosts] = useState([]);

  const handleAddNewPost = (createPost) => {
    setPosts((prev) => [createPost, ...prev]); // Yeni postu en başa ekle
  };

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

  return (
    <div className="home">
      <Toaster position="top-right" reverseOrder={false} />
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          onPostCreated={handleAddNewPost}
        />
      )}
       <Header /> 
      <div className="middle-container">
        <div className="home_middle">
          <div>
            {/* <LeftHome user={user} /> */}
          </div>
          <div>
            <Stories />
            <CreatePost user={user} setVisible={setVisible} />
            <div className="posts">
              {posts.map((post, index) => (
                <Post key={post.id || index} post={post} user={user} />
              ))}
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
