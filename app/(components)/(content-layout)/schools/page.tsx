// app/admin/fix-school-names/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FixedUser {
  email: string;
  role: string;
  oldSchoolId: string | null;
  oldSchoolName: string | null;
  newSchoolId: string;
  newSchoolName: string;
}

interface Summary {
  targetSchool: {
    id: string;
    name: string;
  };
  totalUsersFound: number;
  updatedUsers: number;
  skippedUsers: number;
  updatedStudents: number;
  updatedTeachers: number;
  updatedParents: number;
  errors: number;
}

interface FixResult {
  success: boolean;
  message: string;
  data?: {
    targetSchool: Summary['targetSchool'];
    summary: Summary;
    errors: Array<{ email: string; role: string; error: string; currentSchoolName: string | null }>;
    fixedUsers: FixedUser[];
  };
  error?: string;
}

export default function FixSchoolNamesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FixResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleFix = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/schoolid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Fix process failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                🏫 Fix School Names & IDs
              </h1>
              <p className="text-gray-600">
                Fix all users to use Istanbul International School (cmngrd5qg00gzl8lkv3y59xzt)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">ℹ️ Target School Information</h3>
                <div className="space-y-1 text-emerald-700">
                  <p><strong>School Name:</strong> Istanbul International School</p>
                  <p><strong>School ID:</strong> <code className="bg-emerald-100 px-2 py-1 rounded">cmngrd5qg00gzl8lkv3y59xzt</code></p>
                </div>
                <p className="text-emerald-700 mt-3">
                  This script will find all users with inconsistent or missing school information and fix them to use 
                  the <strong>Istanbul International School</strong>. It will update both the User table and the corresponding 
                  Student/Teacher/Parent profiles.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Fix All School Inconsistencies</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Click the button below to fix all users to use <strong>Istanbul International School</strong>.
            </p>
            <button
              onClick={handleFix}
              disabled={loading}
              className={`
                relative px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200
                ${loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:shadow-xl transform hover:scale-105"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fixing School Data...
                </span>
              ) : (
                "🏫 Fix to Istanbul International School"
              )}
            </button>
          </div>
        </motion.div>

        {/* Loading Animation */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="animate-ping absolute inset-0 h-20 w-20 rounded-full bg-emerald-400 opacity-20"></div>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-emerald-600"></div>
              </div>
              <p className="mt-6 text-gray-700 font-medium text-lg">
                Fixing school data...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please wait while we fix all users to use Istanbul International School
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
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

        {/* Success Result */}
        {result && result.success && result.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <svg className="h-8 w-8 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Fix Successful!</h2>
                  <p className="text-green-700">{result.message}</p>
                </div>
              </div>
            </div>

            {/* Target School Info */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">🏫 Target School</h3>
              </div>
              <div className="p-6">
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="font-bold text-lg text-emerald-900">{result.data.targetSchool.name}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">ID: {result.data.targetSchool.id}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Fix Statistics</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard
                    title="Users Found with Issues"
                    value={result.data.summary.totalUsersFound}
                    color="blue"
                  />
                  <StatCard
                    title="Users Updated"
                    value={result.data.summary.updatedUsers}
                    color="green"
                  />
                  <StatCard
                    title="Users Skipped (Already Correct)"
                    value={result.data.summary.skippedUsers}
                    color="yellow"
                  />
                </div>
                
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard
                    title="Students Updated"
                    value={result.data.summary.updatedStudents}
                    color="purple"
                  />
                  <StatCard
                    title="Teachers Updated"
                    value={result.data.summary.updatedTeachers}
                    color="orange"
                  />
                  <StatCard
                    title="Parents Updated"
                    value={result.data.summary.updatedParents}
                    color="teal"
                  />
                </div>

                {result.data.summary.errors > 0 && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">
                      ⚠️ {result.data.summary.errors} error(s) occurred during the process
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Users Details */}
            {result.data.fixedUsers.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full border-b border-gray-200 bg-gray-50 px-6 py-4 text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      📋 Fixed Users ({result.data.fixedUsers.length})
                    </h3>
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {showDetails && (
                  <div className="p-6">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {result.data.fixedUsers.map((user, idx) => (
                        <div key={idx} className="text-sm p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-900">{user.email}</div>
                          <div className="text-xs text-gray-500 mt-1">Role: {user.role}</div>
                          <div className="text-xs mt-1">
                            <span className="text-red-600">Old: {user.oldSchoolName || 'null'}</span>
                            {' → '}
                            <span className="text-green-600">New: {user.newSchoolName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Errors List */}
            {result.data.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
                <div className="border-b border-red-200 bg-red-100 px-6 py-4">
                  <h3 className="text-lg font-semibold text-red-800">Errors Encountered</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {result.data.errors.map((err, idx) => (
                      <div key={idx} className="text-sm text-red-700 p-2 bg-red-100 rounded">
                        <div><strong>{err.email}</strong> ({err.role})</div>
                        <div className="text-xs mt-1">Old school: {err.currentSchoolName || 'null'}</div>
                        <div className="text-xs">Error: {err.error}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
  }[color];

  return (
    <div className={`rounded-lg p-4 border ${colorClasses}`}>
      <p className="text-sm font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}