"use client";

import { FaList, FaTh } from "react-icons/fa"; // List and Grid Icons
import { FaCog } from "react-icons/fa"; // Manage Icon
import { FaSlidersH } from "react-icons/fa"; // Equalizer Icon

export default function GridPosts() {
  return (
    <div className="createPost">
      <div
        className="createPost_header"
        style={{ justifyContent: "space-between" }}
      >
        <div className="left_header_grid">Posts</div>
        <div className="flex">
          <div className="gray_btn">
            <FaSlidersH className="equalize_icon" />
          </div>
          <div className="gray_btn">
            {/* <FaCog className="manage_icon" /> */}
            Manage Posts
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
