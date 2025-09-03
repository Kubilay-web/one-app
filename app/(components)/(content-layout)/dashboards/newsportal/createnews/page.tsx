"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaImages } from "react-icons/fa6";
import Gallery from "@/app/projects/components/newsportal/Gallery";
import axios from "axios";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const CreateNews = () => {
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [images, setImages] = useState([]);

  const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false, // Sunucu tarafında render edilmesini engeller
  });

  const editor = useRef(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");

  const imageHandle = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImg(URL.createObjectURL(files[0]));
      setImage(files[0]);
    }
  };

  const added = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      setLoader(true);
      const { data } = await axios.post(`/api/news/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoader(false);
      toast.success(data.message);
      // Temizle
      setTitle("");
      setDescription("");
      setImage(null);
      setImg("");
      setImages([]);
    } catch (error) {
      setLoader(false);
      toast.error(
        error?.response?.data?.message ||
          "Failed to add news. Please try again.",
      );
    }
  };

  const get_images = async () => {
    try {
      const { data } = await axios.get(`/api/news/images`, {});
      console.log(data.images);
      setImages(data.images);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_images();
  }, []);

  const [imagesLoader, setImagesLoader] = useState(false);

  const imageHandler = async (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    setImagesLoader(true);

    try {
      const base64Images = await Promise.all(
        Array.from(files).map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        }),
      );

      const { data } = await axios.post(`/api/news/images`, {
        images: base64Images,
      });

      if (!Array.isArray(data.images)) {
        throw new Error("API did not return image array");
      }

      setImages((prev = []) => [...prev, ...data.images]);
      toast.success(data.message);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Image upload failed. Try again.",
      );
    } finally {
      setImagesLoader(false);
    }
  };

  return (
    <div className="rounded-md bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-700">Add News</h2>
        <Link
          href="/dashboard/news"
          className="rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-800"
        >
          View All
        </Link>
      </div>

      <form onSubmit={added}>
        <div>
          <label
            htmlFor="title"
            className="text-md mb-2 block font-medium text-gray-600"
          >
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter News Title"
            name="title"
            id="title"
            className="h-10 w-full rounded-md border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="img"
            className="mt-4 flex h-[240px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-500 text-gray-500 transition hover:border-blue-500"
          >
            {img ? (
              <img
                src={img}
                className="h-full w-full object-contain"
                alt="image"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-y-2">
                <FaImages className="mb-2 text-4xl" />
                <span className="font-medium">Select Image</span>
              </div>
            )}
          </label>
          <input
            onChange={imageHandle}
            type="file"
            className="hidden"
            id="img"
            accept="image/*"
            required
          />
        </div>

        <div>
          <div className="mb-2 mt-4 flex items-center justify-between">
            <label
              htmlFor="description"
              className="text-md block font-medium text-gray-600"
            >
              Description
            </label>
            <div
              onClick={() => setShow(true)}
              className="cursor-pointer text-blue-500 hover:text-blue-800"
            >
              <FaImages className="text-2xl" />
            </div>
          </div>
          <JoditEditor
            ref={editor}
            value={description}
            tabIndex={1}
            onBlur={(value) => setDescription(value)}
            onChange={() => {}}
            className="w-full rounded-md border border-gray-400"
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={loader}
            className="rounded-md bg-blue-500 px-3 py-[6px] text-white hover:bg-blue-800"
          >
            {loader ? "Loading..." : "Add News"}
          </button>
        </div>
      </form>

      {show && <Gallery setShow={setShow} images={images} />}
      <input
        onChange={imageHandler}
        type="file"
        multiple
        id="images"
        className="hidden"
      />
    </div>
  );
};

export default CreateNews;
