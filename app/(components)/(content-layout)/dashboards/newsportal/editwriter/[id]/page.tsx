"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

const EditWriter = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loader, setLoader] = useState(false);
  const [state, setState] = useState({
    penName: "",
    category: "",
  });

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/writer/${id}`)
      .then((res) => {
        const writer = res.data.writer;
        setState({
          penName: writer.penName,
          category: writer.category,
        });
      })
      .catch(() => {
        alert("Writer not found");
        router.push("/dashboard/newsportal/writers");
      });
  }, [id, router]);

  const inputHandle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);

    try {
      await axios.put(`/api/writer/${id}`, state);
      setLoader(false);
      router.push("/dashboard/newsportal/writers");
    } catch {
      setLoader(false);
      alert("Failed to update writer");
    }
  };

  return (
    <div className="rounded-md bg-white">
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-semibold">Edit Writer</h2>
        <Link
          href="/dashboard/newsportal/writers"
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
                htmlFor="penName"
                className="text-md font-semibold text-gray-600"
              >
                Pen Name
              </label>
              <input
                onChange={inputHandle}
                value={state.penName}
                required
                type="text"
                placeholder="Pen Name"
                name="penName"
                id="penName"
                className="h-10 rounded-md border border-gray-300 px-3 py-2 outline-0 focus:border-blue-500"
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
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              disabled={loader}
              className="rounded-md bg-blue-500 px-3 py-[6px] text-white hover:bg-blue-800"
            >
              {loader ? "Loading..." : "Update Writer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWriter;
