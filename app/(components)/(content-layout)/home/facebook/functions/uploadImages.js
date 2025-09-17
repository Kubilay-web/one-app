import axios from "axios";

// Cloudinary upload (unsigned upload veya backend signed olabilir)
export const uploadImages = async (formData) => {
  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return res.data; // secure_url vs. döner
  } catch (err) {
    throw new Error(err.response?.data?.error?.message || "Upload başarısız");
  }
};
