import { Photo, Feeling, Dots } from "../../svg";
import { FaUserTag, FaMapMarkerAlt, FaMicrophone } from "react-icons/fa"; // react-icons

export default function AddToYourPost({ setShowPrev }) {
  return (
    <div className="addtoyourpost">
      <div className="addto_text">Add to your post</div>

      <div
        className="post_header_right hover1"
        onClick={() => setShowPrev(true)}
      >
        <Photo color="#45bd62" />
      </div>

      <div className="post_header_right hover1">
        <FaUserTag size={20} className="text-blue-500" />
      </div>

      <div className="post_header_right hover1">
        <Feeling color="#f7b928" />
      </div>

      <div className="post_header_right hover1">
        <FaMapMarkerAlt size={20} className="text-red-500" />
      </div>

      <div className="post_header_right hover1">
        <FaMicrophone size={20} className="text-gray-700" />
      </div>

      <div className="post_header_right hover1">
        <Dots color="#65676b" />
      </div>
    </div>
  );
}
