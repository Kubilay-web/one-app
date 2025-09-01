"use client";
import OrganizationCreate from "@/app/projects/components/jobportal/admin/organization/OrganizationCreate";
import OrganizationList from "@/app/projects/components/jobportal/admin/organization/OrganizationList";

export default function Industries() {
  return (
    <div className="w-11/12 mx-auto my-10 space-y-10">
      {/* Create Organization Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-xl font-semibold mb-4">Create Organization</p>
        <OrganizationCreate />
      </div>

      {/* Organization List Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-xl font-semibold mb-6">Organization Name</p>
        <OrganizationList />
      </div>
    </div>
  );
}
