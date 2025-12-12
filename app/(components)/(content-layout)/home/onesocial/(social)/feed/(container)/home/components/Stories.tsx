"use client";
import { FaPlus } from "react-icons/fa6";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const StoryComponent = dynamic(() => import("./StoryComponent"), {
  ssr: false,
});

// Default avatar
import defaultAvatar from "@/app/(components)/(content-layout)/home/onesocial/assets/images/avatar/03.jpg";

type StoryItem = {
  id: string;
  type: string;
  text?: string;
  images: string[];
  background?: string;
  expiresAt?: string;
  viewers?: string;
  createdAt: string;
  isViewed: boolean;
};

type StoryUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

type StoryGroup = {
  user: StoryUser;
  stories: StoryItem[];
  hasUnviewed: boolean;
};

const Stories = () => {
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStoryText, setNewStoryText] = useState("");
  const [newStoryImage, setNewStoryImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null); // cursor kontrolü için ref

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);

      const storiesResponse = await fetch("/api/onesocial/stories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
      });

      if (storiesResponse.ok) {
        const data = await storiesResponse.json();
        if (data.success) setStories(data.stories);
      }

      const userResponse = await fetch("/api/onesocial/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success && userData.user?.avatarUrl)
          setUserAvatar(userData.user.avatarUrl);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const markStoryAsViewed = async (storyId: string) => {
    try {
      await fetch(`/api/onesocial/stories/${storyId}/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      setStories((prev) =>
        prev.map((group) => ({
          ...group,
          stories: group.stories.map((story) =>
            story.id === storyId ? { ...story, isViewed: true } : story
          ),
          hasUnviewed: group.stories.some(
            (s) => !s.isViewed && s.id !== storyId
          ),
        }))
      );
    } catch (error) {
      console.error("Error marking story as viewed:", error);
    }
  };

  const handleCreateStoryClick = () => setShowCreateModal(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setNewStoryImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStory = async () => {
    if (!newStoryText.trim() && !newStoryImage) {
      alert("Please add text or image to your story");
      return;
    }
    try {
      setUploading(true);
      const response = await fetch("/api/onesocial/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          text: newStoryText.trim(),
          images: newStoryImage ? [newStoryImage] : [],
          type: "story",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setShowCreateModal(false);
          setNewStoryText("");
          setNewStoryImage(null);
          fetchStories();
          alert("Story posted successfully!");
        }
      } else {
        alert("Failed to create story");
      }
    } catch (error) {
      console.error("Error creating story:", error);
      alert("Error creating story");
    } finally {
      setUploading(false);
    }
  };

  const formatStoriesForComponent = () =>
    stories.map((storyGroup, index) => ({
      id: (index + 1).toString(),
      name: storyGroup.user.displayName || storyGroup.user.username,
      photo: storyGroup.user.avatarUrl || defaultAvatar.src,
      time:
        new Date(storyGroup.stories[0]?.createdAt || Date.now()).getTime() /
        1000,
      items: storyGroup.stories.map((story) => ({
        id: story.id,
        src: story.images[0] || "",
        type: story.type === "video" ? "video" : "photo",
        preview: story.images[0] || "",
        length: 5,
        text: story.text,
        link: "",
        linkText: false,
        time: new Date(story.createdAt).getTime() / 1000,
        isViewed: story.isViewed,
        onView: () => markStoryAsViewed(story.id),
      })),
    }));

  const CreateStoryModal = () => {
    if (!showCreateModal) return null;
    

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Create a Story</h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={uploading}
            >
              ×
            </button>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <textarea
                ref={textareaRef}
                value={newStoryText}
                onChange={(e) => {
                  const textarea = e.target;
                  const { selectionStart, selectionEnd } = textarea;
                  setNewStoryText(textarea.value);
                  setTimeout(() => {
                    textarea.setSelectionRange(selectionStart, selectionEnd);
                  }, 0);
                }}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="What's on your mind?"
                maxLength={500}
                disabled={uploading}
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-1">
                {newStoryText.length}/500
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Add Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded-lg"
                disabled={uploading}
              />
              {newStoryImage && (
                <div className="mt-3 relative">
                  <Image
                    src={newStoryImage}
                    alt="Story preview"
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                  <button
                    onClick={() => setNewStoryImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    disabled={uploading}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500 mb-4">
              <p className="font-semibold mb-1">
                Story will disappear after 24 hours
              </p>
              <p>Your friends will see this in their stories feed</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateStory}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              disabled={uploading || (!newStoryText.trim() && !newStoryImage)}
            >
              {uploading ? "Posting..." : "Post Story"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex gap-2 -mb-3">
        {/* Create Story Button */}
        <div className="relative">
          <div
            className="
              border-2 border-dashed 
              h-[150px] 
              w-[120px]
              shadow-none 
              flex 
              items-center 
              justify-center 
              text-center 
              rounded-lg
              bg-white
              border-gray-300
              hover:border-gray-400
              transition-colors
              duration-200
              cursor-pointer
            "
            onClick={handleCreateStoryClick}
          >
            <div className="relative">
              <div className="relative w-12 h-12 mx-auto mb-2">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt="Your avatar"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-full" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                  <FaPlus className="text-white text-xs" />
                </div>
              </div>
              <h6 className="text-sm text-gray-600 font-medium">Create story</h6>
            </div>
          </div>
        </div>

        {/* Stories List */}
        {loading ? (
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[120px] h-[150px] bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : stories.length > 0 ? (
          <StoryComponent
            stories={formatStoriesForComponent()}
            onStoryView={markStoryAsViewed}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No stories from friends yet</p>
          </div>
        )}
      </div>

      <CreateStoryModal />
    </>
  );
};

export default Stories;
