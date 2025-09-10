import { useRef, useState } from "react";
import "./style.css";
import UpdateProfilePicture from "./UpdateProfilePicture";
import { useSession } from "@/app/SessionProvider";
import { IoExitOutline, IoAddCircleOutline, IoImagesOutline  } from "react-icons/io5"; // Add React Icons

export default function ProfilePicture({ username, setShow, pRef, photos }) {
  const popup = useRef(null);
  const { user } = useSession();
  const refInput = useRef(null);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
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
            <IoExitOutline size={24} /> {/* Replace exit icon with React Icon */}
          </div>
          <span>Update profile picture</span>
        </div>
        <div className="update_picture_wrap">
          <div className="update_picture_buttons">
            <button
              className="light_blue_btn"
              onClick={() => refInput.current.click()}
            >
              <IoAddCircleOutline size={20} className="filter_blue" /> {/* Upload icon */}
              Upload photo
            </button>
            <button className="gray_btn">
              <IoImagesOutline  size={20} /> {/* Add frame icon */}
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
        <div className="old_pictures_wrap scrollbar">
          <h4>your profile pictures</h4>
          <div className="old_pictures">
            {(photos || [])
              .filter((img) => img.folder === `${user.username}/profile_pictures`)
              .map((photo) => (
                <img
                  src={photo.secure_url}
                  key={photo.public_id}
                  alt=""
                  onClick={() => setImage(photo.secure_url)}
                />
              ))}
          </div>
          <h4>other pictures</h4>
          <div className="old_pictures">
            {(photos || [])
              .filter((img) => img.folder !== `${user.username}/profile_pictures`)
              .map((photo) => (
                <img
                  src={photo.secure_url}
                  key={photo.public_id}
                  alt=""
                  onClick={() => setImage(photo.secure_url)}
                />
              ))}
          </div>
        </div>
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
