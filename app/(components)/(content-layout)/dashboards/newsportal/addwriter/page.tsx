"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// import storeContext from "@/context/storeContext";

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
      router.push("/dashboard/newsportal/writers");
    } catch (error: any) {
      setLoader(false);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="rounded-md bg-white">
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-semibold">Add Writers</h2>
        <Link
          href="/dashboard/writers"
          className="rounded-md bg-blue-500 px-3 py-[6px] text-white hover:bg-blue-800"
        >
          Writers
        </Link>
      </div>

      <div className="p-4">
        <form onSubmit={submit}>
          <div className="mb-3 grid grid-cols-2 gap-x-8">
            <div className="flex flex-col gap-y-2">
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
                className="h-10 rounded-md border border-gray-300 px-3 py-2 outline-0 focus:border-blue-500"
                id="name"
              />
            </div>

            <div className="flex flex-col gap-y-2">
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
                className="h-10 rounded-md border border-gray-300 px-3 py-2 outline-0 focus:border-blue-500"
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

          <div className="mt-4">
            <button
              disabled={loader}
              className="rounded-md bg-blue-500 px-3 py-[6px] text-white hover:bg-blue-800"
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
