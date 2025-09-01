"use client";
import JobCategoryCreate from "@/app/projects/components/jobportal/admin/jobcategories/JobCategoriesCreate";
import JobCategoryList from "@/app/projects/components/jobportal/admin/jobcategories/JobCategoriesList";

export default function Industries() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Job Category Create Section */}
      <div className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Create Job Categories</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <JobCategoryCreate />
        </div>
      </div>

      {/* Job Category List Section */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">Job Categories List</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <JobCategoryList />
        </div>
      </div>
    </div>
  );
}
