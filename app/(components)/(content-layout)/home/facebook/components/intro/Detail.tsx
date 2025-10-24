"use client";

import { useState } from "react";
import Bio from "./Bio";
import { FaUserTie, FaGraduationCap, FaHome, FaHeart, FaInstagram, FaPlus, FaPen } from "react-icons/fa";

export default function Detail({
  img,
  value,
  placeholder,
  name,
  handleChange,
  updateDetails,
  infos,
  text,
  rel,
}) {
  const [show, setShow] = useState(false);

  // img string'lerini React Icons ile eşleştiriyoruz
  const icons = {
    job: <FaUserTie />,
    studies: <FaGraduationCap />,
    home: <FaHome />,
    relationship: <FaHeart />,
    instagram: <FaInstagram />,
  };

  return (
    <div>
      <div className="add_details_flex" onClick={() => setShow(true)}>
        {value ? (
          <div className="info_profile">
            {icons[img] || <FaUserTie />} {/* default icon */}
            {value}
            <FaPen className="edit_icon" />
          </div>
        ) : (
          <>
            <FaPlus className="rounded_plus_icon" />
            <span className="underline">Add {text}</span>
          </>
        )}
      </div>

      {show && (
        <Bio
          placeholder={placeholder}
          name={name}
          handleChange={handleChange}
          updateDetails={updateDetails}
          infos={infos}
          detail
          setShow={setShow}
          rel={rel}
        />
      )}
    </div>
  );
}
