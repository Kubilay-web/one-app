"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSession } from "@/app/SessionProvider";
import Link from "next/link";

export default function Candidate() {
  const { user } = useSession();
  const [profileComplete, setProfileComplete] = useState(false);
  const [applied, setApplied] = useState(0);
  const [saved, setSaved] = useState(0);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    checkProfileCompletion();
    fetchJobs();
  }, []);

  const checkProfileCompletion = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/candidate/dash`
      );
      const data = await response.json();

      if (response.ok) {
        setProfileComplete(data.profileComplete);
        setApplied(data.appliedjob);
        setSaved(data.jobbookmark);
      } else {
        toast.error(data.error || "Failed to check profile completion");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/candidate/myjob`
      );
      const data = await response.json();

      if (response.ok) {
        setJobs(data.data || []);
      } else {
        toast.error(data.error || "Failed to fetch jobs");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-8">
      {/* Profile Completion */}
      <div className="bg-white shadow rounded-lg p-6 text-center">
        {profileComplete ? (
          <p className="text-blue-600 font-semibold">
            Profile is complete, {user?.username}
          </p>
        ) : (
          <p className="text-red-600 font-semibold">
            Please complete your profile, {user?.username}{" "}
            <Link
              href="/dashboard/candidate/my-profile"
              className="text-blue-500 underline ml-1"
            >
              🌀 Edit Profile
            </Link>
          </p>
        )}
      </div>

      {/* Applied & Saved Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Applied Jobs</h3>
          <p className="text-2xl font-bold text-blue-600">{applied}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Saved Jobs</h3>
          <p className="text-2xl font-bold text-blue-600">{saved}</p>
        </div>
      </div>

      {/* Recent Applied Jobs */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Recent Applied Jobs
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {["Company", "Salary", "Date", "Status", "Actions"].map(
                  (head, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-4 text-gray-500 font-medium"
                  >
                    No jobs applied yet.
                  </td>
                </tr>
              ) : (
                jobs.map((jobEntry, index) => {
                  const job = jobEntry.job;
                  const company = job.company;
                  const isActive = new Date(job.deadline) > new Date();

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 flex items-center space-x-3">
                        <img
                          src={company.logoSecureUrl}
                          alt={company.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="text-gray-800 font-medium">
                          {company.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {job.salary_mode === "range"
                          ? `$${job.min_salary} - $${job.max_salary}`
                          : `$${job.custom_salary}`}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(jobEntry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
                            isActive ? "bg-blue-500" : "bg-red-500"
                          }`}
                        >
                          {isActive ? "Active" : "Expired"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/job-portal/company/${company.slug}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
