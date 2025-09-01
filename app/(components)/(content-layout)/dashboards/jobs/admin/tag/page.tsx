"use client";
import TagCreate from "@/app/projects/components/jobportal/admin/tag/TagCreate";
import TagList from "@/app/projects/components/jobportal/admin/tag/TagList";

export default function Industries() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Create Tag Section */}
      <div className="mb-10">
        <p className="text-lg font-semibold mb-4 text-gray-700">Create Tag</p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <TagCreate />
        </div>
      </div>

      {/* Tag List Section */}
      <div>
        <p className="text-lg font-semibold mb-4 text-gray-700">Tag Name</p>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <TagList />
        </div>
      </div>
    </div>
  );
}
