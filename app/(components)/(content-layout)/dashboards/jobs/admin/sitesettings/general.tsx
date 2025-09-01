"use client";

import { useState, useEffect } from "react";
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
  "MKD","RSD",
];

const currencySymbols = [
  "$","€","£","¥","¥","$","$","Fr.","HK$","NZ$","₩","$","kr","kr","$",
  "₹","₽","R","R$","₺","NT$","kr","zł","฿","Rp","Ft","Kč","₪","$","₱",
  "د.إ","$","﷼","RM","lei","₫","$","₦","£","₨","ع.د","د.ك","﷼","₴",
  "BD","ر.ع.","Ksh","USh",
];

export default function Paypal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [default_currency, setDefault_currency] = useState("");
  const [currency_icon, setCurrency_icon] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/sitesettings`
      );
      const data = await response.json();

      if (!response.ok) toast.error(data.err);
      else {
        setName(data?.settings?.name || "");
        setEmail(data?.settings?.email || "");
        setPhone(data?.settings?.phone || "");
        setDefault_currency(data?.settings?.default_currency || "");
        setCurrency_icon(data?.settings?.currency_icon || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, email, phone, default_currency, currency_icon };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/sitesettings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Settings saved successfully!");
        fetchData();
      } else toast.error("Failed to save settings!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Site Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Site Name */}
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              id="siteName"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Site Email */}
          <div>
            <label htmlFor="siteEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Site Email
            </label>
            <input
              id="siteEmail"
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Site Phone */}
          <div>
            <label htmlFor="sitePhone" className="block text-sm font-medium text-gray-700 mb-1">
              Telephone
            </label>
            <input
              id="sitePhone"
              type="tel"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Currency Icon */}
          <div>
            <label htmlFor="currencyIcon" className="block text-sm font-medium text-gray-700 mb-1">
              Currency Icon
            </label>
            <select
              id="currencyIcon"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currency_icon}
              onChange={(e) => setCurrency_icon(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {currencySymbols.map((symbol, index) => (
                <option key={index} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Default Currency */}
          <div>
            <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 mb-1">
              Default Currency
            </label>
            <select
              id="defaultCurrency"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={default_currency}
              onChange={(e) => setDefault_currency(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
