"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  BsBookmarkCheck,
  BsCalendar2EventFill,
  BsCameraReels,
  BsCameraReelsFill,
  BsCameraVideoFill,
  BsEmojiSmileFill,
  BsEnvelope,
  BsFileEarmarkText,
  BsGeoAltFill,
  BsImageFill,
  BsImages,
  BsPencilSquare,
  BsTagFill,
  BsThreeDots,
} from "react-icons/bs";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useToggle from "../../hooks/useToggle";
import DropzoneFormInput from "../form/DropzoneFormInput";
import TextFormInput from "../form/TextFormInput";
import TextAreaFormInput from "../form/TextAreaFormInput";
import DateFormInput from "../form/DateFormInput";
import ChoicesFormInput from "../form/ChoicesFormInput";
import Link from "next/link";

// Default avatar
import avatar3 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/03.jpg";
import avatar1 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/01.jpg";
import avatar2 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/02.jpg";
import avatar4 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/04.jpg";
import avatar5 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/05.jpg";
import avatar6 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/06.jpg";
import avatar7 from "@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/07.jpg";

const SimpleFileUpload = ({
  accept,
  multiple = true,
  onFilesSelected,
}: {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log("Seçilen dosyalar:", files);
    onFilesSelected(files);

    // Preview oluştur
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeFile = (index: number) => {
    // URL'yi temizle
    URL.revokeObjectURL(previewUrls[index]);

    const newUrls = [...previewUrls];
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);

    // Parent component'e güncellenmiş dosya listesini gönder
    onFilesSelected([]);
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload {accept.includes("image") ? "images" : "videos"}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id={`file-input-${accept}`}
        />
        <label
          htmlFor={`file-input-${accept}`}
          className="cursor-pointer block"
        >
          <BsImages className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            Click to upload {accept.includes("image") ? "images" : "videos"} or
            drag & drop
          </p>
        </label>
      </div>

      {/* Preview'lar */}
      {previewUrls.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-sm font-medium text-gray-700">
            {previewUrls.length}{" "}
            {accept.includes("image") ? "image(s)" : "video(s)"} selected
          </div>
          <div className="grid grid-cols-2 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                {accept.includes("image") ? (
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={url}
                    className="w-full h-32 object-cover rounded-lg"
                    controls
                    preload="metadata"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CreatePostCard = () => {
  const guests = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
  ];
  const { isTrue: isOpenPhoto, toggle: togglePhotoModel } = useToggle();
  const { isTrue: isOpenVideo, toggle: toggleVideoModel } = useToggle();
  const { isTrue: isOpenEvent, toggle: toggleEvent } = useToggle();
  const { isTrue: isOpenPost, toggle: togglePost } = useToggle();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [photoContent, setPhotoContent] = useState(""); // Photo modal için text
  const [videoContent, setVideoContent] = useState(""); // Video modal için text
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Fotoğraflar
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]); // Videolar
  const [isPostingPhoto, setIsPostingPhoto] = useState(false);
  const [isPostingVideo, setIsPostingVideo] = useState(false);
  const [uploadedImageFiles, setUploadedImageFiles] = useState<File[]>([]);
  const [uploadedVideoFiles, setUploadedVideoFiles] = useState<File[]>([]);

  // File'ı base64'e çevirme fonksiyonunu ekleyin
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // DropzoneFormInput callback'lerini güncelleyin
  const handleImageFiles = (files: any[]) => {
    // File'ları filtrele
    const imageFiles = files.filter((item) => item && item instanceof File);
    setUploadedImageFiles(imageFiles);
  };

  const handleVideoFiles = (files: any[]) => {
    const videoFiles = files.filter((item) => item && item instanceof File);
    setUploadedVideoFiles(videoFiles);
  };

  // Kullanıcı avatarını fetch et
  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/onesocial/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user?.avatarUrl) {
            setUserAvatar(data.user.avatarUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching user avatar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAvatar();
  }, []);

  const eventFormSchema = yup.object({
    title: yup.string().required("Please enter event title"),
    description: yup.string().required("Please enter event description"),
    duration: yup.string().required("Please enter event duration"),
    location: yup.string().required("Please enter event location"),
    guest: yup
      .string()
      .email("Please enter valid email")
      .required("Please enter event guest email"),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(eventFormSchema),
  });

  const Modal = ({ isOpen, onClose, children, title }: any) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const ModalFooter = ({ children }: any) => (
    <div className="flex justify-end gap-2 p-4 border-t">{children}</div>
  );

  const Tooltip = ({ children, text }: any) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {children}
        </div>
        {show && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
            {text}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (postContent.trim()) {
      try {
        // Hangi endpoint'i kullandığınızı kontrol edin
        const response = await fetch("/api/onesocial/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            text: postContent, // veya content: postContent
            type: "post",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Post successful:", data);
          setPostContent("");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error posting:", error);
      }
    }
  };

  // Photo Modal için post işlemi

  const handlePhotoPostSubmit = async () => {
    if (!photoContent.trim() && uploadedImageFiles.length === 0) return;

    try {
      setIsPostingPhoto(true);

      // File'ları base64'e çevir
      const base64Images: string[] = [];
      for (const file of uploadedImageFiles) {
        const base64 = await fileToBase64(file);
        base64Images.push(base64);
      }

      // API'ye gönder (Cloudinary'e yüklenecek)
      const response = await fetch("/api/onesocial/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          text: photoContent,
          images: base64Images, // Base64 resimler
          type: "post",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Photo post successful:", data);
        setPhotoContent("");
        setUploadedImageFiles([]);
        togglePhotoModel();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error posting photo:", error);
    } finally {
      setIsPostingPhoto(false);
    }
  };

  // Video Modal için post işlemi

  // Video Modal için post işlemi
  const handleVideoPostSubmit = async () => {
    if (!videoContent.trim() && uploadedVideoFiles.length === 0) {
      console.log("Hata: Video içeriği veya dosya yok");
      return;
    }

    try {
      setIsPostingVideo(true);
      console.log("Video gönderimi başlıyor...");

      // File'ları base64'e çevir
      const base64Videos: string[] = [];
      for (const file of uploadedVideoFiles) {
        console.log(`Dosya işleniyor: ${file.name} (${file.size} bytes)`);
        try {
          const base64 = await fileToBase64(file);
          base64Videos.push(base64);
          console.log(`Dosya başarıyla base64'e çevrildi: ${file.name}`);
        } catch (error) {
          console.error(`Dosya işleme hatası (${file.name}):`, error);
        }
      }

      console.log("API isteği hazırlanıyor...");

      // API'ye gönder - videos alanını kullan
      const response = await fetch("/api/onesocial/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          text: videoContent,
          videos: base64Videos, // videos olarak gönder
          type: "post",
        }),
      });

      console.log("API yanıtı alındı:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Video post successful:", data);
        setVideoContent("");
        setUploadedVideoFiles([]);
        toggleVideoModel();
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        alert(`Video gönderilemedi: ${errorText}`);
      }
    } catch (error) {
      console.error("Error posting video:", error);
      alert(`Hata: ${error}`);
    } finally {
      setIsPostingVideo(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex mb-3">
          <div className="relative w-8 h-8 mr-2">
            <span role="button" className="cursor-pointer">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <Image
                  className="rounded-full object-cover w-full h-full"
                  src={userAvatar}
                  alt="User avatar"
                  width={32}
                  height={32}
                  priority
                />
              )}
            </span>
          </div>

          <form className="w-full" onSubmit={handlePostSubmit}>
            <textarea
              ref={textareaRef}
              className="w-full p-2 border-0 focus:outline-none focus:ring-0 resize-none"
              rows={2}
              placeholder="Share your thoughts..."
              onChange={handleTextareaChange}
              value={postContent}
            />

            {/* Post butonu - yazı yazılınca görünür */}
            {postContent.trim() && (
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Post
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="flex flex-wrap gap-2 text-sm font-normal">
          <button
            className="flex items-center bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded transition-colors"
            onClick={togglePhotoModel}
          >
            <BsImageFill size={20} className="text-green-500 mr-2" />
            Photo
          </button>
          <button
            className="flex items-center bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded transition-colors"
            onClick={toggleVideoModel}
          >
            <BsCameraReelsFill size={20} className="text-blue-500 mr-2" />
            Video
          </button>
          <button
            className="flex items-center bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded transition-colors"
            onClick={toggleEvent}
          >
            <BsCalendar2EventFill size={20} className="text-red-500 mr-2" />
            Event
          </button>
          <button
            className="flex items-center bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded transition-colors"
            onClick={togglePost}
          >
            <BsEmojiSmileFill size={20} className="text-yellow-500 mr-2" />
            Feeling /Activity
          </button>

          <div className="relative ml-auto">
            <button
              className="flex items-center bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded transition-colors"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <BsThreeDots />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <BsEnvelope size={21} className="mr-2" />
                    Create a poll
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <BsBookmarkCheck size={21} className="mr-2" />
                    Ask a question
                  </Link>
                  <div className="border-t my-1"></div>
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <BsPencilSquare size={21} className="mr-2" />
                    Help
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Modal */}

      <Modal
        isOpen={isOpenPhoto}
        onClose={togglePhotoModel}
        title="Add post photo"
      >
        <div className="p-4">
          <div className="flex mb-3">
            <div className="relative w-8 h-8 mr-2">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <Image
                  className="rounded-full object-cover w-full h-full"
                  src={userAvatar || avatar3}
                  alt="User avatar"
                  width={32}
                  height={32}
                />
              )}
            </div>
            <div className="w-full">
              <textarea
                className="w-full p-2 text-xl leading-tight border-0 focus:outline-none focus:ring-0 resize-none"
                rows={2}
                placeholder="Share your thoughts..."
                value={photoContent}
                onChange={(e) => setPhotoContent(e.target.value)}
              />
            </div>
          </div>

          {/* Basit dosya yükleme */}
          <SimpleFileUpload
            accept="image/*"
            multiple={true}
            onFilesSelected={(files: File[]) => setUploadedImageFiles(files)}
          />
        </div>
        <ModalFooter>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md"
            onClick={togglePhotoModel}
            disabled={isPostingPhoto}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md disabled:opacity-50"
            onClick={handlePhotoPostSubmit}
            disabled={
              isPostingPhoto ||
              (!photoContent.trim() && uploadedImageFiles.length === 0)
            }
          >
            {isPostingPhoto ? "Posting..." : "Post"}
          </button>
        </ModalFooter>
      </Modal>
      {/* Photo Modal */}

      {/* Video Modal */}

      {/* Video Modal */}
      <Modal
        isOpen={isOpenVideo}
        onClose={toggleVideoModel}
        title="Add post video"
      >
        <div className="p-4">
          <div className="flex mb-3">
            <div className="relative w-8 h-8 mr-2">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <Image
                  className="rounded-full object-cover w-full h-full"
                  src={userAvatar || avatar3}
                  alt="User avatar"
                  width={32}
                  height={32}
                />
              )}
            </div>
            <div className="w-full">
              <textarea
                className="w-full p-2 text-xl leading-tight border-0 focus:outline-none focus:ring-0 resize-none"
                rows={2}
                placeholder="Share your thoughts..."
                value={videoContent}
                onChange={(e) => setVideoContent(e.target.value)}
              />
            </div>
          </div>

          {/* DROPZONE DEĞİL, SimpleFileUpload KULLANIN */}
          <SimpleFileUpload
            accept="video/*"
            multiple={true}
            onFilesSelected={(files: File[]) => setUploadedVideoFiles(files)}
          />

          {/* Debug bilgisi */}
          <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
            <p className="font-medium mb-1">Information:</p>
            <p>Choice Video Files: {uploadedVideoFiles.length}</p>
            {uploadedVideoFiles.length > 0 && (
              <p className="text-xs mt-1">
                File: {uploadedVideoFiles[0].name} -{" "}
                {(uploadedVideoFiles[0].size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>
        <ModalFooter>
          <button
            type="button"
            className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md"
          >
            <BsCameraVideoFill className="mr-1" /> Live video
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md disabled:opacity-50"
            onClick={handleVideoPostSubmit}
            disabled={
              isPostingVideo ||
              (!videoContent.trim() && uploadedVideoFiles.length === 0)
            }
          >
            {isPostingVideo ? "Posting..." : "Post"}
          </button>
        </ModalFooter>
      </Modal>

      {/* Event Modal */}
      <Modal isOpen={isOpenEvent} onClose={toggleEvent} title="Create event">
        <form onSubmit={handleSubmit(() => {})}>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              <TextFormInput
                name="title"
                label="Title"
                placeholder="Event name here"
                containerClassName="col-span-full"
                control={control}
              />
              <TextAreaFormInput
                name="description"
                label="Description"
                rows={2}
                placeholder="Ex: topics, schedule, etc."
                containerClassName="col-span-full"
                control={control}
              />

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <DateFormInput
                    options={{ enableTime: false }}
                    className="w-full p-2 border rounded"
                    placeholder="Select date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <DateFormInput
                    options={{ enableTime: true, noCalendar: true }}
                    className="w-full p-2 border rounded"
                    placeholder="Select time"
                  />
                </div>
                <div>
                  <TextFormInput
                    name="duration"
                    label="Duration"
                    placeholder="1hr 23m"
                    containerClassName="w-full"
                    control={control}
                  />
                </div>
              </div>

              <TextFormInput
                name="location"
                label="Location"
                placeholder="Logansport, IN 46947"
                containerClassName="col-span-full"
                control={control}
              />
              <TextFormInput
                name="guest"
                type="email"
                label="Add guests"
                placeholder="Guest email"
                containerClassName="col-span-full"
                control={control}
              />

              <div className="mt-3">
                <div className="flex items-center">
                  {guests.map((avatar, idx) => (
                    <div className="relative w-8 h-8 -mr-2" key={idx}>
                      <Image
                        className="rounded-full object-cover w-full h-full border-2 border-white"
                        src={avatar}
                        alt="avatar"
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                  <div className="ml-3">
                    <span className="text-sm text-gray-500"> +50 </span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <DropzoneFormInput
                  showPreview
                  helpText="Drop presentation and document here or click to upload."
                  icon={BsFileEarmarkText}
                  label="Upload attachment"
                />
              </div>
            </div>
          </div>
          <ModalFooter>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md"
              onClick={toggleEvent}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md"
            >
              Create now
            </button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Feeling/Activity Modal */}
      <Modal isOpen={isOpenPost} onClose={togglePost} title="Create post">
        <div className="p-4">
          <div className="flex mb-3">
            <div className="relative w-8 h-8 mr-2">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <Image
                  className="rounded-full object-cover w-full h-full"
                  src={userAvatar || avatar3}
                  alt="User avatar"
                  width={32}
                  height={32}
                />
              )}
            </div>
            <form className="w-full">
              <textarea
                className="w-full p-2 text-xl leading-tight border-0 focus:outline-none focus:ring-0 resize-none"
                rows={4}
                placeholder="Share your thoughts..."
                defaultValue={""}
              />
            </form>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Tooltip text="Photo">
              <Link
                className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-full hover:bg-green-100"
                href="#"
              >
                <BsImageFill />
              </Link>
            </Tooltip>
            <Tooltip text="Video">
              <Link
                className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                href="#"
              >
                <BsCameraReelsFill />
              </Link>
            </Tooltip>
            <Tooltip text="Events">
              <Link
                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                href="#"
              >
                <BsCalendar2EventFill />
              </Link>
            </Tooltip>
            <Tooltip text="Feeling/Activity">
              <Link
                className="w-10 h-10 flex items-center justify-center bg-yellow-50 text-yellow-600 rounded-full hover:bg-yellow-100"
                href="#"
              >
                <BsEmojiSmileFill />
              </Link>
            </Tooltip>
            <Tooltip text="Check in">
              <Link
                className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                href="#"
              >
                <BsGeoAltFill />
              </Link>
            </Tooltip>
            <Tooltip text="Tag people on top">
              <Link
                className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                href="#"
              >
                <BsTagFill />
              </Link>
            </Tooltip>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <div className="w-1/4">
            <ChoicesFormInput
              options={{ searchEnabled: false }}
              className="w-full p-2 border rounded"
              data-position="top"
              data-search-enabled="false"
            >
              <option value="PB">Public</option>
              <option value="PV">Friends</option>
              <option value="PV">Only me</option>
              <option value="PV">Custom</option>
            </ChoicesFormInput>
          </div>
          <div className="w-3/4 text-right">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md mr-2"
            >
              <BsCameraVideoFill className="mr-1" /> Live video
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md"
            >
              Post
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreatePostCard;
