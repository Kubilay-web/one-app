"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Company() {
  const [jobs, setJobs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/company/jobs/create`
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        setJobs(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching jobs");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/job/company/jobdetails/?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/company/jobs/create/${id}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.err);
      } else {
        toast.success("Job deleted");
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting job");
    }
  };

  const handleApplication = (id: string) => {
    toast.success(`View applications for job ID: ${id}`);
  };

  return (
    <main className="p-4 md:p-10 space-y-6">
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Picture",
                "Title",
                "Category Name",
                "Deadline",
                "Status",
                "Applications",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-4 text-gray-500 font-medium"
                >
                  No jobs available.
                </td>
              </tr>
            ) : (
              jobs.map((job, index) => {
                const isActive = new Date(job.deadline) > new Date();
                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    {/* Company Logo & Name */}
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <img
                        src={job?.company.logoSecureUrl}
                        alt={job?.companyId?.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="text-gray-800 font-medium">
                        {job?.companyId?.name}
                      </span>
                    </td>

                    {/* Job Title */}
                    <td className="px-4 py-3 text-gray-700">{job.title}</td>

                    {/* Category */}
                    <td className="px-4 py-3 text-gray-700">
                      {job.job_category?.name}
                    </td>

                    {/* Deadline */}
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(job.deadline).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${
                          job.status === "pending"
                            ? "bg-yellow-500 text-gray-900"
                            : isActive
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}
                      >
                        {job.status === "pending"
                          ? "Pending"
                          : isActive
                          ? "Active"
                          : "Expired"}
                      </span>
                    </td>

                    {/* Applications */}
                    <td className="px-4 py-3 text-gray-700">
                      {job?.jobcount || 0} applications
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(job?.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job?.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleApplication(job?.id)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-sm transition"
                      >
                        Applications
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
