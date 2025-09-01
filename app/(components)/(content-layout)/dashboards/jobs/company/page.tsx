"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/app/SessionProvider";

export default function Company() {
  const [profileComplete, setProfileComplete] = useState(false);
  const [pendingjob, setPendingJob] = useState("");
  const [order, setOrder] = useState("");
  const { user } = useSession();

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  const checkProfileCompletion = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/company/dash`,
      );

      const data = await response.json();

      if (response.ok) {
        setProfileComplete(data.profileComplete);
        setPendingJob(data.pendingjob);
        setOrder(data?.orders);
        console.log("x", data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-2xl font-semibold text-gray-800">
            Company Dashboard
          </p>
          <hr className="my-4 border-gray-300" />
          {profileComplete ? (
            <p className="text-lg text-green-600">
              ✅ Profile is complete, <span className="font-bold">{user?.username}</span>
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-lg text-red-600">
                ⚠️ Please complete your profile,{" "}
                <span className="font-bold">{user?.username}</span>
              </p>
              <Link
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                href="/dashboard/job/company/profile"
              >
                Edit Profile
              </Link>
            </div>
          )}
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Jobs */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h5 className="text-xl font-semibold text-gray-700 mb-2">
              Pending Jobs
            </h5>
            <p className="text-gray-600 text-lg">{pendingjob}</p>
          </div>

          {/* Orders */}
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h5 className="text-xl font-semibold text-gray-700 mb-2">
              Total Orders
            </h5>
            <p className="text-gray-600 text-lg">{order}</p>
          </div>
        </div>
      </div>
    </>
  );
}
