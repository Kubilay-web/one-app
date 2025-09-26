"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Admin() {
  const [companyCount, setCompanyCount] = useState(0);
  const [pendingJobCount, setPendingJobCount] = useState(0);
  const [activeJobCount, setActiveJobCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [appliedJobCount, setAppliedJobCount] = useState(0);
  const [jobBookmarkCount, setJobBookmarkCount] = useState(0);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/details`
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      }

      setCompanyCount(data.companycount || 0);
      setPendingJobCount(data.pendingjobcount || 0);
      setActiveJobCount(data.activejobcount || 0);
      setOrdersCount(data.orderscount || 0);
      setAppliedJobCount(data.appliedJob || 0);
      setJobBookmarkCount(data.jobBookmark || 0);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <hr className="border-2 border-blue-500 w-1/2 mx-auto mb-2" />
        <h2 className="text-2xl font-bold bg-blue-500 text-white py-2 rounded">
          Admin Dashboard
        </h2>
        <hr className="border-2 border-blue-500 w-1/2 mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Template */}
        {[
          { title: "Company Count", value: companyCount },
          { title: "Pending Job Count", value: pendingJobCount },
          { title: "Active Job Count", value: activeJobCount },
          { title: "Orders Count", value: ordersCount },
          { title: "Applied Job Count", value: appliedJobCount },
          { title: "Job Bookmark Count", value: jobBookmarkCount },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {card.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}

        {/* Extra Info Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-blue-500 text-white rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-2">YOU CAN ADD MORE INFORMATION</h3>
          <p className="text-sm">Additional information can be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
