"use client";

import StateCreate from "@/app/projects/components/jobportal/admin/state/StateCreate";
import StateList from "@/app/projects/components/jobportal/admin/state/StateList";

export default function Industries() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Create State Section */}
      <div className="mb-10">
        <p className="text-lg font-semibold text-gray-700 mb-4">Create State</p>
        <div className="bg-white shadow rounded-lg p-6">
          <StateCreate />
        </div>
      </div>

      {/* State List Section */}
      <div>
        <p className="text-lg font-semibold text-gray-700 mb-4">State Name</p>
        <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
          <StateList />
        </div>
      </div>
    </div>
  );
}
