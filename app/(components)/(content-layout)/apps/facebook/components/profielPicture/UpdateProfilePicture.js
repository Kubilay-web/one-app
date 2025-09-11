import axios from "axios";
import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import PulseLoader from "react-spinners/PulseLoader";
import Cookies from "js-cookie";
import getCroppedImg from "./getCroppedImg"; // kendi utility fonksiyonun

export default function UpdateProfilePicture({
  setImage,
  image,
  setError,
  setShow,
  pRef,
}) {
  const [description, setDescription] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const slider = useRef(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const zoomIn = () => {
    slider.current.stepUp();
    setZoom(Number(slider.current.value));
  };

  const zoomOut = () => {
    slider.current.stepDown();
    setZoom(Number(slider.current.value));
  };

  const getCroppedImage = useCallback(
    async (show) => {
      try {
        const img = await getCroppedImg(image, croppedAreaPixels);
        if (show) {
          setZoom(1);
          setCrop({ x: 0, y: 0 });
          setImage(img);
        } else {
          return img;
        }
      } catch (error) {
        console.error(error);
      }
    },
    [croppedAreaPixels, image, setImage]
  );

  const updateProfilePicture = async () => {
    try {
      setLoading(true);
      const img = await getCroppedImage(); // base64
      const response = await axios.post("/api/social/updateprofile", {
        file: img,
      });

      if (response.status === 200) {
        setImage("");
        pRef.current.style.backgroundImage = `url(${response.data.avatarUrl})`;
        Cookies.set("user", JSON.stringify({ picture: response.data.avatarUrl }));
        setShow(false);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="postBox update_img">
      <div className="box_header">
        <div className="small_circle" onClick={() => setImage("")}>
          <i className="exit_icon"></i>
        </div>
        <span>Update profile picture</span>
      </div>
      <div className="update_image_desc">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea_blue details_input"
        />
      </div>
      <div className="update_center">
        <div className="crooper">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
          />
        </div>
        <div className="slider">
          <div className="slider_circle hover1" onClick={zoomOut}>
            <i className="minus_icon"></i>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.2}
            ref={slider}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <div className="slider_circle hover1" onClick={zoomIn}>
            <i className="plus_icon"></i>
          </div>
        </div>
      </div>
      <div className="flex_up">
        <div className="gray_btn" onClick={() => getCroppedImage("show")}>
          <i className="crop_icon"></i>Crop photo
        </div>
        <div className="gray_btn">
          <i className="temp_icon"></i>Make Temporary
        </div>
      </div>
      <div className="flex_p_t">
        <i className="public_icon"></i>
        Your profile picture is public
      </div>
      <div className="update_submit_wrap">
        <div className="blue_link" onClick={() => setImage("")}>
          Cancel
        </div>
        <button className="blue_btn" disabled={loading} onClick={updateProfilePicture}>
          {loading ? <PulseLoader color="#fff" size={5} /> : "Save"}
        </button>
      </div>
    </div>
  );
}
