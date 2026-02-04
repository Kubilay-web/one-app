import React from "react";
import SectionHeading from "./global/SectionHeading";
import FeaturesCard from "./FeaturesCard";

export default function ComparisonFeatures() {
  const pros = [
    "Centralized project information and communication",
    "Real-time collaboration and updates",
    "Automated invoicing and payment tracking",
    "Organized file management system",
    "Professional portfolio generation",
    "Time-saving project templates",
    "Improved client relationship management",
    "Enhanced team productivity",
    "Better project visibility and control",
    "Secure data storage and backup",
  ];

  const cons = [
    "Scattered information across emails and documents",
    "Time-consuming manual invoice creation",
    "Difficulty tracking project progress",
    "Inconsistent client communication",
    "Risk of lost or misplaced files",
    "No centralized client history",
    "Limited collaboration capabilities",
    "Time wasted on repetitive tasks",
    "Lack of professional portfolio showcase",
    "Security risks with local file storage",
  ];
  return (
    <div className="text-center ">
      <div className="pb-6">
        <SectionHeading title="Tired of managing Projects and Clients Manually" />
      </div>
      <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FeaturesCard
          features={cons}
          title="Project Management without Our System"
          className="bg-red-50 text-red-800"
        />
        <FeaturesCard
          features={pros}
          title="Project Management without Project Pro"
          className="bg-green-50 text-green-800"
        />
      </div>
    </div>
  );
}
