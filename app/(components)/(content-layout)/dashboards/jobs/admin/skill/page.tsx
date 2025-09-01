"use client";
import SkillCreate from "@/app/projects/components/jobportal/admin/skill/SkillCreate";
import SkillList from "@/app/projects/components/jobportal/admin/skill/SkillList";

export default function Industries() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Create Skill Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <p className="text-lg font-semibold mb-4">Create Skill</p>
        <SkillCreate />
      </div>

      {/* Skill List Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg font-semibold mb-4">Skill Name</p>
        <SkillList />
      </div>
    </div>
  );
}
