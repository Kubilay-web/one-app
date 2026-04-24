"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CategoryManagement = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/news/category");
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      if (editingCategory) {
        await axios.put(
          `/api/news/category/${encodeURIComponent(editingCategory)}`,
          { newName: formData.name.trim() }
        );
        toast.success("Category updated");
      } else {
        await axios.post("/api/news/category", {
          name: formData.name.trim(),
        });
        toast.success("Category added");
      }

      fetchCategories();
      setIsModalOpen(false);
      setFormData({ name: "" });
      setEditingCategory(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) return;

    try {
      await axios.delete(
        `/api/news/category/${encodeURIComponent(categoryName)}`
      );
      toast.success("Category deleted");
      fetchCategories();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (categoryName: string) => {
    setEditingCategory(categoryName);
    setFormData({ name: categoryName });
    setIsModalOpen(true);
  };

  const getSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-b-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Category Management
        </h2>

        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "" });
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No categories found.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Slug</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category} className="border-t">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {category}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {getSlug(category)}
                    </td>
                    <td className="px-6 py-4 space-x-4">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {categories.map((category) => (
              <div
                key={category}
                className="border rounded-lg p-4 shadow-sm"
              >
                <div className="font-semibold text-gray-800">
                  {category}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  {getSlug(category)}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ name: e.target.value })
                }
                placeholder="Category name"
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                    setFormData({ name: "" });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;