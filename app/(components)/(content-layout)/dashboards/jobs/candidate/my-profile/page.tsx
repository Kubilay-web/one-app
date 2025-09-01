"use client";
import Navigation from "@/app/projects/components/jobportal/candidate/Navigation";

export default function Profile() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full">
        <p className="text-xl font-semibold mb-2">Profiles</p>
        <hr className="border-green-600 mb-4" />
        <div className="bg-white shadow rounded-lg p-4">
          <Navigation />
        </div>
      </div>
    </div>
  );
}
