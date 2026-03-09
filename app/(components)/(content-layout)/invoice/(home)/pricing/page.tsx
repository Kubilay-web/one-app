"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Shield,
  FileText,
  Download,
  Clock,
  Users,
  DollarSign,
  Zap,
  Star,
  Infinity as Unlimited,
} from "lucide-react";
import {
  useSubscription,
  pricingOptions,
  PricingTier,
  MONTHLY_PRICE,
  YEARLY_PRICE,
} from "../../stores/subscription-store";




const PricingPage: React.FC = () => {
  const router = useRouter();
  const { setSelectedPlan } = useSubscription();
  const [selectedTier, setSelectedTier] = useState<
    "free" | "monthly" | "yearly"
  >("free");

  const handlePlanSelection = (planId: PricingTier) => {
    setSelectedPlan(planId);
    if (planId === "free") {
      router.push("/invoice/dashboard");
    } else {
      router.push("/invoice/checkout");
    }
  };

  const features = [
    {
      name: "Invoices per day",
      free: "2",
      monthly: <Unlimited className="w-5 h-5 inline" />,
      yearly: <Unlimited className="w-5 h-5 inline" />,
    },
    {
      name: "Custom branding",
      free: <Check className="w-5 h-5 text-green-500" />,
      monthly: <Check className="w-5 h-5 text-green-500" />,
      yearly: <Check className="w-5 h-5 text-green-500" />,
    },
    {
      name: "No watermark",
      free: <Check className="w-5 h-5 text-green-500" />,
      monthly: <Check className="w-5 h-5 text-green-500" />,
      yearly: <Check className="w-5 h-5 text-green-500" />,
    },
    {
      name: "Email sending",
      free: <Check className="w-5 h-5 text-green-500" />,
      monthly: <Check className="w-5 h-5 text-green-500" />,
      yearly: <Check className="w-5 h-5 text-green-500" />,
    },
    {
      name: "Client auto-creation",
      free: <Check className="w-5 h-5 text-green-500" />,
      monthly: <Check className="w-5 h-5 text-green-500" />,
      yearly: <Check className="w-5 h-5 text-green-500" />,
    },
    {
      name: "Professional templates",
      free: "5",
      monthly: "All",
      yearly: "All",
    },
    {
      name: "Priority support",
      free: <span className="text-gray-400">Basic</span>,
      monthly: <Check className="w-5 h-5 text-green-500" />,
      yearly: <Star className="w-5 h-5 text-yellow-500" />,
    },
    {
      name: "Team members",
      free: "1",
      monthly: "1",
      yearly: "Up to 5",
    },
    {
      name: "Advanced analytics",
      free: <span className="text-gray-400">✗</span>,
      monthly: <span className="text-gray-400">✗</span>,
      yearly: <Check className="w-5 h-5 text-green-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Pricing That Grows With You
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Start for free, upgrade when you need more. All plans include our
            full feature set with limits adjusted to your needs.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Tier */}
          <div
            className={`bg-white rounded-2xl shadow-lg border-2 ${
              selectedTier === "free" ? "border-blue-500" : "border-slate-200"
            } transition-all hover:shadow-xl`}
          >
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-slate-900">Free</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-lg opacity-90"> / forever</span>
              </div>
              <p className="text-slate-600 mb-6">Perfect for getting started</p>
              <button
                onClick={() => {
                  setSelectedTier("free");
                  handlePlanSelection("free");
                }}
                className={`w-full px-6 py-3 font-semibold rounded-xl border-2 transition-colors ${
                  selectedTier === "free"
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                }`}
              >
                Get Started
              </button>
            </div>
            <div className="p-8 border-t border-slate-200">
              <div className="space-y-4">
                {pricingOptions.free.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Tier */}
          <div
            className={`bg-white rounded-2xl shadow-lg border-2 ${
              selectedTier === "monthly"
                ? "border-blue-500"
                : "border-slate-200"
            } transition-all hover:shadow-xl`}
          >
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-slate-900">
                Monthly
              </h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">${MONTHLY_PRICE}</span>
                <span className="text-lg opacity-90"> / month</span>
              </div>
              <p className="text-slate-600 mb-6">For growing businesses</p>
              <button
                onClick={() => {
                  setSelectedTier("monthly");
                  handlePlanSelection("monthly");
                }}
                className={`w-full px-6 py-3 font-semibold rounded-xl border-2 transition-colors ${
                  selectedTier === "monthly"
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                }`}
              >
                Upgrade Now
              </button>
            </div>
            <div className="p-8 border-t border-slate-200">
              <div className="space-y-4">
                {pricingOptions.monthly.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Yearly Tier */}
          <div
            className={`bg-white rounded-2xl shadow-lg border-2 ${
              selectedTier === "yearly" ? "border-blue-500" : "border-slate-200"
            } transition-all hover:shadow-xl relative`}
          >
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              Save 33%
            </div>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-slate-900">Yearly</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">${YEARLY_PRICE}</span>
                <span className="text-lg opacity-90"> / year</span>
              </div>
              <p className="text-slate-600 mb-6">Best value for businesses</p>
              <button
                onClick={() => {
                  setSelectedTier("yearly");
                  handlePlanSelection("yearly");
                }}
                className={`w-full px-6 py-3 font-semibold rounded-xl border-2 transition-colors ${
                  selectedTier === "yearly"
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                }`}
              >
                Upgrade Now
              </button>
            </div>
            <div className="p-8 border-t border-slate-200">
              <div className="space-y-4">
                {pricingOptions.yearly.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Feature Comparison
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-6 text-left font-semibold text-slate-900">
                    Feature
                  </th>
                  <th className="p-6 text-center font-semibold text-slate-900">
                    Free
                  </th>
                  <th className="p-6 text-center font-semibold text-slate-900">
                    Monthly
                  </th>
                  <th className="p-6 text-center font-semibold text-slate-900">
                    Yearly
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}
                  >
                    <td className="p-6 font-medium text-slate-900">
                      {row.name}
                    </td>
                    <td className="p-6 text-center">{row.free}</td>
                    <td className="p-6 text-center">{row.monthly}</td>
                    <td className="p-6 text-center">{row.yearly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Benefits Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Everything You Need for Professional Invoicing
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "Create in Seconds",
                description:
                  "Generate professional invoices instantly with our intuitive interface",
                color: "blue",
              },
              {
                icon: FileText,
                title: "Professional Templates",
                description:
                  "Choose from beautiful, customizable templates for any industry",
                color: "purple",
              },
              {
                icon: Download,
                title: "Export & Share",
                description:
                  "Download as PDF or send directly via email to your clients",
                color: "green",
              },
              {
                icon: DollarSign,
                title: "Payment Tracking",
                description:
                  "Track payment status and send automated reminders",
                color: "amber",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-16 h-16 bg-${benefit.color}-50 rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <benefit.icon
                    className={`w-8 h-8 text-${benefit.color}-600`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "What's included in the free plan?",
                answer:
                  "The free plan includes 2 invoices per day with all features like custom branding, no watermarks, email sending, and client auto-creation. Perfect for testing the platform or very small businesses.",
              },
              {
                question: "Can I upgrade or downgrade anytime?",
                answer:
                  "Yes, you can change your plan at any time. Upgrades take effect immediately with prorated charges. Downgrades will apply at your next billing cycle.",
              },
              {
                question: "What happens if I exceed my free invoice limit?",
                answer:
                  "You'll be notified when approaching your daily limit. You can wait until the next day or upgrade to continue creating invoices immediately.",
              },
              {
                question: "Do you offer discounts for non-profits?",
                answer:
                  "Yes! We offer special pricing for registered non-profit organizations. Please contact our support team with your details.",
              },
              {
                question: "How secure is my data?",
                answer:
                  "We use enterprise-grade security including encryption at rest and in transit. Your data is backed up daily and never shared with third parties.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Ready to Streamline Your Invoicing?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses using our platform to save time and
            look professional.
          </p>
          <button
            onClick={() => handlePlanSelection("free")}
            className="px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
