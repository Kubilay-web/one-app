"use client";

import Link from "next/link";
import { useSession } from "@/app/SessionProvider";
import { logout } from "@/app/(components)/(authentication-layout)/authentication/actions";
import { useQueryClient } from "@tanstack/react-query";

export default function TopNav() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Links */}
          <div className="flex space-x-4">
            <Link href="/" className="text-gray-700 hover:text-green-500 font-medium">
              Home
            </Link>
            <Link href="/job-portal/companies" className="text-gray-700 hover:text-green-500 font-medium">
              Companies
            </Link>
            <Link href="/job-portal/candidates" className="text-gray-700 hover:text-green-500 font-medium">
              Candidates
            </Link>
            <Link href="/job-portal/jobs" className="text-gray-700 hover:text-green-500 font-medium">
              Search Jobs
            </Link>
            <Link href="/job-portal/pricing" className="text-gray-700 hover:text-green-500 font-medium">
              Pricing
            </Link>
          </div>

          {/* Right User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.rolejob === "CANDIDATE" && (
                  <Link
                    href={`/dashboard/job/candidate`}
                    className="text-gray-700 hover:text-green-500 font-medium"
                  >
                    {user.username} ({user.rolejob})
                  </Link>
                )}
                {user.rolejob === "ADMIN" && (
                  <Link
                    href={`/dashboards/jobs/admin`}
                    className="text-gray-700 hover:text-green-500 font-medium"
                  >
                    {user.username} ({user.rolejob})
                  </Link>
                )}
                {user.rolejob === "COMPANY" && (
                  <Link
                    href={`/dashboard/job/company`}
                    className="text-gray-700 hover:text-green-500 font-medium"
                  >
                    {user.username} ({user.rolejob})
                  </Link>
                )}

                <button
                  onClick={() => {
                    queryClient.clear();
                    logout();
                  }}
                  className="text-gray-700 hover:text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-green-500 font-medium">
                  Login
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-green-500 font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
