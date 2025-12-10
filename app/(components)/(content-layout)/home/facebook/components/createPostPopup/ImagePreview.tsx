"use client";

import { useRef } from "react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import { IoMdClose } from "react-icons/io"; // exit_icon
import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai"; // addPhoto_icon, edit_icon
import { FaMobileAlt } from "react-icons/fa"; // phone_icon


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
  if (!data.secure_url) throw new Error("Cloudinary upload failed");
  return data.secure_url;
};

export default function ImagePreview({
  text,
  user,
  setText,
  images,
  setImages,
  setShowPrev,
  setError,
}) {
  const imageInputRef = useRef(null);

  const handleImages = async (e) => {
    let files = Array.from(e.target.files);

    for (const img of files) {
      if (
        img.type !== "image/jpeg" &&
        img.type !== "image/png" &&
        img.type !== "image/webp" &&
        img.type !== "image/gif"
      ) {
        setError(
          `${img.name} format is unsupported! Only JPEG, PNG, WebP, GIF are allowed.`
        );
        continue;
      } else if (img.size > 5 * 1024 * 1024) {
        setError(`${img.name} size is too large. Max 5MB allowed.`);
        continue;
      }

      try {
        const url = await uploadToCloudinary(img); // ✅ Cloudinary link
        setImages((prev) => [...prev, url]);
      } catch (err) {
        console.error(err);
        toast.error("Image upload failed!");
      }
    }
  };

  const getPreviewClass = () => {
    if (images.length === 1) return "preview1";
    if (images.length === 2) return "preview2";
    if (images.length === 3) return "preview3";
    if (images.length === 4) return "preview4";
    if (images.length === 5) return "preview5";
    return images.length % 2 === 0 ? "preview6" : "preview6 singular_grid";
  };

  return (
    <div className="overflow_a scrollbar">
      <EmojiPickerBackgrounds text={text} user={user} setText={setText} type2 />

      <div className="add_pics_wrap">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          ref={imageInputRef}
          onChange={handleImages}
        />

        {images && images.length ? (
          <div className="add_pics_inside1 p0">
            <div className="preview_actions">
              <button className="hover1">
                <AiOutlineEdit size={16} />
                Edit
              </button>
              <button
                className="hover1"
                onClick={() => imageInputRef.current.click()}
              >
                <AiOutlinePlus size={16} />
                Add Photos/Videos
              </button>
            </div>
            <div
              className="small_white_circle"
              onClick={() => setImages([])}
            >
              <IoMdClose size={20} />
            </div>
            <div className={getPreviewClass()}>
              {images.map((img, i) => (
                <img src={img} key={i} alt={`preview-${i}`} />
              ))}
            </div>
          </div>
        ) : (
          <div className="add_pics_inside1">
            <div
              className="small_white_circle"
              onClick={() => setShowPrev(false)}
            >
              <IoMdClose size={20} />
            </div>
            <div className="add_col" onClick={() => imageInputRef.current.click()}>
              <div className="add_circle">
                <AiOutlinePlus size={24} />
              </div>
              <span>Add Photos/Videos</span>
              <span>or drag and drop</span>
            </div>
          </div>
        )}

        <div className="add_pics_inside2">
          <div className="add_circle">
            <FaMobileAlt size={24} />
          </div>
          <div className="mobile_text">Add photos from your mobile device.</div>
          <span className="addphone_btn">Add</span>
        </div>
      </div>
    </div>
  );
}
