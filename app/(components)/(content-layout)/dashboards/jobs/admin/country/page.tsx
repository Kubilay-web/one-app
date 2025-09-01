"use client";
import CountryCreate from "@/app/projects/components/jobportal/admin/country/CountryCreate";
import CountryList from "@/app/projects/components/jobportal/admin/country/CountryList";

export default function Industries() {
  return (
    <div className="mx-auto my-8 w-full max-w-6xl px-4">
      {/* Country Create Section */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
        <p className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          Country Create
        </p>
        <CountryCreate />
      </div>

      {/* Country List Section */}
      <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
        <p className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
          Country List Name
        </p>
        <CountryList />
      </div>
    </div>
  );
}
