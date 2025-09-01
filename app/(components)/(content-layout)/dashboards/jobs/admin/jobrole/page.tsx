"use client";

import JobroleCreate from "@/app/projects/components/jobportal/admin/jobrole/JobroleCreate";
import JobroleList from "@/app/projects/components/jobportal/admin/jobrole/JobroleList";

export default function Industries() {
  return (
    <div className="mx-auto my-10 max-w-6xl px-4">
      {/* Create Job Role Section */}
      <div className="mb-10">
        <p className="mb-4 text-xl font-semibold text-gray-700">
          Create Job Role
        </p>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <JobroleCreate />
        </div>
      </div>

      {/* Job Role List Section */}
      <div className="mb-10">
        <p className="mb-4 text-xl font-semibold text-gray-700">
          Job Role List
        </p>
        <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
          <JobroleList />
        </div>
      </div>
    </div>
  );
}
