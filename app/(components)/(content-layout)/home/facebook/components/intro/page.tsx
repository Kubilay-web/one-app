"use client";

import { useEffect, useState } from "react";
import Bio from "./Bio";
import EditDetails from "./EditDetails";
import { useSession } from "@/app/SessionProvider";
import axios from "axios";
import "./style.css";

export default function Intro({ visitor, setOthername, username }) {
  const { user } = useSession();
  const [details, setDetails] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [infos, setInfos] = useState<any>({});
  const [max, setMax] = useState(100);

  // Kullanıcı detaylarını getir
  useEffect(() => {
    const fetchDetails = async () => {
      if (!username) return;

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/social/details/${username}`);
        const userDetails = res.data?.UserDetails?.[0]; // API'den gelen array
        if (!userDetails) return;

        setDetails(userDetails);
        setInfos({
          bio: userDetails?.biosocial || "",
          otherName: userDetails?.otherName || "",
          job: userDetails?.job || "",
          workplace: userDetails?.workplace || "",
          highSchool: userDetails?.highSchool || "",
          college: userDetails?.college || "",
          currentCity: userDetails?.currentCity || "",
          hometown: userDetails?.hometown || "",
          relationship: userDetails?.relationship || "",
          instagram: userDetails?.instagram || "",
        });
        setMax(userDetails?.biosocial ? 100 - userDetails.biosocial.length : 100);
      } catch (err) {
        console.error(err?.response?.data?.message || err.message);
      }
    };

    fetchDetails();
  }, [username]); // username değişirse tekrar fetch et

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInfos({ ...infos, [name]: value });
    if (name === "bio") setMax(100 - value.length);
  };

  const updateDetails = async () => {
    try {
      const { data } = await axios.put(
        `/api/social/updatedetails`,
        { infos },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setDetails(data);
      setShowBio(false);
      setOthername(data.otherName);
    } catch (err: any) {
      console.error(err?.response?.data?.message || err.message);
    }
  };

  if (!details) return <div>No details</div>;

  return (
    <div className="profile_card">
      <div className="profile_card_header">Intro</div>

      {/* Bio */}
      {details?.biosocial && !showBio && (
        <div className="info_col">
          <span className="info_text">{details.biosocial}</span>
          {!visitor && <button className="gray_btn hover1" onClick={() => setShowBio(true)}>Edit Bio</button>}
        </div>
      )}
      {!details?.biosocial && !showBio && !visitor && (
        <button className="gray_btn hover1 w100" onClick={() => setShowBio(true)}>Add Bio</button>
      )}
      {showBio && (
        <Bio infos={infos} max={max} handleChange={handleChange} setShowBio={setShowBio} updateDetails={updateDetails} placeholder="Add Bio" name="bio" />
      )}

      {/* Job / Workplace */}
      {details?.job && details?.workplace ? (
        <div className="info_profile">
          <img src="/facebook/icons/job.png" alt="" />
          works as {details.job} at <b>{details.workplace}</b>
        </div>
      ) : details?.job ? (
        <div className="info_profile">
          <img src="/facebook/icons/job.png" alt="" />
          works as {details.job}
        </div>
      ) : details?.workplace ? (
        <div className="info_profile">
          <img src="/facebook/icons/job.png" alt="" />
          works at {details.workplace}
        </div>
      ) : null}

      {/* Relationship */}
      {details?.relationship && (
        <div className="info_profile">
          <img src="/facebook/icons/relationship.png" alt="" />
          {details.relationship}
        </div>
      )}

      {/* Education */}
      {details?.college && (
        <div className="info_profile">
          <img src="/facebook/icons/studies.png" alt="" />
          studied at {details.college}
        </div>
      )}
      {details?.highSchool && (
        <div className="info_profile">
          <img src="/facebook/icons/studies.png" alt="" />
          studied at {details.highSchool}
        </div>
      )}

      {/* Location */}
      {details?.currentCity && (
        <div className="info_profile">
          <img src="/facebook/icons/home.png" alt="" />
          Lives in {details.currentCity}
        </div>
      )}
      {details?.hometown && (
        <div className="info_profile">
          <img src="/facebook/icons/home.png" alt="" />
          From {details.hometown}
        </div>
      )}

      {/* Instagram */}
      {details?.instagram && (
        <div className="info_profile">
          <img src="/facebook/icons/instagram.png" alt="" />
          <a href={`https://www.instagram.com/${details.instagram}`} target="_blank" rel="noopener noreferrer">
            {details.instagram}
          </a>
        </div>
      )}

      {!visitor && (
        <button className="gray_btn hover1 w100" onClick={() => setVisible(true)}>Edit Details</button>
      )}
      {visible && !visitor && (
        <EditDetails details={details} handleChange={handleChange} updateDetails={updateDetails} infos={infos} setVisible={setVisible} />
      )}
    </div>
  );
}
