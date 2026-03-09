import React from "react";
import {
  ArrowRight,
  FileText,
  Download,
  Zap,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:64px_64px] opacity-20"></div>

        {/* Animated gradient circles */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full filter blur-[100px] opacity-40 animate-float"></div>
        <div className="absolute bottom-1/3 -left-20 w-80 h-80 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full filter blur-[90px] opacity-40 animate-float-delay"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 ">
        <div className="text-center max-w-5xl mx-auto">
          {/* Premium Badge with Animation */}
          <div className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300 group">
            <Sparkles className="w-4 h-4 mr-2 text-blue-500 group-hover:animate-spin" />
            <span>Trusted by 10,000+ Businesses</span>
            <BadgeCheck className="w-4 h-4 ml-2 text-indigo-500" />
          </div>

          {/* Powerful Headline with Gradient */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Stunning Invoices
            </span>
            <br />
            <span className="inline-block mt-2">That Get You Paid Faster</span>
          </h1>

          {/* Compelling Subheading */}
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Create professional invoices in seconds, automate your billing
            process, and get paid up to{" "}
            <span className="font-semibold text-emerald-600">40% faster</span>
            with our all-in-one invoicing solution.
          </p>

          {/* Feature Highlights with Icons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { text: "No watermarks", icon: CheckCircle },
              { text: "Unlimited clients", icon: Users },
              { text: "Custom branding", icon: FileText },
              { text: "Auto reminders", icon: Zap },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-2.5 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200 text-base font-medium text-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <feature.icon className="w-5 h-5 mr-2 text-blue-500" />
                {feature.text}
              </div>
            ))}
          </div>

          {/* Strong CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              href="/invoice/dashboard"
              className="relative inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>

            <Link
              href="/invoice/pricing"
              className="relative inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-slate-800 font-semibold border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <span className="relative z-10 flex items-center">
                View Pricing
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Social Proof & Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Clock,
                value: "30s",
                label: "Average Invoice Creation",
                description: "From blank page to client-ready",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-100",
              },
              {
                icon: DollarSign,
                value: "40% Faster",
                label: "Payments Received",
                description: "Compared to basic invoices",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-100",
              },
              {
                icon: Users,
                value: "10K+",
                label: "Businesses Trust Us",
                description: "From freelancers to agencies",
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                border: "border-indigo-100",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl bg-white/80 backdrop-blur-sm border ${stat.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 mx-auto`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-lg text-slate-700 font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-500">{stat.description}</div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
