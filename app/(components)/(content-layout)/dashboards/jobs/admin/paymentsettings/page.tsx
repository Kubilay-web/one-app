"use client";
import { useState, useEffect } from "react";
import Paypal from "./paypal";
import Stripe from "./stripe";
import Razorpay from "./razorpay";

export default function PaymentSettings() {
  const [activeTab, setActiveTab] = useState("paypal");

  useEffect(() => {
    const savedActiveTab = localStorage.getItem("activeTab");
    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    localStorage.setItem("activeTab", tabId);
  };

  const tabs = [
    { id: "paypal", label: "Paypal Account" },
    { id: "stripe", label: "Stripe Account" },
    { id: "razorpay", label: "Razorpay Account" },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Payment Settings</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4 flex md:flex-col gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-full text-left px-4 py-2 rounded-md font-medium border transition ${
                  activeTab === tab.id
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="md:w-3/4">
            {activeTab === "paypal" && <Paypal />}
            {activeTab === "stripe" && <Stripe />}
            {activeTab === "razorpay" && <Razorpay />}
          </div>
        </div>
      </div>
    </div>
  );
}
