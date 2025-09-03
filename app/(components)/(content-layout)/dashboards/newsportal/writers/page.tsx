"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

type Writer = {
  id: string;
  penName: string;
  category: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
};

export default function Writers() {
  const [writers, setWriters] = useState<Writer[]>([]);

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        const res = await axios.get("/api/writer/getwriters");
        setWriters(res.data.writers);
      } catch (err) {
        console.error("Failed to fetch writers", err);
      }
    };

    fetchWriters();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this writer?")) return;

    try {
      await axios.delete(`/api/writer/${id}`);

      // Silme başarılıysa state'i güncelle
      setWriters((prev) => prev.filter((writer) => writer.id !== id));
    } catch (error) {
      alert("Failed to delete writer");
      console.error(error);
    }
  };

  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-gray-400 px-6 py-4">
        <h2 className="text-2xl font-semibold text-gray-800">Writers</h2>
        <Link
          href="/dashboard/writer/add"
          className="rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-800"
        >
          Add Writer
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto overflow-hidden rounded-lg bg-white shadow-lg">
          <thead className="bg-gray-100 text-sm uppercase text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">No</th>
              <th className="px-6 py-4 text-left">Pen Name</th>
              <th className="px-6 py-4 text-left">Category</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {writers.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{item.penName}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.user.username}</td>
                <td className="px-6 py-4">{item.user.email}</td>
                <td className="px-6 py-4">{item.user.role}</td>
                <td className="px-6 py-4">
                  <Image
                    src={item.user.avatarUrl}
                    alt="Profile"
                    className="rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 text-gray-500">
                    <Link
                      href={`/dashboard/newsportal/editwriter/${item.id}`}
                      className="rounded bg-yellow-500 p-2 text-white hover:bg-yellow-800"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded bg-red-500 p-2 text-white hover:bg-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
