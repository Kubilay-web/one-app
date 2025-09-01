"use client";
import ProfessionCreate from "@/app/projects/components/jobportal/admin/profession/ProfessionCreate";
import ProfessionList from "@/app/projects/components/jobportal/admin/profession/ProfessionList";

export default function Industries() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      
      {/* Create Profession */}
      <div className="mb-10">
        <p className="text-lg font-semibold text-gray-700 mb-4">Create Profession</p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ProfessionCreate />
        </div>
      </div>

      {/* Profession List */}
      <div>
        <p className="text-lg font-semibold text-gray-700 mb-4">Profession Name</p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ProfessionList />
        </div>
      </div>

    </div>
  );
}
