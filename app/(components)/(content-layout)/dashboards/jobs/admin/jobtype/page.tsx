"use client";

import JobtypeCreate from "@/app/projects/components/jobportal/admin/jobtype/JobtypeCreate";
import JobtypeList from "@/app/projects/components/jobportal/admin/jobtype/JobtypeList";

export default function Industries() {
  return (
    <div className="w-full max-w-5xl mx-auto p-5">
      {/* Create Jobtype Section */}
      <div className="mb-10 bg-white shadow-lg rounded-xl p-6">
        <p className="text-lg font-semibold mb-4 text-gray-700">Create Jobtype</p>
        <JobtypeCreate />
      </div>

      {/* Jobtype List Section */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <p className="text-lg font-semibold mb-4 text-gray-700">Jobtype Name</p>
        <JobtypeList />
      </div>
    </div>
  );
}
