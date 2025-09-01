"use client";
import { useState, useEffect } from "react";
import General from "./general";

export default function PaymentSettings() {
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  const tabs = [
    { id: "general", label: "General Settings" },
    // { id: "stripe", label: "Stripe" },
    // { id: "razorpay", label: "Razorpay" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      <h2 className="text-2xl font-semibold text-center mb-8">Site Settings</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4 flex md:flex-col space-x-4 md:space-x-0 md:space-y-3 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 md:px-3 md:py-2 rounded-lg font-medium text-left transition-colors 
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:w-3/4 bg-gray-50 p-6 rounded-lg shadow-inner">
          {activeTab === "general" && <General />}
          {/* {activeTab === "stripe" && (
            <div className="text-center text-gray-700 text-lg font-medium">
              Stripe Settings Placeholder
            </div>
          )}
          {activeTab === "razorpay" && (
            <div className="text-center text-gray-700 text-lg font-medium">
              Razorpay Settings Placeholder
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
