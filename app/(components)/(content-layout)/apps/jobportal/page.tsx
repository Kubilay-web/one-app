import React from "react";
import JobFilterSidebar from "./components/JobFilterSidebar";
import JobResults from "./components/JobResults";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


interface PageProps {
  searchParams: {
    q?: string;
    category?: string;
    role?: string;
    type?: string;
    location?: string;
  };
}

// Define JobFilterValues interface
interface JobFilterValues {
  q?: string;
  category?: string;
  role?: string;
  type?: string;
  location?: string;
}

// Fix the getTitle function to correctly construct the page title
function getTitle({ q, type, location }: JobFilterValues): string {
  const titlePrefix = q ? `${q} jobs` : type ? `${type} developer jobs` : "All developer jobs";
  
  // Correctly close the ternary operation for titleSuffix
  const titleSuffix = location ? ` in ${location}` : "";

  return `${titlePrefix}${titleSuffix}`;
}

export default function Page({ searchParams }: PageProps) {
  const { q, category, role, type, location } = searchParams;

  const filterValues = {
    q,
    category,
    role,
    type,
    location,
  };

  return (
    <main className="max-w-5xl min-w-[350px] m-auto px-3 my-10 space-y-10">
      <Navbar />
      <div className="space-y-5 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {getTitle(filterValues)}
        </h1>
        <p className="text-textmuted">Find your dream job.</p>
      </div>
      <section className="flex flex-col md:flex-row gap-4">
        <JobFilterSidebar filterValues={filterValues} />
        <JobResults filterValues={filterValues} />
      </section>
      <Footer />
    </main>
  );
}
