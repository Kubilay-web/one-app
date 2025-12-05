"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/SessionProvider";

const CreateInstagramProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    bio: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {user}=useSession()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sending a request to the API route to create a profile
      const response = await fetch("/api/instagram/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email, // Use the logged-in user's email here
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("An error occurred while creating the profile.");
      }

      // If the profile is created successfully, redirect the user to the home page
      router.push("/home/instagram");
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while creating the profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Create Your Instagram Profile</h2>

      {/* Display error message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {loading ? "Loading..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
};

export default CreateInstagramProfile;
