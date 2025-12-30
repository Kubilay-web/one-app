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

interface OfferTag {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
  };
  products: Array<{
    id: string;
    name: string;
    slug: string;
    rating: number;
  }>;
}

interface Stats {
  totalProductsWithTags: number;
  mostUsedTag: {
    name: string;
    productCount: number;
  } | null;
  totalOfferTags: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const AdminOfferTagsPage = () => {
  const router = useRouter();
  const [offerTags, setOfferTags] = useState<OfferTag[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProductsWithTags: 0,
    mostUsedTag: null,
    totalOfferTags: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [bulkAction, setBulkAction] = useState<'delete' | 'update'>('delete');
  const [bulkUpdateData, setBulkUpdateData] = useState({ name: '', url: '' });
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch offer tags
  const fetchOfferTags = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/oneshop/admin/offertags/main?${params}`);
      const data = await response.json();

      if (data.success) {
        setOfferTags(data.data.offerTags || []);
        setStats(data.data.stats || {
          totalProductsWithTags: 0,
          mostUsedTag: null,
          totalOfferTags: 0
        });
        setPagination(data.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      } else {
        toast.error(data.message || 'Failed to fetch offer tags');
        // Set default values on error
        setOfferTags([]);
        setStats({
          totalProductsWithTags: 0,
          mostUsedTag: null,
          totalOfferTags: 0
        });
      }
    } catch (error) {
      console.error('Error fetching offer tags:', error);
      toast.error('Failed to fetch offer tags');
      // Set default values on error
      setOfferTags([]);
      setStats({
        totalProductsWithTags: 0,
        mostUsedTag: null,
        totalOfferTags: 0
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, sortBy, sortOrder]);

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

  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedTags.length === offerTags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(offerTags.map(tag => tag.id));
    }
  };

  // Delete offer tag
  const deleteOfferTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/oneshop/admin/offertags/main/${tagId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchOfferTags();
        setDeleteModalOpen(false);
        setSelectedTag(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting offer tag:', error);
      toast.error('Failed to delete offer tag');
    }
  };

  // Bulk delete offer tags
  const bulkDeleteOfferTags = async () => {
    if (selectedTags.length === 0) {
      toast.warning('Please select offer tags to delete');
      return;
    }

    try {
      const response = await fetch('/api/oneshop/admin/offertags/main/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'delete',
          ids: selectedTags 
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setSelectedTags([]);
        setBulkDeleteModalOpen(false);
        fetchOfferTags();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast.error('Failed to delete offer tags');
    }
  };

  // Bulk update offer tags
  const bulkUpdateOfferTags = async () => {
    if (selectedTags.length === 0) {
      toast.warning('Please select offer tags to update');
      return;
    }

    if (!bulkUpdateData.name && !bulkUpdateData.url) {
      toast.warning('Please provide update data');
      return;
    }

    try {
      const response = await fetch('/api/oneshopadmin/offertags/main/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'update',
          ids: selectedTags,
          data: bulkUpdateData
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setSelectedTags([]);
        setBulkUpdateData({ name: '', url: '' });
        fetchOfferTags();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error in bulk update:', error);
      toast.error('Failed to update offer tags');
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

  // Get product rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-success';
    if (rating >= 3) return 'text-warning';
    return 'text-danger';
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Initial fetch
  useEffect(() => {
    fetchOfferTags();
  }, [fetchOfferTags]);

  return (
    <Fragment>
      <div className="main-content landing-main ecommerce-main">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Breadcrumb */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={"Offer Tags - Admin"} />
            <Pageheader 
              Updated={true} 
              breadcrumbs={['Apps', 'Ecommerce', 'Admin']} 
              currentpage="Offer Tags" 
            />
          </div>
        </div>

        {/* Main Content */}
        <section className="section !py-3">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-12 col-span-12">
                {/* Stats Cards - UPDATED WITH SAFE ACCESS */}
                <div className="grid grid-cols-12 gap-4 mb-6">
                  <div className="lg:col-span-4 col-span-12">
                    <div className="box">
                      <div className="box-body">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center me-3">
                            <i className="bi bi-tags text-primary text-xl"></i>
                          </div>
                          <div>
                            <div className="text-sm text-textmuted dark:text-textmuted/50">Total Offer Tags</div>
                            <div className="text-2xl font-semibold">
                              {loading ? (
                                <span className="inline-block w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
                              ) : (
                                stats?.totalOfferTags || 0
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-4 col-span-12">
                    <div className="box">
                      <div className="box-body">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center me-3">
                            <i className="bi bi-box text-success text-xl"></i>
                          </div>
                          <div>
                            <div className="text-sm text-textmuted dark:text-textmuted/50">Tagged Products</div>
                            <div className="text-2xl font-semibold">
                              {loading ? (
                                <span className="inline-block w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
                              ) : (
                                stats?.totalProductsWithTags || 0
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-4 col-span-12">
                    <div className="box">
                      <div className="box-body">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center me-3">
                            <i className="bi bi-star text-warning text-xl"></i>
                          </div>
                          <div>
                            <div className="text-sm text-textmuted dark:text-textmuted/50">Most Used Tag</div>
                            <div className="text-lg font-semibold truncate">
                              {loading ? (
                                <span className="inline-block w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
                              ) : (
                                stats?.mostUsedTag ? `${stats.mostUsedTag.name} (${stats.mostUsedTag.productCount})` : 'None'
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="box mb-4">
                  <div className="box-body">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h5 className="font-semibold text-lg">Manage Offer Tags</h5>
                        <p className="text-sm text-textmuted dark:text-textmuted/50">
                          Create and manage special offer tags for products
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href="/ecommerce/admin/offer-tags/new"
                          className="ti-btn ti-btn-primary btn-wave waves-effect waves-light"
                        >
                          <i className="bi bi-plus-circle me-1"></i>
                          Add Offer Tag
                        </Link>
                        {selectedTags.length > 0 && (
                          <>
                            <button
                              onClick={() => setBulkDeleteModalOpen(true)}
                              className="ti-btn ti-btn-danger btn-wave waves-effect waves-light"
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete Selected
                            </button>
                            <button
                              onClick={() => setAssignModalOpen(true)}
                              className="ti-btn ti-btn-success btn-wave waves-effect waves-light"
                            >
                              <i className="bi bi-link me-1"></i>
                              Bulk Assign
                            </button>
                          </>
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
                            placeholder="Search offer tags..."
                            onChange={handleSearch}
                          />
                          <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-textmuted"></i>
                        </div>
                      </div>

                      {/* Sort Options */}
                      <div className="lg:col-span-3 col-span-12">
                        <select
                          className="form-control"
                          value={sortBy}
                          onChange={(e) => {
                            setSortBy(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                          }}
                        >
                          <option value="createdAt">Sort by Date</option>
                          <option value="name">Sort by Name</option>
                          <option value="productsCount">Sort by Product Count</option>
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
                          onClick={fetchOfferTags}
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

                {/* Offer Tags Table */}
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
                    ) : offerTags.length === 0 ? (
                      // Empty State
                      <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 mb-4 text-gray-300 dark:text-gray-700">
                          <i className="bi bi-tags text-6xl"></i>
                        </div>
                        <h5 className="font-semibold text-lg mb-2">No offer tags found</h5>
                        <p className="text-textmuted dark:text-textmuted/50 mb-6">
                          {searchTerm
                            ? 'Try adjusting your search'
                            : 'Get started by creating your first offer tag'}
                        </p>
                        <Link
                          href="/ecommerce/admin/offer-tags/new"
                          className="ti-btn ti-btn-primary"
                        >
                          <i className="bi bi-plus-circle me-1"></i>
                          Create Offer Tag
                        </Link>
                      </div>
                    ) : (
                      // Offer Tags Table
                      <div className="overflow-x-auto">
                        <table className="table min-w-full">
                          <thead>
                            <tr className="border-b border-defaultborder dark:border-defaultborder/10">
                              <th className="px-4 py-3 text-start">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="ti-form-checkbox"
                                    checked={selectedTags.length === offerTags.length}
                                    onChange={handleSelectAll}
                                  />
                                  <span className="ms-2">Offer Tag</span>
                                </div>
                              </th>
                              <th className="px-4 py-3 text-start">
                                <button
                                  onClick={() => handleSort('productsCount')}
                                  className="flex items-center hover:text-primary"
                                >
                                  Products
                                  {sortBy === 'productsCount' && (
                                    <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                  )}
                                </button>
                              </th>
                              <th className="px-4 py-3 text-start">Sample Products</th>
                              <th className="px-4 py-3 text-start">
                                <button
                                  onClick={() => handleSort('createdAt')}
                                  className="flex items-center hover:text-primary"
                                >
                                  Created
                                  {sortBy === 'createdAt' && (
                                    <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                  )}
                                </button>
                              </th>
                              <th className="px-4 py-3 text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {offerTags.map((tag) => (
                              <tr 
                                key={tag.id}
                                className="border-b border-defaultborder dark:border-defaultborder/10 hover:bg-gray-50 dark:hover:bg-black/10"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="ti-form-checkbox"
                                      checked={selectedTags.includes(tag.id)}
                                      onChange={() => handleTagSelect(tag.id)}
                                    />
                                    <div className="flex items-center ms-3">
                                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center me-3">
                                        <i className="bi bi-tag text-primary"></i>
                                      </div>
                                      <div>
                                        <div className="font-medium">
                                          <Link 
                                            href={`/ecommerce/admin/offer-tags/${tag.id}`}
                                            className="hover:text-primary"
                                          >
                                            {tag.name}
                                          </Link>
                                        </div>
                                        <div className="text-xs text-textmuted dark:text-textmuted/50">
                                          /{tag.url}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <span className="font-medium text-lg">
                                      {tag._count?.products || 0}
                                    </span>
                                    <div className="ms-2 text-xs text-textmuted dark:text-textmuted/50">
                                      products
                                    </div>
                                  </div>
                                  {tag._count?.products > 0 && stats?.totalProductsWithTags > 0 && (
                                    <div className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                                      {((tag._count.products / stats.totalProductsWithTags) * 100).toFixed(1)}% of tagged products
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="space-y-1">
                                    {tag.products?.slice(0, 3).map((product) => (
                                      <div key={product.id} className="flex items-center justify-between">
                                        <span className="text-sm truncate max-w-[150px]" title={product.name}>
                                          {product.name}
                                        </span>
                                        <div className="flex items-center">
                                          <span className={`text-xs font-medium ${getRatingColor(product.rating || 0)}`}>
                                            {(product.rating || 0).toFixed(1)}
                                          </span>
                                          <i className="bi bi-star-fill text-xs text-warning ms-1"></i>
                                        </div>
                                      </div>
                                    ))}
                                    {(!tag.products || tag.products.length === 0) && (
                                      <span className="text-xs text-textmuted dark:text-textmuted/50">
                                        No products assigned
                                      </span>
                                    )}
                                    {tag.products && tag.products.length > 3 && (
                                      <span className="text-xs text-textmuted dark:text-textmuted/50">
                                        +{tag.products.length - 3} more products
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-sm">{formatDate(tag.createdAt)}</div>
                                  <div className="text-xs text-textmuted dark:text-textmuted/50">
                                    Updated: {formatDate(tag.updatedAt)}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-end">
                                  <div className="flex items-center justify-end gap-2">
                                    <Link
                                      href={`/ecommerce/admin/offer-tags/${tag.id}`}
                                      className="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-primary"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>
                                    <Link
                                      href={`/ecommerce/admin/products?offerTag=${tag.id}`}
                                      className="ti-btn ti-btn-icon ti-btn-sm ti-btn-outline-secondary"
                                      title="View Products"
                                    >
                                      <i className="bi bi-eye"></i>
                                    </Link>
                                    <button
                                      onClick={() => {
                                        setSelectedTag(tag.id);
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
                    {!loading && offerTags.length > 0 && (
                      <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                        <div className="mb-4 md:mb-0">
                          <p className="text-sm text-textmuted dark:text-textmuted/50">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} offer tags
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
                    <h5 className="font-semibold text-lg">Delete Offer Tag</h5>
                    <p className="text-sm text-textmuted dark:text-textmuted/50">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                <p className="mb-6">
                  Are you sure you want to delete this offer tag? It will be removed from all products.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setSelectedTag(null);
                    }}
                    className="ti-btn ti-btn-outline-light"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => selectedTag && deleteOfferTag(selectedTag)}
                    className="ti-btn ti-btn-danger"
                    disabled={!selectedTag}
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
                    <h5 className="font-semibold text-lg">Delete Multiple Offer Tags</h5>
                    <p className="text-sm text-textmuted dark:text-textmuted/50">
                      {selectedTags.length} offer tags selected
                    </p>
                  </div>
                </div>
                <p className="mb-6">
                  Are you sure you want to delete {selectedTags.length} offer tags? 
                  They will be removed from all associated products.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setBulkDeleteModalOpen(false)}
                    className="ti-btn ti-btn-outline-light"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={bulkDeleteOfferTags}
                    className="ti-btn ti-btn-danger"
                  >
                    Delete All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Assign/Update Modal */}
        {assignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg mx-4">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center me-3">
                    <i className="bi bi-tags text-primary text-xl"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">Bulk Operations</h5>
                    <p className="text-sm text-textmuted dark:text-textmuted/50">
                      {selectedTags.length} offer tags selected
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex border-b border-defaultborder dark:border-defaultborder/10 mb-4">
                    <button
                      onClick={() => setBulkAction('update')}
                      className={`px-4 py-2 font-medium ${bulkAction === 'update' ? 'text-primary border-b-2 border-primary' : 'text-textmuted'}`}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Update
                    </button>
                    <button
                      onClick={() => setBulkAction('delete')}
                      className={`px-4 py-2 font-medium ${bulkAction === 'delete' ? 'text-primary border-b-2 border-primary' : 'text-textmuted'}`}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Delete
                    </button>
                  </div>

                  {bulkAction === 'update' && (
                    <div className="space-y-4">
                      <div>
                        <label className="ti-form-label">New Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Leave empty to keep current"
                          value={bulkUpdateData.name}
                          onChange={(e) => setBulkUpdateData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="ti-form-label">New URL Slug</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Leave empty to keep current"
                          value={bulkUpdateData.url}
                          onChange={(e) => setBulkUpdateData(prev => ({ ...prev, url: e.target.value }))}
                        />
                        <p className="text-xs text-textmuted dark:text-textmuted/50 mt-1">
                          Use lowercase letters, numbers, and hyphens only
                        </p>
                      </div>
                    </div>
                  )}

                  {bulkAction === 'delete' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
                      <div className="flex items-start">
                        <i className="bi bi-exclamation-triangle text-red-600 dark:text-red-400 me-2 mt-0.5"></i>
                        <div>
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                            Warning: This action cannot be undone
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">
                            All selected offer tags will be permanently deleted and removed from associated products.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setAssignModalOpen(false)}
                    className="ti-btn ti-btn-outline-light"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={bulkAction === 'update' ? bulkUpdateOfferTags : bulkDeleteOfferTags}
                    className={`ti-btn ${bulkAction === 'update' ? 'ti-btn-primary' : 'ti-btn-danger'}`}
                  >
                    {bulkAction === 'update' ? 'Update Selected' : 'Delete Selected'}
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

export default AdminOfferTagsPage;