"use client";

import EducationCreate from "@/app/projects/components/jobportal/admin/education/EducationCreate";
import EducationList from "@/app/projects/components/jobportal/admin/education/EducationList";

export default function Industries() {
  return (
    <div className="mx-auto mb-10 max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Education Create Section */}
      <div className="mb-10">
        <p className="mb-4 text-lg font-semibold text-gray-700">Education Skill</p>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <EducationCreate />
        </div>
      </div>

      {/* Education List Section */}
      <div>
        <p className="mb-4 text-lg font-semibold text-gray-700">Education Name</p>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <EducationList />
        </div>
      </div>
    </div>
  );
}
