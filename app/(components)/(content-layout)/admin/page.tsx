
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Category {
  id: string;
  title: string;
}

interface Project {
  id: string;
  name: string;
}

interface Summary {
  usersCount: number;
  categoriesCount: number;
  projectsCount: number;
  modulesCount: number;
  tasksCount: number;
  membersCount: number;
  commentsCount: number;
  invoicesCount: number;
  paymentsCount: number;
  portfolioItemsCount: number;
  portfolioProfilesCount: number;
  foldersCount: number;
  filesCount: number;
  subscribersCount: number;
  guestProjectsCount: number;
}

interface SeedResult {
  success: boolean;
  message: string;
  data?: {
    summary: Summary;
    users: User[];
    categories: Category[];
    projects: Project[];
  };
  error?: string;
}

export default function SeedProjectPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUsers, setShowUsers] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/seed/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Seed process failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                📊 Project Management Seed
              </h1>
              <p className="text-gray-600">
                Generate complete project management data including projects, tasks, members, invoices, and portfolio items
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">ℹ️ What will be created?</h3>
                <ul className="text-blue-700 space-y-1">
                  <li>• 5 users (project managers and team members)</li>
                  <li>• 5 project categories</li>
                  <li>• 5 projects with complete details</li>
                  <li>• 15+ modules and 30+ tasks</li>
                  <li>• Project members, comments, and invoices</li>
                  <li>• Portfolio items and profiles</li>
                  <li>• Folders, files, and subscribers</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Project Data</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Click the button below to generate complete project management data for testing.
            </p>
            <button
              onClick={handleSeed}
              disabled={loading}
              className={`
                relative px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200
                ${loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white hover:shadow-xl transform hover:scale-105"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Project Data...
                </span>
              ) : (
                "📊 Generate Project Management Seed Data"
              )}
            </button>
          </div>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="animate-ping absolute inset-0 h-20 w-20 rounded-full bg-blue-400 opacity-20"></div>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
              </div>
              <p className="mt-6 text-gray-700 font-medium text-lg">
                Creating projects and tasks...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This may take 30-60 seconds
              </p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-3">
              <svg className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Occurred</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {result && result.success && result.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <svg className="h-8 w-8 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Seed Process Successful!</h2>
                  <p className="text-green-700">{result.message}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Generated Data Statistics</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <StatCard title="Users" value={result.data.summary.usersCount} color="purple" />
                  <StatCard title="Categories" value={result.data.summary.categoriesCount} color="indigo" />
                  <StatCard title="Projects" value={result.data.summary.projectsCount} color="blue" />
                  <StatCard title="Modules" value={result.data.summary.modulesCount} color="cyan" />
                  <StatCard title="Tasks" value={result.data.summary.tasksCount} color="green" />
                  <StatCard title="Members" value={result.data.summary.membersCount} color="orange" />
                  <StatCard title="Comments" value={result.data.summary.commentsCount} color="yellow" />
                  <StatCard title="Invoices" value={result.data.summary.invoicesCount} color="red" />
                  <StatCard title="Payments" value={result.data.summary.paymentsCount} color="pink" />
                  <StatCard title="Portfolio Items" value={result.data.summary.portfolioItemsCount} color="teal" />
                  <StatCard title="Folders" value={result.data.summary.foldersCount} color="emerald" />
                  <StatCard title="Files" value={result.data.summary.filesCount} color="amber" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Test Login Credentials
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.data.users.map((user, idx) => (
                    <div key={user.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500 font-mono mt-1">Password: Project{idx + 1}123!</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => setShowUsers(!showUsers)}
                className="w-full border-b border-gray-200 bg-gray-50 px-6 py-4 text-left hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">👥 Users Created ({result.data.users.length})</h3>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${showUsers ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {showUsers && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.data.users.map((user) => (
                      <div key={user.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => setShowProjects(!showProjects)}
                className="w-full border-b border-gray-200 bg-gray-50 px-6 py-4 text-left hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">📋 Projects Created ({result.data.projects.length})</h3>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${showProjects ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {showProjects && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.data.projects.map((project) => (
                      <div key={project.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="font-medium text-gray-900">{project.name}</div>
                        <div className="text-xs text-gray-500 font-mono">ID: {project.id}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What Was Created
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">✓ 5 users with project roles</li>
                <li className="flex items-center gap-2">✓ 5 project categories</li>
                <li className="flex items-center gap-2">✓ 5 complete projects</li>
                <li className="flex items-center gap-2">✓ 15+ modules with tasks</li>
                <li className="flex items-center gap-2">✓ Project members and comments</li>
                <li className="flex items-center gap-2">✓ Invoices and payments</li>
                <li className="flex items-center gap-2">✓ Portfolio items and profiles</li>
                <li className="flex items-center gap-2">✓ Folders and files structure</li>
                <li className="flex items-center gap-2">✓ Subscribers and guest projects</li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colorClasses = {
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    red: "bg-red-50 text-red-700 border-red-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  }[color];

  return (
    <div className={`rounded-lg p-3 text-center border ${colorClasses}`}>
      <p className="text-xs font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}