"use client";
import TeamList from "@/app/projects/components/jobportal/admin/team/TeamList";
import TeamCreate from "@/app/projects/components/jobportal/admin/team/TeamCreate";

export default function Industries() {
  return (
    <div className="container mx-auto px-4 mb-10">
      {/* Create Team Section */}
      <div className="mb-10">
        <p className="text-xl font-semibold mb-4">Create Team</p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <TeamCreate />
        </div>
      </div>

      {/* Team List Section */}
      <div>
        <p className="text-xl font-semibold mb-4">Team Name</p>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <TeamList />
        </div>
      </div>
    </div>
  );
}
