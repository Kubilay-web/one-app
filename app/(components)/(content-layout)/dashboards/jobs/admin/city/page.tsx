"use client";
import CityCreate from "@/app/projects/components/jobportal/admin/city/CityCreate";
import CityList from "@/app/projects/components/jobportal/admin/city/CityList";

export default function Industries() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* City Create */}
      <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          City Create
        </p>
        <CityCreate />
      </div>

      {/* City List */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800">
        <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          City List Name
        </p>
        <CityList />
      </div>
    </div>
  );
}
