"use client";

import LanguageCreate from "@/app/projects/components/jobportal/admin/language/LanguageCreate";
import LanguageList from "@/app/projects/components/jobportal/admin/language/LanguageList";

export default function Industries() {
  return (
    <div className="w-full max-w-5xl mx-auto p-5">
      {/* Create Language Section */}
      <div className="mb-10 bg-white shadow-lg rounded-xl p-6">
        <p className="text-lg font-semibold mb-4 text-gray-700">Create Language</p>
        <LanguageCreate />
      </div>

      {/* Language List Section */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <p className="text-lg font-semibold mb-4 text-gray-700">Language Name</p>
        <LanguageList />
      </div>
    </div>
  );
}
