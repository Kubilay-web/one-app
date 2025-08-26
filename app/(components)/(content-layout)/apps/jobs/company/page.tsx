"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  slug: string;
  logoSecureUrl: string;
  bannerSecureUrl: string;
  city?: { name: string };
  country?: { name: string };
  industryType?: { name: string };
  teamType?: { name: string };
  isProfileVerified: boolean;
  totalViews: number;
}

export default function Page() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company`);
        if (!res.ok) throw new Error("Failed to fetch companies");
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Companies
      </h1>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden flex flex-col"
            >
              {/* Banner */}
              {/* <div className="relative w-full h-32">
                <Image
                  src={
                    company.bannerSecureUrl ||
                    "/assets/images/company-banners/default-banner.png"
                  }
                  alt={company.name}
                  fill
                  className="object-cover"
                />
              </div> */}

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="w-16 h-16 relative flex-shrink-0 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                    <Image
                      src={
                        company.logoSecureUrl ||
                        "/assets/images/company-logos/default-company.png"
                      }
                      alt={company.name}
                      fill
                      className="object-cover h-12"
                    />
                  </div>

                  <div className="flex flex-col">
                    <Link
                      href={`/company/${company.slug}`}
                      className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {company.name}
                      {company.isProfileVerified && (
                        <span
                          title="Verified Company"
                          className="ml-1 text-green-500"
                        >
                          ✔
                        </span>
                      )}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {company.city?.name || "Unknown city"},{" "}
                      {company.country?.name || "Unknown country"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-full">
                    {company.industryType?.name || "N/A"}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {company.teamType?.name || "Team size N/A"}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    Views: {company.totalViews || 0}
                  </span>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <Link
                  href={`/apps/jobs/company/${company.slug}`}
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
