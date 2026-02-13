"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  User, 
  Phone, 
  Globe, 
  CalendarCheck, 
  ShieldCheck,
  Stethoscope,
  Loader2 
} from "lucide-react";

export default function MedicalRegisterPage() {
  const params = useSearchParams();
  const router = useRouter();

  const rolemedical = params.get("rolemedical");
  const plan = params.get("plan");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
  });



  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleRegisterDoctor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/onemedical/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rolemedical,
        plan,
        ...formData
      }),
    });

    const data = await res.json();

    if (res.ok) {
      // router.push(`/medical/verify-account/${data.userId}`);

       router.push(`/medical/onboarding`);
    } else {
      alert(data.error || "Registration failed.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Side - Information Panel */}
        <div className="md:w-2/5 bg-gradient-to-b from-blue-600 to-cyan-700 text-white p-8 md:p-10 flex flex-col justify-between">
          <div>

            
            <h2 className="text-3xl font-bold mb-6">Join Our Medical Network</h2>
            <p className="text-blue-100 mb-8">
              Register as a healthcare professional and connect with patients worldwide. 
              Our platform provides secure, efficient tools for modern medical practice.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg mt-1">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">HIPAA Compliant</h3>
                  <p className="text-blue-100 text-sm">Fully secure and compliant with healthcare regulations</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/20 rounded-lg mt-1">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Smart Scheduling</h3>
                  <p className="text-blue-100 text-sm">Intelligent appointment management system</p>
                </div>
              </div>
            </div>
          </div>
     
        </div>

        {/* Right Side - Registration Form */}
        <div className="md:w-3/5 bg-white p-8 md:p-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full text-sm font-semibold mb-4">
              <span>Plan: {plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Professional"}</span>
              <span className="h-1 w-1 bg-cyan-500 rounded-full"></span>
              <span>Role: {rolemedical ? rolemedical.charAt(0).toUpperCase() + rolemedical.slice(1) : "Doctor"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Complete Your Registration</h2>
            <p className="text-gray-600 mt-2">Please provide your professional information</p>
          </div>

          <form onSubmit={handleRegisterDoctor}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstName">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                    className="pl-10 w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    required
                    className="pl-10 w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

   

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="pl-10 w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
                  Country
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="United States"
                    className="pl-10 w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="mb-8">
      

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Registration...
                  </>
                ) : (
                  <>
                    <Stethoscope className="h-5 w-5" />
                    Complete Registration
                  </>
                )}
              </button>
            </div>


          </form>
        </div>
      </div>
    </div>
  );
}