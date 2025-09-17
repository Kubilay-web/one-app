"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Candidate = {
  id: string;
  full_name?: string;
  title?: string;
  slug?: string;
  image_secure_url?: string;
  city?: { name: string };
  state?: { name: string };
  country?: { name: string };
  createdAt: string;
};

export default function CandidatePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/candidate`);
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading candidates...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  if (candidates.length === 0)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">No candidates found</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">All Candidates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((c) => (
          <Link
            key={c.id}
            href={`/apps/jobs/candidate-details/${c.slug}`}
            className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            {c.image_secure_url && (
              <img
                src={c.image_secure_url}
                alt={c.full_name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-5">
              <h2 className="text-xl font-semibold">{c.full_name || "No Name"}</h2>
              {c.title && <p className="text-gray-600 text-sm">{c.title}</p>}
              <p className="mt-2 text-gray-400 text-xs">
                {c.city?.name}, {c.state?.name}, {c.country?.name}
              </p>
              <p className="mt-3 text-gray-400 text-xs">
                Joined: {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
