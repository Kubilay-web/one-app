"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AddWriter = () => {
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const [state, setState] = useState({
    penName: "",
    category: "",
  });

  const inputHandle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoader(true);
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/writer`,
        state,
      );
      setLoader(false);
      toast.success(data.message);
      router.push("/dashboards/newsportal/writers");
    } catch (error: any) {
      setLoader(false);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="rounded-md bg-white shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-2 sm:gap-0 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700">Add Writers</h2>
        <Link
          href="/dashboards/newsportal/writers"
          className="rounded-md bg-blue-500 px-4 py-2 text-white text-center hover:bg-blue-800 transition"
        >
          Writers
        </Link>
      </div>

      {/* Form */}
      <div className="p-4">
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PenName */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-md font-semibold text-gray-600"
              >
                PenName
              </label>
              <input
                onChange={inputHandle}
                value={state.penName}
                required
                type="text"
                placeholder="Name"
                name="penName"
                id="name"
                className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="category"
                className="text-md font-semibold text-gray-600"
              >
                Category
              </label>
              <select
                onChange={inputHandle}
                value={state.category}
                required
                name="category"
                id="category"
                className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">--- Select Category ---</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Health">Health</option>
                <option value="International">International</option>
                <option value="Sports">Sports</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-4 flex justify-start">
            <button
              type="submit"
              disabled={loader}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-800 transition disabled:opacity-60"
            >
              {loader ? "Loading..." : "Add Writer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWriter;
