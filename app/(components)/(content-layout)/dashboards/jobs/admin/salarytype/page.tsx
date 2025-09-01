"use client";

import SalaryCreate from "@/app/projects/components/jobportal/admin/salarytype/SalarytypeCreate";
import SalaryList from "@/app/projects/components/jobportal/admin/salarytype/SalarytypeList";

export default function Industries() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Create Salary Type */}
      <div className="mb-10">
        <p className="text-lg font-semibold text-gray-700 mb-4">Create Salary Type</p>
        <div className="bg-white shadow rounded-lg p-6">
          <SalaryCreate />
        </div>
      </div>

      {/* Salary Type List */}
      <div>
        <p className="text-lg font-semibold text-gray-700 mb-4">Salary Type Name</p>
        <div className="bg-white shadow rounded-lg p-6">
          <SalaryList />
        </div>
      </div>
    </div>
  );
}
