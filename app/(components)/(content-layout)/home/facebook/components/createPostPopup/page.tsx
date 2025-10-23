"use client";

import { useState } from "react";
import "./style.css";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import AddToYourPost from "./AddToYourPost";
import ImagePreview from "./ImagePreview";
import { IoMdClose } from "react-icons/io";
import { BsChevronDown } from "react-icons/bs";
import { createPost } from "../../functions/post";
import PulseLoader from "react-spinners/PulseLoader";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios"

// Cloudinary upload helper
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return data.secure_url;
};

export default function CreatePostPopup({ user, setVisible, onPostCreated }) {
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");

  const handleImages = async (files) => {
    setLoading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }
      setImages(uploadedUrls);
      toast.success("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const postSubmit = async () => {
    setLoading(true);
    try {
      const newPost= await createPost(
        null,
        background,
        text,
        images,
        user.id,
        user.token
      );

    await axios.post("/api/notificationsocial", {
      fromUserId: user.id,
      toUserId: user.id, // istersen farklı kullanıcıya
      type: "newPost",
      message: `${user.username} yeni bir gönderi paylaştı.`,
      postId: newPost.id,
    });


      // Yeni postu anında ekliyoruz
      onPostCreated(newPost);

      setBackground("");
      setText("");
      setImages([]);
      setVisible(false);
      toast.success("Posted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blur-social bg-black bg-opacity-40">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="postBox bg-white dark:bg-neutral-800 text-black dark:text-white rounded-md shadow-md">
        {/* Header */}
        <div className="box_header bg-white dark:bg-neutral-800 text-black dark:text-white">
          <div
            className="small_circle hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setVisible(false)}
          >
            <IoMdClose size={20} className="text-black dark:text-white" />
          </div>
          <span className="text-base font-semibold">Create Post</span>
        </div>

        {/* Profile */}
        <div className="box_profile text-black dark:text-white">
          <img src={user.avatarUrl} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name font-medium">{user.username}</div>
            <div className="box_privacy flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
              <img src="/facebook/icons/public.png" alt="" />
              <span>Public</span>
              <BsChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Post Content */}
        {!showPrev ? (
          <EmojiPickerBackgrounds
            text={text}
            user={user}
            setText={setText}
            setBackground={setBackground}
            background={background}
            handleImages={handleImages}
          />
        ) : (
          <ImagePreview
            text={text}
            user={user}
            setText={setText}
            showPrev={showPrev}
            images={images}
            setImages={setImages}
            setShowPrev={setShowPrev}
          />
        )}

        <AddToYourPost setShowPrev={setShowPrev} />

        {/* Submit Button */}
        <button
          className="post_submit bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
          onClick={postSubmit}
          disabled={loading}
        >
          {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
        </button>
      </div>
    </div>
  );
}
