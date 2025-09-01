"use client";

import { useState, useEffect } from "react";
import { useCountryStore } from "@/app/job-portal-store/country";
import toast from "react-hot-toast";

const currencies = [
  "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD",
  "NOK", "KRW", "MXN", "SGD", "HKD", "INR", "RUB", "ZAR", "BRL", "TRY",
  "TWD", "DKK", "PLN", "THB", "IDR", "HUF", "CZK", "ILS", "CLP", "PHP",
  "AED", "COP", "SAR", "MYR", "RON", "VND", "ARS", "IQD", "KWD", "NGN",
  "UAH", "EGP", "PKR", "OMR", "QAR", "KES", "BDT", "MAD", "VUV", "SCR",
  "UZS", "LKR", "JOD", "GTQ", "BOB", "HRK", "DZD", "TND", "UYU", "PYG",
  "NPR", "AFN", "GEL", "MNT", "ETB", "LBP", "BHD", "JMD", "CUC", "LYD",
  "TTD", "XAF", "XOF", "NAD", "BND", "SZL", "GIP", "BWP", "FJD", "DJF",
  "CVE", "BSD", "GYD", "YER", "HTG", "BIF", "SYP", "MVR", "MKD", "RSD",
];

export default function Paypal() {
  const [paypalStatus, setPaypalStatus] = useState("");
  const [paypalMode, setPaypalMode] = useState("");
  const [paypalCurrencyName, setPaypalCurrencyName] = useState("");
  const [paypalCurrencyRate, setPaypalCurrencyRate] = useState("");
  const [clientId, setClientId] = useState("");
  const [appId, setAppId] = useState("");
  const [countryid, setCountryid] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const { fetchCountriesPublic, countries } = useCountryStore();

  useEffect(() => {
    fetchCountriesPublic();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/paymentsettings`
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
      } else {
        setPaypalStatus(data?.settings?.paypalStatus || "");
        setPaypalMode(data?.settings?.paypalMode || "");
        setPaypalCurrencyName(data?.settings?.paypalCurrencyName || "");
        setPaypalCurrencyRate(data?.settings?.paypalCurrencyRate || "");
        setClientId(data?.settings?.clientId || "");
        setSecretKey(data?.settings?.secretKey || "");
        setAppId(data?.settings?.appId || "");
        setCountryid(data?.settings?.countryid || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = {
      paypalStatus,
      paypalMode,
      paypalCurrencyName,
      paypalCurrencyRate,
      clientId,
      secretKey,
      appId,
      countryid,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/paymentsettings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Form submitted successfully!");
      } else {
        toast.error("Failed to submit form.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h4 className="text-xl font-semibold mb-6">PayPal Settings</h4>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
              value={paypalStatus}
              onChange={(e) => setPaypalStatus(e.target.value)}
            >
              <option value="">Select status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Mode</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
              value={paypalMode}
              onChange={(e) => setPaypalMode(e.target.value)}
            >
              <option value="">Select mode</option>
              <option value="sandbox">Sandbox</option>
              <option value="live">Live</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Country</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
              value={countryid}
              onChange={(e) => setCountryid(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Currency</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
              value={paypalCurrencyName}
              onChange={(e) => setPaypalCurrencyName(e.target.value)}
            >
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Currency Rate</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
              value={paypalCurrencyRate}
              onChange={(e) => setPaypalCurrencyRate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Client ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Secret Key</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">App ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
