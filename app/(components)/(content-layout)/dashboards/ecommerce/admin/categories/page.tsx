"use client"

import { Fragment, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from 'lodash';

import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";

interface Category {
  id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
    subCategories: number;
  };
  subCategories: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const AdminCategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterFeatured, setFilterFeatured] = useState<string>('');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch categories with optimized debouncing
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterFeatured && { featured: filterFeatured })
      });

      const response = await fetch(`/api/oneshop/admin/categories?${params}`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data.categories);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, filterFeatured]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500),
    []
  );

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(cat => cat.id));
    }
  };

  // Delete category
  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/oneshop/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchCategories();
        setDeleteModalOpen(false);
        setSelectedCategory(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Bulk delete categories
  const bulkDeleteCategories = async () => {
    if (selectedCategories.length === 0) {
      toast.warning('Please select categories to delete');
      return;
    }

    try {
      const response = await fetch('/api/oneshop/admin/categories/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedCategories }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setSelectedCategories([]);
        setBulkDeleteModalOpen(false);
        fetchCategories();
      } else {
        toast.error(data.message);
        // Show which categories have relations
        if (data.data?.invalidCategories) {
          const invalidNames = data.data.invalidCategories.map((cat: any) => cat.name).join(', ');
          toast.error(`Cannot delete: ${invalidNames} have subcategories or products`);
        }
      }
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast.error('Failed to delete categories');
    }
  };

  // Toggle featured status
  const toggleFeatured = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/oneshop/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Category ${!currentStatus ? 'featured' : 'unfeatured'}`);
        fetchCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update category');
    }
  };

  // Handle filters change
  const handleFilterChange = (filter: string, value: string) => {
    if (filter === 'featured') {
      setFilterFeatured(value);
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <Fragment>
      <div className="main-content landing-main ecommerce-main">
        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Breadcrumb */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={"Categories - Admin"} />
            <Pageheader 
              Updated={true} 
              breadcrumbs={['Apps', 'Ecommerce', 'Admin']} 
              currentpage="Categories" 
            />
          </div>
        </div>

        {/* Main Content */}
        <section className="section !py-3">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-12 col-span-12">
                {/* Header Actions */}
                <div className="box mb-4">
                  <div className="box-body">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h5 className="font-semibold text-lg">Manage Categories</h5>
                        <p className="text-sm text-textmuted dark:text-textmuted/50">
                          Create, edit, and manage product categories
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href="/ecommerce/dashboards/admin/categories/new"
                          className="ti-btn ti-btn-primary btn-wave waves-effect waves-light"
                        >
                          <i className="bi bi-plus-circle me-1"></i>
                          Add Category
                        </Link>
                        {selectedCategories.length > 0 && (
                          <button
                            onClick={() => setBulkDeleteModalOpen(true)}
                            className="ti-btn ti-btn-danger btn-wave waves-effect waves-light"
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete Selected ({selectedCategories.length})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="box mb-4">
                  <div className="box-body">
                    <div className="grid grid-cols-12 gap-4">
                      {/* Search */}
                      <div className="lg:col-span-4 col-span-12">
                        <div className="relative">
                          <input
                            type="text"
                            className="form-control !ps-10"
                            placeholder="Search categories..."
                            onChange={handleSearch}
                          />
                          {/* <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-textmuted"></i> */}
                        </div>
                      </div>

                      {/* Filters */}
                      <div className="lg:col-span-3 col-span-12">
                        <select
                          className="form-control"
                          value={filterFeatured}
                          onChange={(e) => handleFilterChange('featured', e.target.value)}
                        >
                          <option value="">All Categories</option>
                          <option value="true">Featured Only</option>
                          <option value="false">Non-Featured</option>
                        </select>
                      </div>

                      {/* Items per page */}
                      <div className="lg:col-span-3 col-span-12">
                        <select
                          className="form-control"
                          value={pagination.limit}
                          onChange={(e) => setPagination(prev => ({ 
                            ...prev, 
                            limit: parseInt(e.target.value),
                            page: 1 
                          }))}
                        >
                          <option value="5">5 per page</option>
                          <option value="10">10 per page</option>
                          <option value="20">20 per page</option>
                          <option value="50">50 per page</option>
                        </select>
                      </div>

                      {/* Refresh Button */}
                      <div className="lg:col-span-2 col-span-12">
                        <button
                          onClick={fetchCategories}
                          className="ti-btn ti-btn-outline-light w-full btn-wave waves-effect waves-light"
                          disabled={loading}
                        >
                          {loading ? (
                            <i className="bi bi-arrow-clockwise animate-spin"></i>
                          ) : (
                            <i className="bi bi-arrow-clockwise"></i>
                          )}
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categories Table */}
                <div className="box">
                  <div className="box-body">
                    {loading ? (
                      // Loading Skeleton
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-black/20 rounded">
                              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/6"></div>
                              </div>
                              <div className="w-20 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : categories.length === 0 ? (
                      // Empty State
                      <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 mb-4 text-gray-300 dark:text-gray-700">
                          <i className="bi bi-folder text-6xl"></i>
                        </div>
                        <h5 className="font-semibold text-lg mb-2">No categories found</h5>
                        <p className="text-textmuted dark:text-textmuted/50 mb-6">
                          {searchTerm || filterFeatured
                            ? 'Try adjusting your search or filters'
                            : 'Get started by creating your first category'}
                        </p>
                        <Link
                          href="/ecommerce/admin/categories/new"
                          className="ti-btn ti-btn-primary"
                        >
                          <i className="bi bi-plus-circle me-1"></i>
                          Create Category
                        </Link>
                      </div>
                    ) : (
                      // Categories Table
                      <div className="overflow-x-auto">
                        <table className="table min-w-full">
                          <thead>
                            <tr className="border-b border-defaultborder dark:border-defaultborder/10">
                              <th className="px-4 py-3 text-start">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="ti-form-checkbox"
                                    checked={selectedCategories.length === categories.length}
                                    onChange={handleSelectAll}
                                  />
                                  <span className="ms-2">Category</span>
                                </div>
                              </th>
                              <th className="px-4 py-3 text-start">Products</th>
                              <th className="px-4 py-3 text-start">Subcategories</th>
                              <th className="px-4 py-3 text-start">Featured</th>
                              <th className="px-4 py-3 text-start">Created</th>
                              <th className="px-4 py-3 text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((category) => (
                              <tr 
                                key={category.id}
                                className="border-b border-defaultborder dark:border-defaultborder/10 hover:bg-gray-50 dark:hover:bg-black/10"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="ti-form-checkbox"
                                      checked={selectedCategories.includes(category.id)}
                                      onChange={() => handleCategorySelect(category.id)}
                                    />
                                    <div className="flex items-center ms-3">
                                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-300 dark:bg-gray-700 me-3">
                                        {category.image && (
                                          <Image
                                            src={category.image}
                                            alt={category.name}
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                          />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          <Link 
                                            href={`/ecommerce/admin/categories/${category.id}`}
                                            className="hover:text-primary"
                                          >
                                            {category.name}
                                          </Link>
                                        </div>
                                        <div className="text-xs text-textmuted dark:text-textmuted/50">
                                          /{category.url}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {category.subCategories.slice(0, 3).map((sub) => (
                                            <span 
                                              key={sub.id}
                                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-black/20 rounded"
                                            >
                                              {sub.name}
                                            </span>
                                          ))}
                                          {category._count.subCategories > 3 && (
                                            <span className="text-xs text-textmuted">
                                              +{category._count.subCategories - 3} more
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-medium">
                                    {category._count.products}
                                  </span>
                                  <div className="text-xs text-textmuted dark:text-textmuted/50">
                                    products
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="font-medium">
                                    {category._count.subCategories}
                                  </span>
                                  <div className="text-xs text-textmuted dark:text-textmuted/50">
                                    subcategories
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => toggleFeatured(category.id, category.featured)}
                                    className={`ti-btn !text-xs !py-1 !px-3 ${
                                      category.featured
                                        ? 'ti-btn-success'
                                        : 'ti-btn-outline-light'
                                    }`}
                                  >
                                    {category.featured ? (
                                      <>
                                        <i className="bi bi-star-fill me-1"></i>
                                        Featured
                                      </>
                                    ) : (
                                      'Make Featured'
                                    )}
                                  </button>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm">{formatDate(category.createdAt)}</div>
                                  <div className="text-xs text-textmuted dark:text-textmuted/50">
                                    Updated: {formatDate(category.updatedAt)}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-end">
                                  <div className="flex items-center justify-end gap-2">
                                    <Link
                                      href={`/ecommerce/admin/categories/${category.id}`}
                                      className="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-primary"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>
                                    <Link
                                      href={`/ecommerce/admin/subcategories?category=${category.id}`}
                                      className="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-secondary"
                                      title="Subcategories"
                                    >
                                      <i className="bi bi-folder-plus"></i>
                                    </Link>
                                    <button
                                      onClick={() => {
                                        setSelectedCategory(category.id);
                                        setDeleteModalOpen(true);
                                      }}
                                      className="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-danger"
                                      title="Delete"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Pagination */}
                    {!loading && categories.length > 0 && (
                      <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                        <div className="mb-4 md:mb-0">
                          <p className="text-sm text-textmuted dark:text-textmuted/50">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} categories
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="ti-btn ti-btn-outline-light ti-btn-sm"
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                          
                          {/* Page Numbers */}
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1;
                            } else if (pagination.page >= pagination.totalPages - 2) {
                              pageNum = pagination.totalPages - 4 + i;
                            } else {
                              pageNum = pagination.page - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`ti-btn ti-btn-sm ${
                                  pagination.page === pageNum
                                    ? 'ti-btn-primary'
                                    : 'ti-btn-outline-light'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasNextPage}
                            className="ti-btn ti-btn-outline-light ti-btn-sm"
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center me-3">
                    <i className="bi bi-exclamation-triangle text-red-600 dark:text-red-400 text-xl"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">Delete Category</h5>
                    <p className="text-sm text-textmuted dark:text-textmuted/50">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <p className="mb-6">
                  Are you sure you want to delete this category? All subcategories and products
                  must be removed or reassigned first.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setSelectedCategory(null);
                    }}
                    className="ti-btn ti-btn-outline-light"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => selectedCategory && deleteCategory(selectedCategory)}
                    className="ti-btn ti-btn-danger"
                    disabled={!selectedCategory}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Delete Confirmation Modal */}
        {bulkDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center me-3">
                    <i className="bi bi-exclamation-triangle text-red-600 dark:text-red-400 text-xl"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">Delete Categories</h5>
                    <p className="text-sm text-textmuted dark:text-textmuted/50">
                      {selectedCategories.length} categories selected
                    </p>
                  </div>
                </div>
                <p className="mb-6">
                  Are you sure you want to delete {selectedCategories.length} categories? 
                  This action cannot be undone. Categories with subcategories or products 
                  cannot be deleted.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setBulkDeleteModalOpen(false)}
                    className="ti-btn ti-btn-outline-light"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={bulkDeleteCategories}
                    className="ti-btn ti-btn-danger"
                  >
                    Delete All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner Section */}
        <section className="section bg-banner lg:px-0 px-4 !py-[4.375rem]">
          <div className="grid grid-cols-12 gap-x-6 justify-center">
            <div className="lg:col-span-3 col-span-1 text-center"></div>
            <div className="lg:col-span-6 col-span-10 text-center">
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-white">
                  &#128073; Download our free mobile apps today
                </h3>
              </div>
              <h6 className="mb-4 opacity-90 text-white">
                Labore no sed ipsum ipsum nonumy. Sit ipsum sanctus ea
                magna est. Kasd diam rebum sit ipsum ipsum erat et kasd.Est amet sit vero sanctus labore no
                sed ipsum ipsum nonumy vero sanctus labore..
              </h6>
              <div className="btn-list">
                <Link scroll={false} href="#!" className="ti-btn bg-black app-store relative">
                  <Image 
                    src="../../../assets/images/media/apps/play-store.png" 
                    alt="Google Play" 
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  Google Play
                </Link>
                <Link scroll={false} href="#!" className="ti-btn bg-black app-store relative">
                  <Image 
                    src="../../../assets/images/media/apps/apple-store.png" 
                    alt="App Store" 
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  App Store
                </Link>
              </div>
            </div>
            <div className="lg:col-span-3 col-span-1 text-center"></div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default AdminCategoriesPage;