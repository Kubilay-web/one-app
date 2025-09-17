"use client";

import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../helpers/getCroppedImg";
import PulseLoader from "react-spinners/PulseLoader";
import { useSession } from "@/app/SessionProvider";
import "../style.css";

export default function Cover({ cover, visitor }) {
  const [coverPicture, setCoverPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentCover, setCurrentCover] = useState(cover); // ✅ state ile güncellenecek
  const { user } = useSession();
  const refInput = useRef(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = useCallback(async () => {
    try {
      return await getCroppedImg(coverPicture, croppedAreaPixels);
    } catch (err) {
      console.log(err);
    }
  }, [coverPicture, croppedAreaPixels]);

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError(`${file.name} format is not supported.`);
      return;
    }
    if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} is too large max 5mb allowed.`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setCoverPicture(event.target.result);
    };
  };

  const updateCoverPicture = async () => {
    try {
      setLoading(true);
      const img = await getCroppedImage();
      const blob = await fetch(img).then((b) => b.blob());

      const file = new File([blob], "cover.png", { type: blob.type || "image/png" });

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/social/updatecover", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentCover(data.cover); // ✅ state üzerinden güncelle
        setCoverPicture("");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile_cover">
      {coverPicture && (
        <div className="save_changes_cover">
          <div className="save_changes_right">
            <button className="blue_btn opacity_btn" onClick={() => setCoverPicture("")}>
              Cancel
            </button>
            <button className="blue_btn" onClick={updateCoverPicture}>
              {loading ? <PulseLoader color="#fff" size={5} /> : "Save changes"}
            </button>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={refInput}
        hidden
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleImage}
      />
      {error && (
        <div className="postError comment_error cover_error">
          <div className="postError_error">{error}</div>
          <button className="blue_btn" onClick={() => setError("")}>
            Try again
          </button>
        </div>
      )}
      {currentCover && !coverPicture && (
        <img src={currentCover} className="cover" alt="" />
      )}
      {!visitor && (
        <div className="udpate_cover_wrapper">
          <div className="open_cover_update" onClick={() => refInput.current.click()}>
            <i className="camera_filled_icon"></i>
            Add Cover Photo
          </div>
        </div>
      )}
      {coverPicture && (
        <div className="cover_crooper">
          <Cropper
            image={coverPicture}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={true}
            objectFit="horizontal-cover"
          />
        </div>
      )}
    </div>
  );
}
