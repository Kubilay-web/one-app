"use client";
import Navigation from "@/app/projects/components/jobportal/company/Navigation";

export default function Profile() {
  return (
    <div className="w-11/12 md:w-4/5 mx-auto my-8">
      <div className="flex flex-col md:flex-row">
        <div className="w-full">
          <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
            Company Profiles
          </p>
          <hr className="border-gray-300 mb-6" />
          <Navigation />
        </div>
      </div>
    </div>
  );
}
