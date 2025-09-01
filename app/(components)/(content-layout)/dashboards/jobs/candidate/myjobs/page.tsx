"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/candidate/myjob`
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err || "Failed to fetch jobs");
      }

      setJobs(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6">My Jobs</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Salary
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((jobData, index) => {
                const job = jobData.job;
                const isActive = new Date(job.deadline) > new Date();
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={job.company.logoSecureUrl}
                        alt={job.company.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <span className="font-medium">{job.company.name}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      $
                      {job.salary_mode === "range"
                        ? `${job.min_salary} - ${job.max_salary}`
                        : job.custom_salary}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(jobData.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {job.status === "pending" ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-gray-900 text-sm font-medium">
                          Pending
                        </span>
                      ) : (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          }`}
                        >
                          {isActive ? "Active" : "Expired"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/company/${job.company.slug}`}
                        className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
