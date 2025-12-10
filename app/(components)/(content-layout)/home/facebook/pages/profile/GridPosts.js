"use client";

import { useState } from "react";
import { FaList, FaTh, FaSlidersH, FaChevronDown } from "react-icons/fa";

export default function GridPosts({ onShowSaved }) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleOptionClick = (isSaved) => {
    setOpenDropdown(false);
    onShowSaved(isSaved);
  };

  return (
    <div className="createPost">
      <div
        className="createPost_header"
        style={{ justifyContent: "space-between" }}
      >
        <div className="left_header_grid">Posts</div>
        <div className="flex relative">
          <div className="gray_btn">
            <FaSlidersH className="equalize_icon" />
          </div>

          <div className="gray_btn relative">
            <button
              className="flex items-center gap-2"
              onClick={() => setOpenDropdown((prev) => !prev)}
            >
              Manage Posts
              <FaChevronDown
                className={`transition-transform duration-200 ${
                  openDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border z-10">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleOptionClick(false)} // 🔹 Normal postlar
                >
                  My Posts
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleOptionClick(true)} // 🔹 Saved postlar
                >
                  Saved Posts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="create_splitter"></div>
      <div className="createPost_body grid2">
        <div className="view_type active">
          <FaList className="list_icon filter_blue" />
          List view
        </div>
        <div className="view_type">
          <FaTh className="grid_icon" />
          Grid view
        </div>
      </div>
    </div>
  );
}
