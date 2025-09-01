"use client";

import { useState, useEffect } from "react";
import { Switch } from "antd";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  slug: string;
  vacancies: string;
  min_salary: number;
  max_salary: number;
  custom_salary: number;
  deadline?: string;
  description?: string;
  status: "pending" | "active" | "inactive";
  apply_on: "app" | "email" | "custom_url";
  apply_email?: string;
  apply_url?: string;
  featured: boolean;
  highlight: boolean;
  featured_until?: string;
  highlight_until?: string;
  jobcount: number;
  total_views: number;
  address?: string;
  salary_mode: "range" | "custom";
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
    logoSecureUrl?: string;
  };
  job_category?: {
    id: string;
    name: string;
  };
  job_role?: {
    id: string;
    name: string;
  };
  job_experience?: {
    id: string;
    name: string;
  };
  education?: {
    id: string;
    name: string;
  };
  job_type?: {
    id: string;
    name: string;
  };
  salary_type?: {
    id: string;
    name: string;
  };
  city?: {
    id: string;
    name: string;
  };
  state?: {
    id: string;
    name: string;
  };
  country?: {
    id: string;
    name: string;
  };
}

export default function Alljobs() {
  const router = useRouter();
  const [switchStates, setSwitchStates] = useState<Record<string, boolean>>({});
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Bootstrap importları kaldırıldı; Tailwind kullanılıyor.
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/jobs/create`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);

      const initialSwitchStates = data.reduce(
        (acc: Record<string, boolean>, job: Job) => {
          acc[job.id] = job.status === "active";
          return acc;
        },
        {},
      );
      setSwitchStates(initialSwitchStates);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch jobs",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/jobs/create/${jobId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      toast.success("Job deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete job",
      );
    }
  };

  const handleEdit = (jobId: string) => {
    router.push(`/dashboards/jobs/jobsdetails/?id=${jobId}`);
  };

  const handleSwitchChange = async (checked: boolean, jobId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: checked, jobId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update job status");
      }

      setSwitchStates((prev) => ({ ...prev, [jobId]: checked }));
      toast.success(
        `Job ${checked ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update job status",
      );
      setSwitchStates((prev) => ({ ...prev, [jobId]: !checked }));
    }
  };

  const getStatusBadge = (status: string, deadline?: string) => {
    if (status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      );
    }

    const isActive = deadline ? new Date(deadline) > new Date() : false;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
          isActive
            ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
            : "bg-rose-100 text-rose-800 ring-rose-200"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isActive ? "bg-emerald-600" : "bg-rose-600"
          }`}
        />
        {isActive ? "Active" : "Expired"}
      </span>
    );
  };

  const formatSalary = (job: Job) => {
    if (job.salary_mode === "range") {
      return `$${job.min_salary} - $${job.max_salary}`;
    }
    return `$${job.custom_salary}`;
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800 dark:border-gray-700 dark:border-t-white" />
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Loading jobs…
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-800 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                All Jobs
              </h1>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {jobs.length} result{jobs.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="relative overflow-hidden rounded-xl ring-1 ring-gray-200 dark:ring-gray-800">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase tracking-wider text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Picture</th>
                      <th className="px-4 py-3 font-semibold">Title</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Deadline</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Salary</th>
                      <th className="px-4 py-3 font-semibold">Approve</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white text-sm dark:divide-gray-800 dark:bg-gray-900">
                    {jobs.length > 0 ? (
                      jobs.map((job) => (
                        <tr
                          key={job.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {job.company?.logoSecureUrl ? (
                                <img
                                  src={job.company.logoSecureUrl}
                                  alt={job.company.name}
                                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                                />
                              ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
                                  N/A
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {job.company?.name || "N/A"}
                                </p>
                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                  #{job.id.slice(0, 8)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="max-w-xs">
                              <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                                {job.title}
                              </p>
                              {job.address && (
                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                  {job.address}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:ring-indigo-900/40">
                              {job.job_category?.name || "N/A"}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                              {job.deadline
                                ? new Date(job.deadline).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            {getStatusBadge(job.status, job.deadline)}
                          </td>

                          <td className="px-4 py-4">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {formatSalary(job)}
                            </span>
                            {job.salary_type?.name && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {job.salary_type.name}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <Switch
                              checked={switchStates[job.id] || false}
                              onChange={(checked) =>
                                handleSwitchChange(checked, job.id)
                              }
                              aria-label={`Approve ${job.title}`}
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm ring-1 ring-gray-900/10 transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                                onClick={() => handleEdit(job.id)}
                              >
                                Edit
                              </button>
                              <button
                                className="inline-flex items-center rounded-xl bg-rose-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm ring-1 ring-rose-600/10 transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
                                onClick={() => handleDelete(job.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          No jobs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards (ek görsel iyileştirme) */}
              <div className="grid gap-3 p-4 sm:hidden">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-xl border border-gray-200 p-4 shadow-sm ring-1 ring-gray-100 dark:border-gray-800 dark:ring-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        {job.company?.logoSecureUrl ? (
                          <img
                            src={job.company.logoSecureUrl}
                            alt={job.company.name}
                            className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
                            N/A
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
                            {job.title}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {job.company?.name || "N/A"} •{" "}
                            {job.job_category?.name || "N/A"}
                          </p>
                        </div>
                        <div className="ml-auto">{getStatusBadge(job.status, job.deadline)}</div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg bg-gray-50 p-2 text-gray-700 ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Deadline
                          </div>
                          <div>
                            {job.deadline
                              ? new Date(job.deadline).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2 text-gray-700 ring-1 ring-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Salary
                          </div>
                          <div className="font-semibold">{formatSalary(job)}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <Switch
                          checked={switchStates[job.id] || false}
                          onChange={(checked) =>
                            handleSwitchChange(checked, job.id)
                          }
                          aria-label={`Approve ${job.title}`}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm ring-1 ring-gray-900/10 transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                            onClick={() => handleEdit(job.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="inline-flex items-center rounded-xl bg-rose-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm ring-1 ring-rose-600/10 transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
                            onClick={() => handleDelete(job.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    No jobs found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
