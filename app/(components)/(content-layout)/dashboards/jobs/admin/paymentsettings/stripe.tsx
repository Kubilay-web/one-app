"use client";
import { useEffect, useState } from "react";
import { useCountryStore } from "@/app/job-portal-store/country";
import toast from "react-hot-toast";

const currencies = [
  "USD","EUR","GBP","JPY","AUD","CAD","CHF","CNY","SEK","NZD","NOK",
  "KRW","MXN","SGD","HKD","INR","RUB","ZAR","BRL","TRY","TWD","DKK",
  "PLN","THB","IDR","HUF","CZK","ILS","CLP","PHP","AED","COP","SAR",
  "MYR","RON","VND","ARS","IQD","KWD","NGN","UAH","EGP","PKR","OMR",
  "QAR","KES","BDT","MAD","VUV","SCR","UZS","LKR","JOD","GTQ","BOB",
  "HRK","DZD","TND","UYU","PYG","NPR","AFN","GEL","MNT","ETB","LBP",
  "BHD","JMD","CUC","LYD","TTD","XAF","XOF","NAD","BND","SZL","GIP",
  "BWP","FJD","DJF","CVE","BSD","GYD","YER","HTG","BIF","SYP","MVR",
  "MKD","RSD"
];

export default function Stripe() {
  const [stripecountryid, setStripeCountryid] = useState("");
  const [stripeStatus, setStripeStatus] = useState("");
  const [stripeCurrencyRate, setStripeCurrencyRate] = useState("");
  const [stripeCurrencyName, setStripeCurrencyName] = useState("");
  const [stripeKeyId, setStripeKeyId] = useState("");
  const [stripeKeySecret, setStripeKeySecret] = useState("");

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
        setStripeStatus(data?.settings?.stripeStatus || "");
        setStripeCurrencyRate(data?.settings?.stripeCurrencyRate || "");
        setStripeCurrencyName(data?.settings?.stripeCurrencyName || "");
        setStripeKeyId(data?.settings?.stripeKeyId || "");
        setStripeKeySecret(data?.settings?.stripeKeySecret || "");
        setStripeCountryid(data?.settings?.stripecountryid || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = {
      stripeStatus,
      stripeCurrencyName,
      stripeCurrencyRate,
      stripeKeyId,
      stripeKeySecret,
      stripecountryid,
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
        setStripeStatus("");
        setStripeCurrencyName("");
        setStripeCurrencyRate("");
        setStripeKeyId("");
        setStripeKeySecret("");
        setStripeCountryid("");
      } else {
        toast.error("Failed to submit form.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h4 className="text-xl font-semibold mb-6">Stripe Settings</h4>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Status</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              value={stripeStatus}
              onChange={(e) => setStripeStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Country</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              value={stripecountryid}
              onChange={(e) => setStripeCountryid(e.target.value)}
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
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              value={stripeCurrencyName}
              onChange={(e) => setStripeCurrencyName(e.target.value)}
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
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              value={stripeCurrencyRate}
              onChange={(e) => setStripeCurrencyRate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Stripe Key ID</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              value={stripeKeyId}
              onChange={(e) => setStripeKeyId(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Stripe Key Secret</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              value={stripeKeySecret}
              onChange={(e) => setStripeKeySecret(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
