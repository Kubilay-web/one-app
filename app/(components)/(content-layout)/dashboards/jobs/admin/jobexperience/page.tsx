"use client";
import JobExperienceCreate from "@/app/projects/components/jobportal/admin/jobexperience/JobexperienceCreate";
import JobExperienceList from "@/app/projects/components/jobportal/admin/jobexperience/JobexperienceList";

export default function Industries() {
  return (
    <div className="mx-auto my-10 max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Create Job Experience Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Create Job Experience</h2>
        <div className="bg-white p-6 rounded-2xl shadow-lg transition-shadow hover:shadow-xl">
          <JobExperienceCreate />
        </div>
      </section>

      {/* Job Experience List Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Job Experience List</h2>
        <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto transition-shadow hover:shadow-xl">
          <JobExperienceList />
        </div>
      </section>
    </div>
  );
}

