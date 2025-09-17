"use client";

import { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // exit icon
import { FiPlus } from "react-icons/fi"; // plus icon
import { BiImage } from "react-icons/bi"; // frame icon
import "./style.css";
import UpdateProfilePicture from "./UpdateProfilePicture";
import { useSession } from "@/app/SessionProvider";

export default function ProfilePicture({ username, setShow, pRef, photos }) {
  const popup = useRef(null);
  const { user } = useSession();
  const refInput = useRef(null);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} is too large max 5mb allowed.`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setImage(event.target.result);
    };
  };

  return (
    <div className="blur-social">
      <input
        type="file"
        ref={refInput}
        hidden
        onChange={handleImage}
        accept="image/jpeg,image/png,image/webp,image/gif"
      />
      <div className="postBox pictureBox" ref={popup}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setShow(false)}>
            <AiOutlineClose size={20} />
          </div>
          <span>Update profile picture</span>
        </div>

        <div className="update_picture_wrap">
          <div className="update_picture_buttons">
            <button
              className="light_blue_btn"
              onClick={() => refInput.current.click()}
            >
              <FiPlus size={18} />
              Upload photo
            </button>
            <button className="gray_btn">
              <BiImage size={18} />
              Add frame
            </button>
          </div>
        </div>

        {error && (
          <div className="postError comment_error">
            <div className="postError_error">{error}</div>
            <button className="blue_btn" onClick={() => setError("")}>
              Try again
            </button>
          </div>
        )}
      </div>

      {image && (
        <UpdateProfilePicture
          setImage={setImage}
          image={image}
          setShow={setShow}
          setError={setError}
          pRef={pRef}
        />
      )}
    </div>
  );
}
