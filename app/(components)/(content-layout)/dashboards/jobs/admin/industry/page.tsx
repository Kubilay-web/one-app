"use client";

import { useEffect } from "react";
import IndustryCreate from "@/app/projects/components/jobportal/admin/industry/IndustryCreate";
import IndustryList from "@/app/projects/components/jobportal/admin/industry/IndustryList";

export default function Industries() {
  return (
    <div className="mx-auto mb-10 max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Create Industry Section */}
      <div className="mb-10">
        <p className="mb-4 text-lg font-semibold text-gray-700">Create Industry</p>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <IndustryCreate />
        </div>
      </div>

      {/* Industry List Section */}
      <div>
        <p className="mb-4 text-lg font-semibold text-gray-700">Industries Name</p>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <IndustryList />
        </div>
      </div>
    </div>
  );
}
