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

export default function CreatePostPopup({ user, setVisible }) {
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");

  // Image upload
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
      await createPost(
        null,          // type
        background,    // background
        text,          // text
        images,        // Cloudinary linkleri
        user.id,       // userId
        user.token     // token
      );
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
    <div className="blur-social">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="postBox">
        {/* Header */}
        <div className="box_header">
          <div className="small_circle" onClick={() => setVisible(false)}>
            <IoMdClose size={20} className="text-black" />
          </div>
          <span>Create Post</span>
        </div>

        {/* Profile */}
        <div className="box_profile">
          <img src={user.avatarUrl} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">{user.username}</div>
            <div className="box_privacy">
              <img src="/facebook/icons/public.png" alt="" />
              <span>Public</span>
              <BsChevronDown size={16} className="text-gray-600" />
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
            handleImages={handleImages} // Cloudinary linklerini eklemek için
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
        <button className="post_submit" onClick={postSubmit} disabled={loading}>
          {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
        </button>
      </div>
    </div>
  );
}
