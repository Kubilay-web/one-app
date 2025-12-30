"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Fragment } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  StoreStatus, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Star, 
  Users, 
  Package, 
  TrendingUp, 
  AlertCircle,
  Download,
  RefreshCw,
  MoreVertical,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

// Dinamik importlar
const SpkSelect = dynamic(
  () => import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),
  { ssr: false }
);

// Types
interface Store {
  id: string;
  name: string;
  email: string;
  url: string;
  status: StoreStatus;
  logo: string;
  cover: string;
  featured: boolean;
  averageRating: number;
  productCount: number;
  followerCount: number;
  owner: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface StoreStats {
  totalStores: number;
  storesByStatus: Record<string, number>;
  newStoresToday: number;
  newStoresThisWeek: number;
  newStoresThisMonth: number;
  featuredStoresCount: number;
  averageRating: number;
  topStoresByProducts: Array<{
    id: string;
    name: string;
    owner: string;
    productCount: number;
    followerCount: number;
  }>;
  topStoresByFollowers: Array<{
    id: string;
    name: string;
    owner: string;
    productCount: number;
    followerCount: number;
  }>;
}

// Status badge component
const StatusBadge = ({ status }: { status: StoreStatus }) => {
  const getStatusConfig = (status: StoreStatus) => {
    switch (status) {
      case 'ACTIVE':
        return {
          className: 'bg-success/10 text-success dark:bg-success/20',
          icon: <Check className="w-3 h-3" />,
          text: 'Active'
        };
      case 'PENDING':
        return {
          className: 'bg-warning/10 text-warning dark:bg-warning/20',
          icon: <AlertCircle className="w-3 h-3" />,
          text: 'Pending'
        };
      case 'BANNED':
        return {
          className: 'bg-danger/10 text-danger dark:bg-danger/20',
          icon: <X className="w-3 h-3" />,
          text: 'Banned'
        };
      case 'DISABLED':
        return {
          className: 'bg-secondary/10 text-secondary dark:bg-secondary/20',
          icon: <Shield className="w-3 h-3" />,
          text: 'Disabled'
        };
      default:
        return {
          className: 'bg-defaultborder/10 text-textmuted',
          icon: null,
          text: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.icon}
      {config.text}
    </span>
  );
};

// Featured badge component
const FeaturedBadge = ({ featured }: { featured: boolean }) => {
  if (!featured) return null;
  
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
      <Star className="w-3 h-3" />
      Featured
    </span>
  );
};

// Main component
export default function AdminStoresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<StoreStatus | 'ALL'>(searchParams.get('status') as StoreStatus || 'ALL');
  const [stats, setStats] = useState<StoreStats | null>(null);
  
