"use client";

import { FaBriefcase, FaDesktop, FaBuilding, FaChalkboardTeacher, FaMedkit, FaUserTie } from "react-icons/fa";

export default function PopularJobsSection() {
  const jobCategories = [
    { name: "Finance", icon: FaBriefcase },
    { name: "Technology", icon: FaDesktop },
    { name: "Construction", icon: FaBuilding },
    { name: "Education", icon: FaChalkboardTeacher },
    { name: "Healthcare", icon: FaMedkit },
    { name: "Business", icon: FaUserTie },
    { name: "Finance", icon: FaBriefcase },
    { name: "Technology", icon: FaDesktop },
    { name: "Construction", icon: FaBuilding },
    { name: "Education", icon: FaChalkboardTeacher },
    { name: "Healthcare", icon: FaMedkit },
    { name: "Business", icon: FaUserTie },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 tracking-wide drop-shadow-sm">
        Popular Job Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {jobCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="text-green-600 text-3xl mb-3">
                <IconComponent />
              </div>
              <h6 className="text-gray-800 font-semibold text-sm mb-1 text-center">
                12 jobs available
              </h6>
              <span className="text-gray-600 text-center font-medium">{category.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
