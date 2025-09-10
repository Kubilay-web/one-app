"use client";

import { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa"; // Camera icon
import { FaPlus } from "react-icons/fa"; // Plus icon
import { FaPen } from "react-icons/fa"; // Edit icon
import ProfilePicture from "../../components/profielPicture/page";

export default function ProfielPictureInfos({
  profile,
  visitor,
  photos,
  othername,
}) {
  const [show, setShow] = useState(false);
  const pRef = useRef(null);

  return (
    <div className="profile_img_wrap">
      {show && <ProfilePicture setShow={setShow} pRef={pRef} photos={photos} />}
      
      <div className="profile_w_left">
        <div className="profile_w_img">
          <div
            className="profile_w_bg"
            ref={pRef}
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${profile.avatarUrl})`,
            }}
          ></div>
          
          {/* Show camera icon if the user is not a visitor */}
          {!visitor && (
            <div
              className="profile_circle hover1"
              onClick={() => setShow(true)}
            >
              <FaCamera className="camera_filled_icon" />
            </div>
          )}
        </div>
        
        <div className="profile_w_col">
          <div className="profile_name">
            {profile.username}
            <div className="othername">{othername && `(${othername})`}</div>
          </div>
          <div className="profile_friend_count"></div>
          <div className="profile_friend_imgs"></div>
        </div>
      </div>
      
      {/* Show buttons if the user is not a visitor */}
      {visitor ? (
        ""
      ) : (
        <div className="profile_w_right">
          <div className="blue_btn">
            <FaPlus className="invert" />
            <span>Add to story</span>
          </div>
          <div className="gray_btn">
            {/* <FaPen className="edit_icon" /> */}
            <span>Edit profile</span>
          </div>
        </div>
      )}
    </div>
  );
}