  // Pagination
  const [pagination, setPagination] = useState<Pagination>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    total: 0,
    pages: 0,
  });

  // Fetch stores
  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const response = await fetch(`/api/oneshop/admin/stores?${params}`);
      const data = await response.json();

      if (data.success) {
        setStores(data.data);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || 'Failed to fetch stores');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Error fetching stores');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('/api/oneshop/admin/stores/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStores();
    fetchStats();
  }, [fetchStores, fetchStats]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    
    if (statusFilter !== 'ALL') {
      params.set('status', statusFilter);
    } else {
      params.delete('status');
    }
    
    params.set('page', pagination.page.toString());
    params.set('limit', pagination.limit.toString());
    
    router.replace(`?${params.toString()}`);
  }, [searchTerm, statusFilter, pagination.page, pagination.limit, router, searchParams]);

  // Bulk operations
  const handleBulkAction = async (action: 'delete' | 'update-status' | 'feature', data?: any) => {
    if (selectedStores.length === 0) {
      toast.error('Please select stores to perform this action');
      return;
    }

    try {
      setBulkLoading(true);
      
      const response = await fetch('/api/oneshop/admin/stores/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          storeIds: selectedStores,
          data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setSelectedStores([]);
        fetchStores();
        fetchStats();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Error performing bulk action');
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle store deletion
  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (!confirm(`Are you sure you want to delete "${storeName}"?`)) return;

    try {
      const response = await fetch(`/api/oneshop/admin/stores/${storeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Store deleted successfully');
        fetchStores();
        fetchStats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      toast.error('Error deleting store');
    }
  };

  // Handle status change
  const handleStatusChange = async (storeId: string, newStatus: StoreStatus) => {
    try {
      const response = await fetch(`/api/oneshop/admin/stores/${storeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Store status updated');
        fetchStores();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating store status:', error);
      toast.error('Error updating store status');
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Select all stores
  const handleSelectAll = () => {
    if (selectedStores.length === stores.length) {
      setSelectedStores([]);
    } else {
      setSelectedStores(stores.map(store => store.id));
    }
  };

  // Export stores
  const handleExport = () => {
    // Simple CSV export
    const headers = ['ID', 'Name', 'Email', 'URL', 'Status', 'Products', 'Followers', 'Owner', 'Created At'];
    const csvData = stores.map(store => [
      store.id,
      store.name,
      store.email,
      store.url,
      store.status,
      store.productCount,
      store.followerCount,
      store.owner.username,
      new Date(store.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stores-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Status options for filter
  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'BANNED', label: 'Banned' },
    { value: 'DISABLED', label: 'Disabled' },
  ];

  // Status options for bulk update
  const bulkStatusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'BANNED', label: 'Banned' },
    { value: 'DISABLED', label: 'Disabled' },
  ];

  return (
    <Fragment>
      <div className="main-content">
        {/* Header */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4">
          <div className="container">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Stores Management</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and monitor all stores in the platform
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExport}
                  disabled={loading || stores.length === 0}
                  className="ti-btn ti-btn-outline-light flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <Link
                  href="/admin/stores/new"
                  className="ti-btn ti-btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Store
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Stores */}
              <div className="box">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Stores</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {statsLoading ? '...' : stats?.totalStores.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Active</span>
                    <span className="font-semibold">
                      {statsLoading ? '...' : (stats?.storesByStatus.ACTIVE || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* New Stores Today */}
              <div className="box">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">New Today</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {statsLoading ? '...' : stats?.newStoresToday}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-success/10 text-success">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">This Week</span>
                    <span className="font-semibold">
                      {statsLoading ? '...' : stats?.newStoresThisWeek}
                    </span>
                  </div>
                </div>
              </div>

              {/* Average Rating */}
              <div className="box">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {statsLoading ? '...' : stats?.averageRating.toFixed(1)}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-warning/10 text-warning">
                    <Star className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Featured</span>
                    <span className="font-semibold">
                      {statsLoading ? '...' : stats?.featuredStoresCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Followers */}
              <div className="box">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {statsLoading ? '...' : stats?.newStoresThisMonth}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Pending</span>
                    <span className="font-semibold">
                      {statsLoading ? '...' : (stats?.storesByStatus.PENDING || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="section !pt-0">
          <div className="container">
            <div className="box">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search stores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ti-form-control ps-10"
                      />
                    </div>
                    <button
                      type="submit"
                      className="ti-btn ti-btn-primary"
                      disabled={loading}
                    >
                      Search
                    </button>
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="ti-btn ti-btn-outline-light"
                      >
                        Clear
                      </button>
                    )}
                  </form>

                  <div className="w-full sm:w-auto">
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value as StoreStatus | 'ALL');
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      className="ti-form-control"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedStores.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedStores.length} selected
                    </span>
                    <select
                      value=""
                      onChange={(e) => {
                        const action = e.target.value;
                        if (action === 'delete') {
                          if (confirm(`Delete ${selectedStores.length} stores?`)) {
                            handleBulkAction('delete');
                          }
                        } else if (action.startsWith('status-')) {
                          const status = action.replace('status-', '') as StoreStatus;
                          handleBulkAction('update-status', { status });
                        } else if (action === 'feature') {
                          handleBulkAction('feature', { featured: true });
                        } else if (action === 'unfeature') {
                          handleBulkAction('feature', { featured: false });
                        }
                        e.target.value = '';
                      }}
                      disabled={bulkLoading}
                      className="ti-form-control"
                    >
                      <option value="">Bulk Actions</option>
                      <optgroup label="Update Status">
                        {bulkStatusOptions.map(option => (
                          <option key={option.value} value={`status-${option.value}`}>
                            Set as {option.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Featured">
                        <option value="feature">Mark as Featured</option>
                        <option value="unfeature">Remove Featured</option>
                      </optgroup>
                      <optgroup label="Danger">
                        <option value="delete" className="text-danger">Delete Selected</option>
                      </optgroup>
                    </select>
                    <button
                      onClick={() => setSelectedStores([])}
                      className="ti-btn ti-btn-outline-light"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stores Table */}
        <div className="section !pt-0">
          <div className="container">
            <div className="box">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : stores.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No stores found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm || statusFilter !== 'ALL' ? 'Try changing your filters' : 'Get started by creating a new store'}
                  </p>
                  {searchTerm || statusFilter !== 'ALL' ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('ALL');
                      }}
                      className="ti-btn ti-btn-primary"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <Link
                      href="/admin/stores/new"
                      className="ti-btn ti-btn-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Store
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="ti-custom-table ti-custom-table-head">
                      <thead>
                        <tr>
                          <th scope="col" className="w-12">
                            <input
                              type="checkbox"
                              checked={stores.length > 0 && selectedStores.length === stores.length}
                              onChange={handleSelectAll}
                              className="ti-form-checkbox"
                            />
                          </th>
                          <th scope="col">Store</th>
                          <th scope="col">Owner</th>
                          <th scope="col">Status</th>
                          <th scope="col">Products</th>
                          <th scope="col">Followers</th>
                          <th scope="col">Rating</th>
                          <th scope="col">Created</th>
                          <th scope="col" className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stores.map((store) => (
                          <tr key={store.id} className="hover:bg-gray-50 dark:hover:bg-black/20">
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedStores.includes(store.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStores(prev => [...prev, store.id]);
                                  } else {
                                    setSelectedStores(prev => prev.filter(id => id !== store.id));
                                  }
                                }}
                                className="ti-form-checkbox"
                              />
                            </td>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                  <Image
                                    src={store.logo || '/default-store-logo.png'}
                                    alt={store.name}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Link
                                      href={`/admin/stores/${store.id}`}
                                      className="font-medium text-gray-800 dark:text-white hover:text-primary transition-colors"
                                    >
                                      {store.name}
                                    </Link>
                                    <FeaturedBadge featured={store.featured} />
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {store.email}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-500">
                                    /{store.url}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="font-medium text-gray-800 dark:text-white">
                                  {store.owner.username}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {store.owner.email}
                                </div>
                              </div>
                            </td>
                            <td>
                              <StatusBadge status={store.status} />
                            </td>
                            <td>
                              <div className="font-medium">
                                {store.productCount.toLocaleString()}
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {store.followerCount.toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-warning fill-current" />
                                <span className="font-medium">
                                  {store.averageRating.toFixed(1)}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(store.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/admin/stores/${store.id}`}
                                  className="ti-btn ti-btn-outline-light ti-btn-sm"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <Link
                                  href={`/admin/stores/${store.id}/edit`}
                                  className="ti-btn ti-btn-outline-light ti-btn-sm"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteStore(store.id, store.name)}
                                  className="ti-btn ti-btn-outline-light ti-btn-sm hover:bg-danger/10 hover:text-danger"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="relative">
                                  <button
                                    className="ti-btn ti-btn-outline-light ti-btn-sm"
                                    title="More options"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-defaultborder dark:border-defaultborder/10 z-10 hidden group-hover:block">
                                    <div className="py-1">
                                      <button
                                        onClick={() => handleStatusChange(
                                          store.id, 
                                          store.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'
                                        )}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                      >
                                        {store.status === 'ACTIVE' ? 'Disable Store' : 'Activate Store'}
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(
                                          store.id, 
                                          store.status === 'BANNED' ? 'ACTIVE' : 'BANNED'
                                        )}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                      >
                                        {store.status === 'BANNED' ? 'Unban Store' : 'Ban Store'}
                                      </button>
                                      <Link
                                        href={`/stores/${store.url}`}
                                        target="_blank"
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
                                      >
                                        Visit Store
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-defaultborder dark:border-defaultborder/10">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} stores
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1 || loading}
                          className="ti-btn ti-btn-outline-light ti-btn-sm"
                        >
                          Previous
                        </button>
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                          let pageNum;
                          if (pagination.pages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.page >= pagination.pages - 2) {
                            pageNum = pagination.pages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={loading}
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
                          disabled={pagination.page === pagination.pages || loading}
                          className="ti-btn ti-btn-outline-light ti-btn-sm"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}