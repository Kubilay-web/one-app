"use client";

import { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai"; // exit icon
import { FaUserTie, FaGraduationCap, FaHome, FaHeart, FaInstagram } from "react-icons/fa";
import Detail from "./Detail";
import useOnCLickOutside from "../../helpers/clickOutside";

export default function EditDetails({
  details,
  handleChange,
  updateDetails,
  infos,
  setVisible,
}) {
  const modal = useRef(null);
  useOnCLickOutside(modal, () => setVisible(false));

  // İkonları key-value olarak tanımlayabiliriz
  const icons = {
    job: <FaUserTie />,
    studies: <FaGraduationCap />,
    home: <FaHome />,
    relationship: <FaHeart />,
    instagram: <FaInstagram />,
  };

  return (
    <div className="blur-social">
      <div className="postBox infosBox" ref={modal}>
        <div className="box_header">
          <div className="small_circle" onClick={() => setVisible(false)}>
            <AiOutlineClose size={20} />
          </div>
          <span>Edit Details</span>
        </div>
        <div className="details_wrapper scrollbar">
          <div className="details_col">
            <span>Customize Your Intro</span>
            <span>Details you select will be public</span>
          </div>

          <div className="details_header">Other Name</div>
          <Detail
            value={details?.otherName}
            icon={icons.studies}
            placeholder="Add other name"
            name="otherName"
            text="other Name"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />

          <div className="details_header">Work</div>
          <Detail
            value={details?.job}
            icon={icons.job}
            placeholder="Add job title"
            name="job"
            text="a job"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <Detail
            value={details?.workplace}
            icon={icons.job}
            placeholder="Add a workplace"
            name="workplace"
            text="workplace"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />

          <div className="details_header">Education</div>
          <Detail
            value={details?.highSchool}
            icon={icons.studies}
            placeholder="Add a high school"
            name="highSchool"
            text="a high school"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
          <Detail
            value={details?.college}
            icon={icons.studies}
            placeholder="Add a college"
            name="college"
            text="college"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />

          <div className="details_header">Current City</div>
          <Detail
            value={details?.currentCity}
            icon={icons.home}
            placeholder="Add a current city"
            name="currentCity"
            text="a current city"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />

          <div className="details_header">Hometown</div>
          <Detail
            value={details?.hometown}
            icon={icons.home}
            placeholder="Add hometown"
            name="hometown"
            text="hometown"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />

          <div className="details_header">Relationship</div>
          <Detail
            value={details?.relationship}
            icon={icons.relationship}
            placeholder="Add relationship"
            name="relationship"
            text="relationship"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
            rel
          />

          <div className="details_header">Instagram</div>
          <Detail
            value={details?.instagram}
            icon={icons.instagram}
            placeholder="Add instagram"
            name="instagram"
            text="instagram"
            handleChange={handleChange}
            updateDetails={updateDetails}
            infos={infos}
          />
        </div>
      </div>
    </div>
  );
}
