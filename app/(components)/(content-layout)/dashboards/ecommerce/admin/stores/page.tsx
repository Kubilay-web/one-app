// // "use client";

// // import React, { useState, useEffect, useCallback } from "react";
// // import { Fragment } from "react";
// // import dynamic from "next/dynamic";
// // import Link from "next/link";
// // import Image from "next/image";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import {
// //   StoreStatus,
// //   Search,
// //   Filter,
// //   Plus,
// //   Edit,
// //   Trash2,
// //   Eye,
// //   Check,
// //   X,
// //   Star,
// //   Users,
// //   Package,
// //   TrendingUp,
// //   AlertCircle,
// //   Download,
// //   RefreshCw,
// //   MoreVertical,
// //   Shield,
// // } from "lucide-react";
// // import toast from "react-hot-toast";

// // // Dinamik importlar
// // const SpkSelect = dynamic(
// //   () =>
// //     import("@/shared/@spk-reusable-components/spk-packages/spk-reactselect"),
// //   { ssr: false },
// // );

// // // Types
// // interface Store {
// //   id: string;
// //   name: string;
// //   email: string;
// //   url: string;
// //   status: StoreStatus;
// //   logo: string;
// //   cover: string;
// //   featured: boolean;
// //   averageRating: number;
// //   productCount: number;
// //   followerCount: number;
// //   owner: {
// //     id: string;
// //     username: string;
// //     email: string;
// //   };
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // interface Pagination {
// //   page: number;
// //   limit: number;
// //   total: number;
// //   pages: number;
// // }

// // interface StoreStats {
// //   totalStores: number;
// //   storesByStatus: Record<string, number>;
// //   newStoresToday: number;
// //   newStoresThisWeek: number;
// //   newStoresThisMonth: number;
// //   featuredStoresCount: number;
// //   averageRating: number;
// //   topStoresByProducts: Array<{
// //     id: string;
// //     name: string;
// //     owner: string;
// //     productCount: number;
// //     followerCount: number;
// //   }>;
// //   topStoresByFollowers: Array<{
// //     id: string;
// //     name: string;
// //     owner: string;
// //     productCount: number;
// //     followerCount: number;
// //   }>;
// // }

// // // Status badge component
// // const StatusBadge = ({ status }: { status: StoreStatus }) => {
// //   const getStatusConfig = (status: StoreStatus) => {
// //     switch (status) {
// //       case "ACTIVE":
// //         return {
// //           className: "bg-success/10 text-success dark:bg-success/20",
// //           icon: <Check className="w-3 h-3" />,
// //           text: "Active",
// //         };
// //       case "PENDING":
// //         return {
// //           className: "bg-warning/10 text-warning dark:bg-warning/20",
// //           icon: <AlertCircle className="w-3 h-3" />,
// //           text: "Pending",
// //         };
// //       case "BANNED":
// //         return {
// //           className: "bg-danger/10 text-danger dark:bg-danger/20",
// //           icon: <X className="w-3 h-3" />,
// //           text: "Banned",
// //         };
// //       case "DISABLED":
// //         return {
// //           className: "bg-secondary/10 text-secondary dark:bg-secondary/20",
// //           icon: <Shield className="w-3 h-3" />,
// //           text: "Disabled",
// //         };
// //       default:
// //         return {
// //           className: "bg-defaultborder/10 text-textmuted",
// //           icon: null,
// //           text: status,
// //         };
// //     }
// //   };

// //   const config = getStatusConfig(status);

// //   return (
// //     <span
// //       className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
// //     >
// //       {config.icon}
// //       {config.text}
// //     </span>
// //   );
// // };

// // // Featured badge component
// // const FeaturedBadge = ({ featured }: { featured: boolean }) => {
// //   if (!featured) return null;

// //   return (
// //     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
// //       <Star className="w-3 h-3" />
// //       Featured
// //     </span>
// //   );
// // };

// // // Main component
// // export default function AdminStoresPage() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();

// //   // State
// //   const [stores, setStores] = useState<Store[]>([]);
// //   const [selectedStores, setSelectedStores] = useState<string[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [statsLoading, setStatsLoading] = useState(true);
// //   const [bulkLoading, setBulkLoading] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState(
// //     searchParams.get("search") || "",
// //   );
// //   const [statusFilter, setStatusFilter] = useState<StoreStatus | "ALL">(
// //     (searchParams.get("status") as StoreStatus) || "ALL",
// //   );
// //   const [stats, setStats] = useState<StoreStats | null>(null);

// //   // Pagination
// //   const [pagination, setPagination] = useState<Pagination>({
// //     page: parseInt(searchParams.get("page") || "1"),
// //     limit: parseInt(searchParams.get("limit") || "10"),
// //     total: 0,
// //     pages: 0,
// //   });

// //   // Fetch stores
// //   const fetchStores = useCallback(async () => {
// //     try {
// //       setLoading(true);

// //       const params = new URLSearchParams({
// //         page: pagination.page.toString(),
// //         limit: pagination.limit.toString(),
// //         ...(searchTerm && { search: searchTerm }),
// //         ...(statusFilter !== "ALL" && { status: statusFilter }),
// //         sortBy: "createdAt",
// //         sortOrder: "desc",
// //       });

// //       const response = await fetch(`/api/oneshop/admin/stores?${params}`);
// //       const data = await response.json();

// //       if (data.success) {
// //         setStores(data.data);
// //         setPagination(data.pagination);
// //       } else {
// //         toast.error(data.message || "Failed to fetch stores");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching stores:", error);
// //       toast.error("Error fetching stores");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

// //   // Fetch statistics
// //   const fetchStats = useCallback(async () => {
// //     try {
// //       setStatsLoading(true);
// //       const response = await fetch("/api/oneshop/admin/stores/stats");
// //       const data = await response.json();

// //       if (data.success) {
// //         setStats(data.data);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching stats:", error);
// //     } finally {
// //       setStatsLoading(false);
// //     }
// //   }, []);

// //   // Initial fetch
// //   useEffect(() => {
// //     fetchStores();
// //     fetchStats();
// //   }, [fetchStores, fetchStats]);

// //   // Update URL when filters change
// //   useEffect(() => {
// //     const params = new URLSearchParams(searchParams);

// //     if (searchTerm) {
// //       params.set("search", searchTerm);
// //     } else {
// //       params.delete("search");
// //     }

// //     if (statusFilter !== "ALL") {
// //       params.set("status", statusFilter);
// //     } else {
// //       params.delete("status");
// //     }

// //     params.set("page", pagination.page.toString());
// //     params.set("limit", pagination.limit.toString());

// //     router.replace(`?${params.toString()}`);
// //   }, [
// //     searchTerm,
// //     statusFilter,
// //     pagination.page,
// //     pagination.limit,
// //     router,
// //     searchParams,
// //   ]);

// //   // Bulk operations
// //   const handleBulkAction = async (
// //     action: "delete" | "update-status" | "feature",
// //     data?: any,
// //   ) => {
// //     if (selectedStores.length === 0) {
// //       toast.error("Please select stores to perform this action");
// //       return;
// //     }

// //     try {
// //       setBulkLoading(true);

// //       const response = await fetch("/api/oneshop/admin/stores/bulk", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           action,
// //           storeIds: selectedStores,
// //           data,
// //         }),
// //       });

// //       const result = await response.json();

// //       if (result.success) {
// //         toast.success(result.message);
// //         setSelectedStores([]);
// //         fetchStores();
// //         fetchStats();
// //       } else {
// //         toast.error(result.message);
// //       }
// //     } catch (error) {
// //       console.error("Error performing bulk action:", error);
// //       toast.error("Error performing bulk action");
// //     } finally {
// //       setBulkLoading(false);
// //     }
// //   };

// //   // Handle store deletion
// //   const handleDeleteStore = async (storeId: string, storeName: string) => {
// //     if (!confirm(`Are you sure you want to delete "${storeName}"?`)) return;

// //     try {
// //       const response = await fetch(`/api/oneshop/admin/stores/${storeId}`, {
// //         method: "DELETE",
// //       });

// //       const data = await response.json();

// //       if (data.success) {
// //         toast.success("Store deleted successfully");
// //         fetchStores();
// //         fetchStats();
// //       } else {
// //         toast.error(data.message);
// //       }
// //     } catch (error) {
// //       console.error("Error deleting store:", error);
// //       toast.error("Error deleting store");
// //     }
// //   };

// //   // Handle status change
// //   const handleStatusChange = async (
// //     storeId: string,
// //     newStatus: StoreStatus,
// //   ) => {
// //     try {
// //       const response = await fetch(`/api/oneshop/admin/stores/${storeId}`, {
// //         method: "PATCH",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ status: newStatus }),
// //       });

// //       const data = await response.json();

// //       if (data.success) {
// //         toast.success("Store status updated");
// //         fetchStores();
// //       } else {
// //         toast.error(data.message);
// //       }
// //     } catch (error) {
// //       console.error("Error updating store status:", error);
// //       toast.error("Error updating store status");
// //     }
// //   };

// //   // Handle pagination
// //   const handlePageChange = (newPage: number) => {
// //     setPagination((prev) => ({ ...prev, page: newPage }));
// //   };

// //   // Handle search
// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setPagination((prev) => ({ ...prev, page: 1 }));
// //   };

// //   // Select all stores
// //   const handleSelectAll = () => {
// //     if (selectedStores.length === stores.length) {
// //       setSelectedStores([]);
// //     } else {
// //       setSelectedStores(stores.map((store) => store.id));
// //     }
// //   };

// //   // Export stores
// //   const handleExport = () => {
// //     // Simple CSV export
// //     const headers = [
// //       "ID",
// //       "Name",
// //       "Email",
// //       "URL",
// //       "Status",
// //       "Products",
// //       "Followers",
// //       "Owner",
// //       "Created At",
// //     ];
// //     const csvData = stores.map((store) => [
// //       store.id,
// //       store.name,
// //       store.email,
// //       store.url,
// //       store.status,
// //       store.productCount,
// //       store.followerCount,
// //       store.owner.username,
// //       new Date(store.createdAt).toLocaleDateString(),
// //     ]);

// //     const csvContent = [
// //       headers.join(","),
// //       ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
// //     ].join("\n");

// //     const blob = new Blob([csvContent], { type: "text/csv" });
// //     const url = window.URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = `stores-${new Date().toISOString().split("T")[0]}.csv`;
// //     a.click();
// //     window.URL.revokeObjectURL(url);
// //   };

// //   // Status options for filter
// //   const statusOptions = [
// //     { value: "ALL", label: "All Status" },
// //     { value: "ACTIVE", label: "Active" },
// //     { value: "PENDING", label: "Pending" },
// //     { value: "BANNED", label: "Banned" },
// //     { value: "DISABLED", label: "Disabled" },
// //   ];

// //   // Status options for bulk update
// //   const bulkStatusOptions = [
// //     { value: "ACTIVE", label: "Active" },
// //     { value: "PENDING", label: "Pending" },
// //     { value: "BANNED", label: "Banned" },
// //     { value: "DISABLED", label: "Disabled" },
// //   ];

// //   return (
// //     <Fragment>
// //       <div className="main-content">
// //         {/* Header */}
// //         <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4">
// //           <div className="container">
// //             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// //               <div>
// //                 <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
// //                   Stores Management
// //                 </h1>
// //                 <p className="text-gray-600 dark:text-gray-400 mt-1">
// //                   Manage and monitor all stores in the platform
// //                 </p>
// //               </div>
// //               <div className="flex items-center gap-3">
// //                 <button
// //                   onClick={handleExport}
// //                   disabled={loading || stores.length === 0}
// //                   className="ti-btn ti-btn-outline-light flex items-center gap-2"
// //                 >
// //                   <Download className="w-4 h-4" />
// //                   Export
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Stats Cards */}
// //         <div className="section">
// //           <div className="container">
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //               {/* Total Stores */}
// //               <div className="box p-4">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-gray-600 dark:text-gray-400">
// //                       Total Stores
// //                     </p>
// //                     <h3 className="text-2xl font-bold mt-1">
// //                       {statsLoading
// //                         ? "..."
// //                         : stats?.totalStores.toLocaleString()}
// //                     </h3>
// //                   </div>
// //                   <div className="p-3 rounded-lg bg-primary/10 text-primary">
// //                     <Package className="w-6 h-6" />
// //                   </div>
// //                 </div>
// //                 <div className="mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-gray-600 dark:text-gray-400">
// //                       Active
// //                     </span>
// //                     <span className="font-semibold">
// //                       {statsLoading ? "..." : stats?.storesByStatus.ACTIVE || 0}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* New Stores Today */}
// //               <div className="box p-4">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-gray-600 dark:text-gray-400">
// //                       New Today
// //                     </p>
// //                     <h3 className="text-2xl font-bold mt-1">
// //                       {statsLoading ? "..." : stats?.newStoresToday}
// //                     </h3>
// //                   </div>
// //                   <div className="p-3 rounded-lg bg-success/10 text-success">
// //                     <TrendingUp className="w-6 h-6" />
// //                   </div>
// //                 </div>
// //                 <div className="mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-gray-600 dark:text-gray-400">
// //                       This Week
// //                     </span>
// //                     <span className="font-semibold">
// //                       {statsLoading ? "..." : stats?.newStoresThisWeek}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Average Rating */}
// //               <div className="box p-4">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-gray-600 dark:text-gray-400">
// //                       Avg Rating
// //                     </p>
// //                     <h3 className="text-2xl font-bold mt-1">
// //                       {statsLoading ? "..." : stats?.averageRating.toFixed(1)}
// //                     </h3>
// //                   </div>
// //                   <div className="p-3 rounded-lg bg-warning/10 text-warning">
// //                     <Star className="w-6 h-6" />
// //                   </div>
// //                 </div>
// //                 <div className="mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-gray-600 dark:text-gray-400">
// //                       Featured
// //                     </span>
// //                     <span className="font-semibold">
// //                       {statsLoading ? "..." : stats?.featuredStoresCount}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Total Followers */}
// //               <div className="box p-4">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-sm text-gray-600 dark:text-gray-400">
// //                       This Month
// //                     </p>
// //                     <h3 className="text-2xl font-bold mt-1">
// //                       {statsLoading ? "..." : stats?.newStoresThisMonth}
// //                     </h3>
// //                   </div>
// //                   <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
// //                     <Users className="w-6 h-6" />
// //                   </div>
// //                 </div>
// //                 <div className="mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-gray-600 dark:text-gray-400">
// //                       Pending
// //                     </span>
// //                     <span className="font-semibold">
// //                       {statsLoading
// //                         ? "..."
// //                         : stats?.storesByStatus.PENDING || 0}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Filters and Bulk Actions */}
// //         <div className="section !pt-0">
// //           <div className="container">
// //             <div className="box">
// //               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4">
// //                 {/* Search and Filter */}
// //                 <div className="flex flex-col sm:flex-row gap-3">
// //                   <form onSubmit={handleSearch} className="flex gap-2">
// //                     <div className="relative flex-1">
// //                       {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
// //                       <input
// //                         type="text"
// //                         placeholder="Search stores..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         className="ti-form-control ps-10"
// //                       />
// //                     </div>
// //                     <button
// //                       type="submit"
// //                       className="ti-btn ti-btn-primary"
// //                       disabled={loading}
// //                     >
// //                       Search
// //                     </button>
// //                     {searchTerm && (
// //                       <button
// //                         type="button"
// //                         onClick={() => setSearchTerm("")}
// //                         className="ti-btn ti-btn-outline-light"
// //                       >
// //                         Clear
// //                       </button>
// //                     )}
// //                   </form>

// //                   <div className="w-full sm:w-auto">
// //                     <select
// //                       value={statusFilter}
// //                       onChange={(e) => {
// //                         setStatusFilter(e.target.value as StoreStatus | "ALL");
// //                         setPagination((prev) => ({ ...prev, page: 1 }));
// //                       }}
// //                       className="ti-form-control appearance-none bg-none"
// //                     >
// //                       {statusOptions.map((option) => (
// //                         <option key={option.value} value={option.value}>
// //                           {option.label}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                 </div>

// //                 {/* Bulk Actions */}
// //                 {selectedStores.length > 0 && (
// //                   <div className="flex items-center gap-3">
// //                     <span className="text-sm text-gray-600 dark:text-gray-400">
// //                       {selectedStores.length} selected
// //                     </span>
// //                     <select
// //                       value=""
// //                       onChange={(e) => {
// //                         const action = e.target.value;
// //                         if (action === "delete") {
// //                           if (
// //                             confirm(`Delete ${selectedStores.length} stores?`)
// //                           ) {
// //                             handleBulkAction("delete");
// //                           }
// //                         } else if (action.startsWith("status-")) {
// //                           const status = action.replace(
// //                             "status-",
// //                             "",
// //                           ) as StoreStatus;
// //                           handleBulkAction("update-status", { status });
// //                         } else if (action === "feature") {
// //                           handleBulkAction("feature", { featured: true });
// //                         } else if (action === "unfeature") {
// //                           handleBulkAction("feature", { featured: false });
// //                         }
// //                         e.target.value = "";
// //                       }}
// //                       disabled={bulkLoading}
// //                       className="ti-form-control"
// //                     >
// //                       <option value="">Bulk Actions</option>
// //                       <optgroup label="Update Status">
// //                         {bulkStatusOptions.map((option) => (
// //                           <option
// //                             key={option.value}
// //                             value={`status-${option.value}`}
// //                           >
// //                             Set as {option.label}
// //                           </option>
// //                         ))}
// //                       </optgroup>
// //                       <optgroup label="Featured">
// //                         <option value="feature">Mark as Featured</option>
// //                         <option value="unfeature">Remove Featured</option>
// //                       </optgroup>
// //                       <optgroup label="Danger">
// //                         <option value="delete" className="text-danger">
// //                           Delete Selected
// //                         </option>
// //                       </optgroup>
// //                     </select>
// //                     <button
// //                       onClick={() => setSelectedStores([])}
// //                       className="ti-btn ti-btn-outline-light"
// //                     >
// //                       Clear
// //                     </button>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Stores Table */}
// //         <div className="section !pt-0">
// //           <div className="container">
// //             <div className="box">
// //               {loading ? (
// //                 <div className="flex justify-center items-center py-12">
// //                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
// //                 </div>
// //               ) : stores.length === 0 ? (
// //                 <div className="text-center py-12">
// //                   <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
// //                   <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
// //                     No stores found
// //                   </h3>
// //                   <p className="text-gray-500 dark:text-gray-400 mb-6">
// //                     {searchTerm || statusFilter !== "ALL"
// //                       ? "Try changing your filters"
// //                       : "Get started by creating a new store"}
// //                   </p>
// //                   {searchTerm || statusFilter !== "ALL" ? (
// //                     <button
// //                       onClick={() => {
// //                         setSearchTerm("");
// //                         setStatusFilter("ALL");
// //                       }}
// //                       className="ti-btn ti-btn-primary"
// //                     >
// //                       Clear Filters
// //                     </button>
// //                   ) : (
// //                     <Link
// //                       href="/admin/stores/new"
// //                       className="ti-btn ti-btn-primary"
// //                     >
// //                       <Plus className="w-4 h-4 mr-2" />
// //                       Add Store
// //                     </Link>
// //                   )}
// //                 </div>
// //               ) : (
// //                 <>
// //                   <div className="overflow-x-auto">
// //                     <table className="ti-custom-table ti-custom-table-head">
// //                       <thead>
// //                         <tr>
// //                           <th scope="col" className="w-12">
// //                             <input
// //                               type="checkbox"
// //                               checked={
// //                                 stores.length > 0 &&
// //                                 selectedStores.length === stores.length
// //                               }
// //                               onChange={handleSelectAll}
// //                               className="ti-form-checkbox"
// //                             />
// //                           </th>
// //                           <th scope="col">Store</th>
// //                           <th scope="col">Owner</th>
// //                           <th scope="col">Status</th>
// //                           <th scope="col">Products</th>
// //                           <th scope="col">Followers</th>
// //                           <th scope="col">Rating</th>
// //                           <th scope="col">Created</th>
// //                           <th scope="col" className="text-right">
// //                             Actions
// //                           </th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {stores.map((store) => (
// //                           <tr
// //                             key={store.id}
// //                             className="hover:bg-gray-50 dark:hover:bg-black/20"
// //                           >
// //                             <td>
// //                               <input
// //                                 type="checkbox"
// //                                 checked={selectedStores.includes(store.id)}
// //                                 onChange={(e) => {
// //                                   if (e.target.checked) {
// //                                     setSelectedStores((prev) => [
// //                                       ...prev,
// //                                       store.id,
// //                                     ]);
// //                                   } else {
// //                                     setSelectedStores((prev) =>
// //                                       prev.filter((id) => id !== store.id),
// //                                     );
// //                                   }
// //                                 }}
// //                                 className="ti-form-checkbox"
// //                               />
// //                             </td>
// //                             <td>
// //                               <div className="flex items-center gap-3">
// //                                 <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
// //                                   <Image
// //                                     src={
// //                                       store.logo || "/default-store-logo.png"
// //                                     }
// //                                     alt={store.name}
// //                                     width={40}
// //                                     height={40}
// //                                     className="object-cover w-full h-full"
// //                                   />
// //                                 </div>
// //                                 <div>
// //                                   <div className="flex items-center gap-2">
// //                                     <Link
// //                                       href={`/admin/stores/${store.id}`}
// //                                       className="font-medium text-gray-800 dark:text-white hover:text-primary transition-colors"
// //                                     >
// //                                       {store.name}
// //                                     </Link>
// //                                     <FeaturedBadge featured={store.featured} />
// //                                   </div>
// //                                   <div className="text-sm text-gray-600 dark:text-gray-400">
// //                                     {store.email}
// //                                   </div>
// //                                   <div className="text-xs text-gray-500 dark:text-gray-500">
// //                                     /{store.url}
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             </td>
// //                             <td>
// //                               <div>
// //                                 <div className="font-medium text-gray-800 dark:text-white">
// //                                   {store.owner.username}
// //                                 </div>
// //                                 <div className="text-sm text-gray-600 dark:text-gray-400">
// //                                   {store.owner.email}
// //                                 </div>
// //                               </div>
// //                             </td>
// //                             <td>
// //                               <StatusBadge status={store.status} />
// //                             </td>
// //                             <td>
// //                               <div className="font-medium">
// //                                 {store.productCount.toLocaleString()}
// //                               </div>
// //                             </td>
// //                             <td>
// //                               <div className="flex items-center gap-1">
// //                                 <Users className="w-4 h-4 text-gray-400" />
// //                                 <span className="font-medium">
// //                                   {store.followerCount.toLocaleString()}
// //                                 </span>
// //                               </div>
// //                             </td>
// //                             <td>
// //                               <div className="flex items-center gap-1">
// //                                 <Star className="w-4 h-4 text-warning fill-current" />
// //                                 <span className="font-medium">
// //                                   {store.averageRating.toFixed(1)}
// //                                 </span>
// //                               </div>
// //                             </td>
// //                             <td>
// //                               <div className="text-sm text-gray-600 dark:text-gray-400">
// //                                 {new Date(store.createdAt).toLocaleDateString()}
// //                               </div>
// //                             </td>
// //                             <td>
// //                               <div className="flex items-center justify-end gap-2">
// //                                 <Link
// //                                   href={`/admin/stores/${store.id}`}
// //                                   className="ti-btn ti-btn-outline-light ti-btn-sm"
// //                                   title="View"
// //                                 >
// //                                   <Eye className="w-4 h-4" />
// //                                 </Link>
// //                                 <Link
// //                                   href={`/admin/stores/${store.id}/edit`}
// //                                   className="ti-btn ti-btn-outline-light ti-btn-sm"
// //                                   title="Edit"
// //                                 >
// //                                   <Edit className="w-4 h-4" />
// //                                 </Link>
// //                                 <button
// //                                   onClick={() =>
// //                                     handleDeleteStore(store.id, store.name)
// //                                   }
// //                                   className="ti-btn ti-btn-outline-light ti-btn-sm hover:bg-danger/10 hover:text-danger"
// //                                   title="Delete"
// //                                 >
// //                                   <Trash2 className="w-4 h-4" />
// //                                 </button>
// //                                 <div className="relative">
// //                                   <button
// //                                     className="ti-btn ti-btn-outline-light ti-btn-sm"
// //                                     title="More options"
// //                                   >
// //                                     <MoreVertical className="w-4 h-4" />
// //                                   </button>
// //                                   <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-defaultborder dark:border-defaultborder/10 z-10 hidden group-hover:block">
// //                                     <div className="py-1">
// //                                       <button
// //                                         onClick={() =>
// //                                           handleStatusChange(
// //                                             store.id,
// //                                             store.status === "ACTIVE"
// //                                               ? "DISABLED"
// //                                               : "ACTIVE",
// //                                           )
// //                                         }
// //                                         className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
// //                                       >
// //                                         {store.status === "ACTIVE"
// //                                           ? "Disable Store"
// //                                           : "Activate Store"}
// //                                       </button>
// //                                       <button
// //                                         onClick={() =>
// //                                           handleStatusChange(
// //                                             store.id,
// //                                             store.status === "BANNED"
// //                                               ? "ACTIVE"
// //                                               : "BANNED",
// //                                           )
// //                                         }
// //                                         className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
// //                                       >
// //                                         {store.status === "BANNED"
// //                                           ? "Unban Store"
// //                                           : "Ban Store"}
// //                                       </button>
// //                                       <Link
// //                                         href={`/stores/${store.url}`}
// //                                         target="_blank"
// //                                         className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
// //                                       >
// //                                         Visit Store
// //                                       </Link>
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                     </table>
// //                   </div>

// //                   {/* Pagination */}
// //                   {pagination.pages > 1 && (
// //                     <div className="flex items-center justify-between mt-6 pt-6 border-t border-defaultborder dark:border-defaultborder/10 p-3">
// //                       <div className="text-sm text-gray-600 dark:text-gray-400">
// //                         Showing {(pagination.page - 1) * pagination.limit + 1}{" "}
// //                         to{" "}
// //                         {Math.min(
// //                           pagination.page * pagination.limit,
// //                           pagination.total,
// //                         )}{" "}
// //                         of {pagination.total} stores
// //                       </div>
// //                       <div className="flex gap-2">
// //                         <button
// //                           onClick={() => handlePageChange(pagination.page - 1)}
// //                           disabled={pagination.page === 1 || loading}
// //                           className="ti-btn ti-btn-outline-light ti-btn-sm"
// //                         >
// //                           Previous
// //                         </button>
// //                         {Array.from(
// //                           { length: Math.min(5, pagination.pages) },
// //                           (_, i) => {
// //                             let pageNum;
// //                             if (pagination.pages <= 5) {
// //                               pageNum = i + 1;
// //                             } else if (pagination.page <= 3) {
// //                               pageNum = i + 1;
// //                             } else if (
// //                               pagination.page >=
// //                               pagination.pages - 2
// //                             ) {
// //                               pageNum = pagination.pages - 4 + i;
// //                             } else {
// //                               pageNum = pagination.page - 2 + i;
// //                             }

// //                             return (
// //                               <button
// //                                 key={pageNum}
// //                                 onClick={() => handlePageChange(pageNum)}
// //                                 disabled={loading}
// //                                 className={`ti-btn ti-btn-sm ${
// //                                   pagination.page === pageNum
// //                                     ? "ti-btn-primary"
// //                                     : "ti-btn-outline-light"
// //                                 }`}
// //                               >
// //                                 {pageNum}
// //                               </button>
// //                             );
// //                           },
// //                         )}
// //                         <button
// //                           onClick={() => handlePageChange(pagination.page + 1)}
// //                           disabled={
// //                             pagination.page === pagination.pages || loading
// //                           }
// //                           className="ti-btn ti-btn-outline-light ti-btn-sm"
// //                         >
// //                           Next
// //                         </button>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </Fragment>
// //   );
// // }

















// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { Fragment } from "react";
// import dynamic from "next/dynamic";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   StoreStatus,
//   Search,
//   Filter,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   Check,
//   X,
//   Star,
//   Users,
//   Package,
//   TrendingUp,
//   AlertCircle,
//   Download,
//   RefreshCw,
//   MoreVertical,
//   Shield,
// } from "lucide-react";
// import toast from "react-hot-toast";

// // Types
// interface Store {
//   id: string;
//   name: string;
//   email: string;
//   url: string;
//   status: StoreStatus;
//   logo: string;
//   cover: string;
//   featured: boolean;
//   averageRating: number;
//   productCount: number;
//   followerCount: number;
//   owner: {
//     id: string;
//     username: string;
//     email: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// interface Pagination {
//   page: number;
//   limit: number;
//   total: number;
//   pages: number;
// }

// interface StoreStats {
//   totalStores: number;
//   storesByStatus: Record<string, number>;
//   newStoresToday: number;
//   newStoresThisWeek: number;
//   newStoresThisMonth: number;
//   featuredStoresCount: number;
//   averageRating: number;
//   topStoresByProducts: Array<{
//     id: string;
//     name: string;
//     owner: string;
//     productCount: number;
//     followerCount: number;
//   }>;
//   topStoresByFollowers: Array<{
//     id: string;
//     name: string;
//     owner: string;
//     productCount: number;
//     followerCount: number;
//   }>;
// }

// // Status badge component
// const StatusBadge = ({ status }: { status: StoreStatus }) => {
//   const getStatusConfig = (status: StoreStatus) => {
//     switch (status) {
//       case "ACTIVE":
//         return {
//           className: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
//           icon: <Check className="w-3 h-3" />,
//           text: "Active",
//         };
//       case "PENDING":
//         return {
//           className: "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
//           icon: <AlertCircle className="w-3 h-3" />,
//           text: "Pending",
//         };
//       case "BANNED":
//         return {
//           className: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
//           icon: <X className="w-3 h-3" />,
//           text: "Banned",
//         };
//       case "DISABLED":
//         return {
//           className: "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
//           icon: <Shield className="w-3 h-3" />,
//           text: "Disabled",
//         };
//       default:
//         return {
//           className: "bg-gray-500/10 text-gray-600",
//           icon: null,
//           text: status,
//         };
//     }
//   };

//   const config = getStatusConfig(status);

//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
//     >
//       {config.icon}
//       {config.text}
//     </span>
//   );
// };

// // Featured badge component
// const FeaturedBadge = ({ featured }: { featured: boolean }) => {
//   if (!featured) return null;

//   return (
//     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
//       <Star className="w-3 h-3" />
//       Featured
//     </span>
//   );
// };

// // Main component
// export default function AdminStoresPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // State
//   const [stores, setStores] = useState<Store[]>([]);
//   const [selectedStores, setSelectedStores] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [statsLoading, setStatsLoading] = useState(true);
//   const [bulkLoading, setBulkLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState(
//     searchParams.get("search") || "",
//   );
//   const [statusFilter, setStatusFilter] = useState<StoreStatus | "ALL">(
//     (searchParams.get("status") as StoreStatus) || "ALL",
//   );
//   const [stats, setStats] = useState<StoreStats | null>(null);

//   // Edit modal state
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedStore, setSelectedStore] = useState<Store | null>(null);
//   const [editFormData, setEditFormData] = useState({
//     id: "",
//     name: "",
//     email: "",
//     url: "",
//     status: "PENDING" as StoreStatus,
//     featured: false,
//   });
//   const [editLoading, setEditLoading] = useState(false);
//   const [logoPreview, setLogoPreview] = useState("");
//   const [coverPreview, setCoverPreview] = useState("");
//   const [uploadingLogo, setUploadingLogo] = useState(false);
//   const [uploadingCover, setUploadingCover] = useState(false);

//   // Pagination
//   const [pagination, setPagination] = useState<Pagination>({
//     page: parseInt(searchParams.get("page") || "1"),
//     limit: parseInt(searchParams.get("limit") || "10"),
//     total: 0,
//     pages: 0,
//   });

//   // Fetch stores
//   const fetchStores = useCallback(async () => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams({
//         page: pagination.page.toString(),
//         limit: pagination.limit.toString(),
//         ...(searchTerm && { search: searchTerm }),
//         ...(statusFilter !== "ALL" && { status: statusFilter }),
//         sortBy: "createdAt",
//         sortOrder: "desc",
//       });

//       const response = await fetch(`/api/oneshop/admin/stores?${params}`);
//       const data = await response.json();

//       if (data.success) {
//         setStores(data.data);
//         setPagination(data.pagination);
//       } else {
//         toast.error(data.message || "Failed to fetch stores");
//       }
//     } catch (error) {
//       console.error("Error fetching stores:", error);
//       toast.error("Error fetching stores");
//     } finally {
//       setLoading(false);
//     }
//   }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

//   // Fetch statistics
//   const fetchStats = useCallback(async () => {
//     try {
//       setStatsLoading(true);
//       const response = await fetch("/api/oneshop/admin/stores/stats");
//       const data = await response.json();

//       if (data.success) {
//         setStats(data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//     } finally {
//       setStatsLoading(false);
//     }
//   }, []);

//   // Initial fetch
//   useEffect(() => {
//     fetchStores();
//     fetchStats();
//   }, [fetchStores, fetchStats]);

//   // Update URL when filters change
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams);

//     if (searchTerm) {
//       params.set("search", searchTerm);
//     } else {
//       params.delete("search");
//     }

//     if (statusFilter !== "ALL") {
//       params.set("status", statusFilter);
//     } else {
//       params.delete("status");
//     }

//     params.set("page", pagination.page.toString());
//     params.set("limit", pagination.limit.toString());

//     router.replace(`?${params.toString()}`);
//   }, [
//     searchTerm,
//     statusFilter,
//     pagination.page,
//     pagination.limit,
//     router,
//     searchParams,
//   ]);

//   // Open edit modal
//   const openEditModal = (store: Store) => {
//     setSelectedStore(store);
//     setEditFormData({
//       id: store.id,
//       name: store.name,
//       email: store.email,
//       url: store.url,
//       status: store.status,
//       featured: store.featured,
//     });
//     setLogoPreview(store.logo || "");
//     setCoverPreview(store.cover || "");
//     setEditModalOpen(true);
//   };

//   // Handle edit form input change
//   const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     setEditFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
//     }));
//   };

//   // Handle logo upload
//   const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setLogoPreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);

//     // Upload
//     setUploadingLogo(true);
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('type', 'store-logo');

//     try {
//       const response = await fetch('/api/oneshop/admin/upload', {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await response.json();
//       if (data.success) {
//         setEditFormData(prev => ({ ...prev, logo: data.url }));
//         toast.success('Logo uploaded successfully');
//       } else {
//         toast.error('Failed to upload logo');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload logo');
//     } finally {
//       setUploadingLogo(false);
//     }
//   };

//   // Handle cover upload
//   const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setCoverPreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);

//     // Upload
//     setUploadingCover(true);
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('type', 'store-cover');

//     try {
//       const response = await fetch('/api/oneshop/admin/upload', {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await response.json();
//       if (data.success) {
//         setEditFormData(prev => ({ ...prev, cover: data.url }));
//         toast.success('Cover uploaded successfully');
//       } else {
//         toast.error('Failed to upload cover');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload cover');
//     } finally {
//       setUploadingCover(false);
//     }
//   };

//   // Update store
//   const updateStore = async () => {
//     if (!editFormData.name.trim()) {
//       toast.error('Store name is required');
//       return;
//     }
//     if (!editFormData.email.trim()) {
//       toast.error('Store email is required');
//       return;
//     }
//     if (!editFormData.url.trim()) {
//       toast.error('Store URL is required');
//       return;
//     }

//     setEditLoading(true);
//     try {
//       const response = await fetch(`/api/oneshop/admin/stores/${editFormData.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: editFormData.name,
//           email: editFormData.email,
//           url: editFormData.url,
//           status: editFormData.status,
//           featured: editFormData.featured,
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success('Store updated successfully');
//         setEditModalOpen(false);
//         fetchStores();
//         fetchStats();
//       } else {
//         toast.error(data.message || 'Failed to update store');
//       }
//     } catch (error) {
//       console.error('Error updating store:', error);
//       toast.error('Failed to update store');
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   // Bulk operations
//   const handleBulkAction = async (
//     action: "delete" | "update-status" | "feature",
//     data?: any,
//   ) => {
//     if (selectedStores.length === 0) {
//       toast.error("Please select stores to perform this action");
//       return;
//     }

//     try {
//       setBulkLoading(true);

//       const response = await fetch("/api/oneshop/admin/stores/bulk", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           action,
//           storeIds: selectedStores,
//           data,
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         toast.success(result.message);
//         setSelectedStores([]);
//         fetchStores();
//         fetchStats();
//       } else {
//         toast.error(result.message);
//       }
//     } catch (error) {
//       console.error("Error performing bulk action:", error);
//       toast.error("Error performing bulk action");
//     } finally {
//       setBulkLoading(false);
//     }
//   };

//   // Handle store deletion
//   const handleDeleteStore = async (storeId: string, storeName: string) => {
//     if (!confirm(`Are you sure you want to delete "${storeName}"?`)) return;

//     try {
//       const response = await fetch(`/api/oneshop/admin/stores/${storeId}`, {
//         method: "DELETE",
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success("Store deleted successfully");
//         fetchStores();
//         fetchStats();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error("Error deleting store:", error);
//       toast.error("Error deleting store");
//     }
//   };

//   // Handle status change
//   const handleStatusChange = async (
//     storeId: string,
//     newStatus: StoreStatus,
//   ) => {
//     try {
//       const response = await fetch(`/api/oneshop/admin/stores/${storeId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success("Store status updated");
//         fetchStores();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error("Error updating store status:", error);
//       toast.error("Error updating store status");
//     }
//   };

//   // Handle pagination
//   const handlePageChange = (newPage: number) => {
//     setPagination((prev) => ({ ...prev, page: newPage }));
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Handle search
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   // Select all stores
//   const handleSelectAll = () => {
//     if (selectedStores.length === stores.length) {
//       setSelectedStores([]);
//     } else {
//       setSelectedStores(stores.map((store) => store.id));
//     }
//   };

//   // Export stores
//   const handleExport = () => {
//     const headers = [
//       "ID",
//       "Name",
//       "Email",
//       "URL",
//       "Status",
//       "Products",
//       "Followers",
//       "Owner",
//       "Created At",
//     ];
//     const csvData = stores.map((store) => [
//       store.id,
//       store.name,
//       store.email,
//       store.url,
//       store.status,
//       store.productCount,
//       store.followerCount,
//       store.owner.username,
//       new Date(store.createdAt).toLocaleDateString(),
//     ]);

//     const csvContent = [
//       headers.join(","),
//       ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `stores-${new Date().toISOString().split("T")[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   // Status options
//   const statusOptions = [
//     { value: "ALL", label: "All Status" },
//     { value: "ACTIVE", label: "Active" },
//     { value: "PENDING", label: "Pending" },
//     { value: "BANNED", label: "Banned" },
//     { value: "DISABLED", label: "Disabled" },
//   ];

//   const bulkStatusOptions = [
//     { value: "ACTIVE", label: "Active" },
//     { value: "PENDING", label: "Pending" },
//     { value: "BANNED", label: "Banned" },
//     { value: "DISABLED", label: "Disabled" },
//   ];

//   return (
//     <Fragment>
//       <div className="main-content">
//         {/* Header */}
//         <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4">
//           <div className="container px-4 sm:px-6 lg:px-8">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//                   Stores Management
//                 </h1>
//                 <p className="text-gray-600 dark:text-gray-400 mt-1">
//                   Manage and monitor all stores in the platform
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={handleExport}
//                   disabled={loading || stores.length === 0}
//                   className="ti-btn ti-btn-outline-light flex items-center gap-2"
//                 >
//                   <Download className="w-4 h-4" />
//                   Export
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="section">
//           <div className="container px-4 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//               {/* Total Stores */}
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       Total Stores
//                     </p>
//                     <h3 className="text-2xl font-bold mt-1">
//                       {statsLoading
//                         ? "..."
//                         : stats?.totalStores.toLocaleString()}
//                     </h3>
//                   </div>
//                   <div className="p-3 rounded-lg bg-primary/10 text-primary">
//                     <Package className="w-6 h-6" />
//                   </div>
//                 </div>
//                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600 dark:text-gray-400">
//                       Active
//                     </span>
//                     <span className="font-semibold">
//                       {statsLoading ? "..." : stats?.storesByStatus.ACTIVE || 0}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* New Stores Today */}
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       New Today
//                     </p>
//                     <h3 className="text-2xl font-bold mt-1">
//                       {statsLoading ? "..." : stats?.newStoresToday}
//                     </h3>
//                   </div>
//                   <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
//                     <TrendingUp className="w-6 h-6" />
//                   </div>
//                 </div>
//                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600 dark:text-gray-400">
//                       This Week
//                     </span>
//                     <span className="font-semibold">
//                       {statsLoading ? "..." : stats?.newStoresThisWeek}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Average Rating */}
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       Avg Rating
//                     </p>
//                     <h3 className="text-2xl font-bold mt-1">
//                       {statsLoading ? "..." : stats?.averageRating.toFixed(1)}
//                     </h3>
//                   </div>
//                   <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
//                     <Star className="w-6 h-6" />
//                   </div>
//                 </div>
//                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600 dark:text-gray-400">
//                       Featured
//                     </span>
//                     <span className="font-semibold">
//                       {statsLoading ? "..." : stats?.featuredStoresCount}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* New Stores This Month */}
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       This Month
//                     </p>
//                     <h3 className="text-2xl font-bold mt-1">
//                       {statsLoading ? "..." : stats?.newStoresThisMonth}
//                     </h3>
//                   </div>
//                   <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
//                     <Users className="w-6 h-6" />
//                   </div>
//                 </div>
//                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600 dark:text-gray-400">
//                       Pending
//                     </span>
//                     <span className="font-semibold">
//                       {statsLoading
//                         ? "..."
//                         : stats?.storesByStatus.PENDING || 0}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Bulk Actions */}
//         <div className="section !pt-0">
//           <div className="container px-4 sm:px-6 lg:px-8">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4">
//                 {/* Search and Filter */}
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <form onSubmit={handleSearch} className="flex gap-2">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="Search stores..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="ti-form-control w-full sm:w-64"
//                       />
//                     </div>
//                     <button
//                       type="submit"
//                       className="ti-btn ti-btn-primary"
//                       disabled={loading}
//                     >
//                       Search
//                     </button>
//                     {searchTerm && (
//                       <button
//                         type="button"
//                         onClick={() => setSearchTerm("")}
//                         className="ti-btn ti-btn-outline-light"
//                       >
//                         Clear
//                       </button>
//                     )}
//                   </form>

//                   <select
//                     value={statusFilter}
//                     onChange={(e) => {
//                       setStatusFilter(e.target.value as StoreStatus | "ALL");
//                       setPagination((prev) => ({ ...prev, page: 1 }));
//                     }}
//                     className="ti-form-control w-full sm:w-40"
//                   >
//                     {statusOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Bulk Actions */}
//                 {selectedStores.length > 0 && (
//                   <div className="flex items-center gap-3 flex-wrap">
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       {selectedStores.length} selected
//                     </span>
//                     <select
//                       value=""
//                       onChange={(e) => {
//                         const action = e.target.value;
//                         if (action === "delete") {
//                           if (
//                             confirm(`Delete ${selectedStores.length} stores?`)
//                           ) {
//                             handleBulkAction("delete");
//                           }
//                         } else if (action.startsWith("status-")) {
//                           const status = action.replace(
//                             "status-",
//                             "",
//                           ) as StoreStatus;
//                           handleBulkAction("update-status", { status });
//                         } else if (action === "feature") {
//                           handleBulkAction("feature", { featured: true });
//                         } else if (action === "unfeature") {
//                           handleBulkAction("feature", { featured: false });
//                         }
//                         e.target.value = "";
//                       }}
//                       disabled={bulkLoading}
//                       className="ti-form-control"
//                     >
//                       <option value="">Bulk Actions</option>
//                       <optgroup label="Update Status">
//                         {bulkStatusOptions.map((option) => (
//                           <option
//                             key={option.value}
//                             value={`status-${option.value}`}
//                           >
//                             Set as {option.label}
//                           </option>
//                         ))}
//                       </optgroup>
//                       <optgroup label="Featured">
//                         <option value="feature">Mark as Featured</option>
//                         <option value="unfeature">Remove Featured</option>
//                       </optgroup>
//                       <optgroup label="Danger">
//                         <option value="delete" className="text-danger">
//                           Delete Selected
//                         </option>
//                       </optgroup>
//                     </select>
//                     <button
//                       onClick={() => setSelectedStores([])}
//                       className="ti-btn ti-btn-outline-light"
//                     >
//                       Clear
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stores Table */}
//         <div className="section !pt-0">
//           <div className="container px-4 sm:px-6 lg:px-8">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//               {loading ? (
//                 <div className="flex justify-center items-center py-12">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                 </div>
//               ) : stores.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                     No stores found
//                   </h3>
//                   <p className="text-gray-500 dark:text-gray-400 mb-6">
//                     {searchTerm || statusFilter !== "ALL"
//                       ? "Try changing your filters"
//                       : "Get started by creating a new store"}
//                   </p>
//                   {searchTerm || statusFilter !== "ALL" ? (
//                     <button
//                       onClick={() => {
//                         setSearchTerm("");
//                         setStatusFilter("ALL");
//                       }}
//                       className="ti-btn ti-btn-primary"
//                     >
//                       Clear Filters
//                     </button>
//                   ) : (
//                     <Link
//                       href="/admin/stores/new"
//                       className="ti-btn ti-btn-primary"
//                     >
//                       <Plus className="w-4 h-4 mr-2" />
//                       Add Store
//                     </Link>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
//                         <tr>
//                           <th className="px-4 py-3 text-left text-sm font-semibold w-12">
//                             <input
//                               type="checkbox"
//                               checked={
//                                 stores.length > 0 &&
//                                 selectedStores.length === stores.length
//                               }
//                               onChange={handleSelectAll}
//                               className="ti-form-checkbox"
//                             />
//                           </th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold">Store</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold hidden md:table-cell">Owner</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold hidden sm:table-cell">Products</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">Followers</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold hidden xl:table-cell">Rating</th>
//                           <th className="px-4 py-3 text-left text-sm font-semibold hidden 2xl:table-cell">Created</th>
//                           <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                         {stores.map((store) => (
//                           <tr
//                             key={store.id}
//                             className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
//                           >
//                             <td className="px-4 py-3">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedStores.includes(store.id)}
//                                 onChange={(e) => {
//                                   if (e.target.checked) {
//                                     setSelectedStores((prev) => [
//                                       ...prev,
//                                       store.id,
//                                     ]);
//                                   } else {
//                                     setSelectedStores((prev) =>
//                                       prev.filter((id) => id !== store.id),
//                                     );
//                                   }
//                                 }}
//                                 className="ti-form-checkbox"
//                               />
//                             </td>
//                             <td className="px-4 py-3">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
//                                   <Image
//                                     src={store.logo || "/default-store-logo.png"}
//                                     alt={store.name}
//                                     width={40}
//                                     height={40}
//                                     className="object-cover w-full h-full"
//                                   />
//                                 </div>
//                                 <div className="min-w-0">
//                                   <div className="flex items-center gap-2 flex-wrap">
//                                     <span className="font-medium text-gray-800 dark:text-white truncate max-w-[150px] sm:max-w-none">
//                                       {store.name}
//                                     </span>
//                                     <FeaturedBadge featured={store.featured} />
//                                   </div>
//                                   <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px] sm:max-w-none">
//                                     {store.email}
//                                   </div>
//                                   <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
//                                     /{store.url}
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-4 py-3 hidden md:table-cell">
//                               <div>
//                                 <div className="font-medium text-gray-800 dark:text-white">
//                                   {store.owner.username}
//                                 </div>
//                                 <div className="text-sm text-gray-600 dark:text-gray-400">
//                                   {store.owner.email}
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-4 py-3">
//                               <StatusBadge status={store.status} />
//                             </td>
//                             <td className="px-4 py-3 hidden sm:table-cell">
//                               <div className="font-medium">
//                                 {store.productCount.toLocaleString()}
//                               </div>
//                             </td>
//                             <td className="px-4 py-3 hidden lg:table-cell">
//                               <div className="flex items-center gap-1">
//                                 <Users className="w-4 h-4 text-gray-400" />
//                                 <span className="font-medium">
//                                   {store.followerCount.toLocaleString()}
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="px-4 py-3 hidden xl:table-cell">
//                               <div className="flex items-center gap-1">
//                                 <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                                 <span className="font-medium">
//                                   {store.averageRating.toFixed(1)}
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="px-4 py-3 hidden 2xl:table-cell">
//                               <div className="text-sm text-gray-600 dark:text-gray-400">
//                                 {new Date(store.createdAt).toLocaleDateString()}
//                               </div>
//                             </td>
//                             <td className="px-4 py-3 text-right">
//                               <div className="flex items-center justify-end gap-1 sm:gap-2">
//                                 <Link
//                                   href={`/admin/stores/${store.id}`}
//                                   className="ti-btn ti-btn-outline-light ti-btn-sm"
//                                   title="View"
//                                 >
//                                   <Eye className="w-4 h-4" />
//                                 </Link>
//                                 <button
//                                   onClick={() => openEditModal(store)}
//                                   className="ti-btn ti-btn-outline-light ti-btn-sm"
//                                   title="Edit"
//                                 >
//                                   <Edit className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                   onClick={() =>
//                                     handleDeleteStore(store.id, store.name)
//                                   }
//                                   className="ti-btn ti-btn-outline-light ti-btn-sm hover:bg-red-500/10 hover:text-red-500"
//                                   title="Delete"
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Pagination */}
//                   {pagination.pages > 1 && (
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
//                       <div className="text-sm text-gray-600 dark:text-gray-400">
//                         Showing {(pagination.page - 1) * pagination.limit + 1}{" "}
//                         to{" "}
//                         {Math.min(
//                           pagination.page * pagination.limit,
//                           pagination.total,
//                         )}{" "}
//                         of {pagination.total} stores
//                       </div>
//                       <div className="flex gap-1 flex-wrap justify-center">
//                         <button
//                           onClick={() => handlePageChange(pagination.page - 1)}
//                           disabled={pagination.page === 1 || loading}
//                           className="ti-btn ti-btn-outline-light ti-btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Previous
//                         </button>
//                         {Array.from(
//                           { length: Math.min(5, pagination.pages) },
//                           (_, i) => {
//                             let pageNum;
//                             if (pagination.pages <= 5) {
//                               pageNum = i + 1;
//                             } else if (pagination.page <= 3) {
//                               pageNum = i + 1;
//                             } else if (
//                               pagination.page >=
//                               pagination.pages - 2
//                             ) {
//                               pageNum = pagination.pages - 4 + i;
//                             } else {
//                               pageNum = pagination.page - 2 + i;
//                             }

//                             return (
//                               <button
//                                 key={pageNum}
//                                 onClick={() => handlePageChange(pageNum)}
//                                 disabled={loading}
//                                 className={`ti-btn ti-btn-sm ${
//                                   pagination.page === pageNum
//                                     ? "ti-btn-primary"
//                                     : "ti-btn-outline-light"
//                                 }`}
//                               >
//                                 {pageNum}
//                               </button>
//                             );
//                           },
//                         )}
//                         <button
//                           onClick={() => handlePageChange(pagination.page + 1)}
//                           disabled={
//                             pagination.page === pagination.pages || loading
//                           }
//                           className="ti-btn ti-btn-outline-light ti-btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           Next
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* EDIT STORE MODAL - Responsive */}
//       {editModalOpen && selectedStore && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
//           <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-auto my-8">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
//                   <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <div>
//                   <h5 className="font-semibold text-xl">Edit Store</h5>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     Update store information
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setEditModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="p-6 space-y-6">
//               {/* Store Logo */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">Store Logo</label>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                   <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
//                     {logoPreview ? (
//                       <Image
//                         src={logoPreview}
//                         alt="Store logo"
//                         width={96}
//                         height={96}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <Package className="w-8 h-8 text-gray-400" />
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleLogoUpload}
//                       disabled={uploadingLogo}
//                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
//                     />
//                     {uploadingLogo && (
//                       <p className="text-xs text-gray-500 mt-1">Uploading...</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Store Cover */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">Store Cover</label>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//                   <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
//                     {coverPreview ? (
//                       <Image
//                         src={coverPreview}
//                         alt="Store cover"
//                         width={128}
//                         height={80}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <Image className="w-8 h-8 text-gray-400" />
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleCoverUpload}
//                       disabled={uploadingCover}
//                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
//                     />
//                     {uploadingCover && (
//                       <p className="text-xs text-gray-500 mt-1">Uploading...</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Store Name */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Store Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editFormData.name}
//                   onChange={handleEditInputChange}
//                   className="form-control w-full"
//                   placeholder="Enter store name"
//                 />
//               </div>

//               {/* Store Email */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Store Email <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={editFormData.email}
//                   onChange={handleEditInputChange}
//                   className="form-control w-full"
//                   placeholder="store@example.com"
//                 />
//               </div>

//               {/* Store URL */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Store URL <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-500 text-sm">/store/</span>
//                   <input
//                     type="text"
//                     name="url"
//                     value={editFormData.url}
//                     onChange={handleEditInputChange}
//                     className="form-control flex-1"
//                     placeholder="store-url"
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   URL will be used for store page (e.g., example.com/store/store-url)
//                 </p>
//               </div>

//               {/* Status and Featured */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Status</label>
//                   <select
//                     name="status"
//                     value={editFormData.status}
//                     onChange={handleEditInputChange}
//                     className="form-control w-full"
//                   >
//                     <option value="PENDING">Pending</option>
//                     <option value="ACTIVE">Active</option>
//                     <option value="DISABLED">Disabled</option>
//                     <option value="BANNED">Banned</option>
//                   </select>
//                 </div>

//                 <div className="flex items-center gap-3 pt-6">
//                   <input
//                     type="checkbox"
//                     name="featured"
//                     id="featured"
//                     checked={editFormData.featured}
//                     onChange={handleEditInputChange}
//                     className="ti-form-checkbox w-5 h-5"
//                   />
//                   <label htmlFor="featured" className="text-sm font-medium">
//                     Feature this store
//                   </label>
//                 </div>
//               </div>

//               {/* Info Box */}
//               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
//                       About Store Management
//                     </p>
//                     <p className="text-xs text-blue-700 dark:text-blue-400">
//                       Changing store status affects visibility on the platform.
//                       Featured stores appear on the homepage and have better visibility.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={() => setEditModalOpen(false)}
//                 className="ti-btn ti-btn-outline-light w-full sm:w-auto"
//                 disabled={editLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={updateStore}
//                 className="ti-btn ti-btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
//                 disabled={editLoading}
//               >
//                 {editLoading ? (
//                   <>
//                     <RefreshCw className="w-4 h-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Check className="w-4 h-4" />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Fragment>
//   );
// }









"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Fragment } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

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
      case "ACTIVE":
        return {
          className: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
          icon: <Check className="w-3 h-3" />,
          text: "Active",
        };
      case "PENDING":
        return {
          className: "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
          icon: <AlertCircle className="w-3 h-3" />,
          text: "Pending",
        };
      case "BANNED":
        return {
          className: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
          icon: <X className="w-3 h-3" />,
          text: "Banned",
        };
      case "DISABLED":
        return {
          className: "bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400",
          icon: <Shield className="w-3 h-3" />,
          text: "Disabled",
        };
      default:
        return {
          className: "bg-gray-500/10 text-gray-600",
          icon: null,
          text: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.icon}
      {config.text}
    </span>
  );
};

// Featured badge component
const FeaturedBadge = ({ featured }: { featured: boolean }) => {
  if (!featured) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
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
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [statusFilter, setStatusFilter] = useState<StoreStatus | "ALL">(
    (searchParams.get("status") as StoreStatus) || "ALL",
  );
  const [stats, setStats] = useState<StoreStats | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    email: "",
    url: "",
    status: "PENDING" as StoreStatus,
    featured: false,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState<Pagination>({
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
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
        ...(statusFilter !== "ALL" && { status: statusFilter }),
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      const response = await fetch(`/api/oneshop/admin/stores?${params}`);
      const data = await response.json();

      if (data.success) {
        setStores(data.data);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || "Failed to fetch stores");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Error fetching stores");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await fetch("/api/oneshop/admin/stores/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
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
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    if (statusFilter !== "ALL") {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }

    params.set("page", pagination.page.toString());
    params.set("limit", pagination.limit.toString());

    router.replace(`?${params.toString()}`);
  }, [
    searchTerm,
    statusFilter,
    pagination.page,
    pagination.limit,
    router,
    searchParams,
  ]);

  // Open edit modal
  const openEditModal = (store: Store) => {
    setSelectedStore(store);
    setEditFormData({
      id: store.id,
      name: store.name,
      email: store.email,
      url: store.url,
      status: store.status,
      featured: store.featured,
    });
    setLogoPreview(store.logo || "");
    setCoverPreview(store.cover || "");
    setEditModalOpen(true);
  };

  // Handle edit form input change
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'store-logo');

    try {
      const response = await fetch('/api/oneshop/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setEditFormData(prev => ({ ...prev, logo: data.url }));
        toast.success('Logo uploaded successfully');
      } else {
        toast.error('Failed to upload logo');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handle cover upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploadingCover(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'store-cover');

    try {
      const response = await fetch('/api/oneshop/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setEditFormData(prev => ({ ...prev, cover: data.url }));
        toast.success('Cover uploaded successfully');
      } else {
        toast.error('Failed to upload cover');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload cover');
    } finally {
      setUploadingCover(false);
    }
  };

  // Update store
  const updateStore = async () => {
    if (!editFormData.name.trim()) {
      toast.error('Store name is required');
      return;
    }
    if (!editFormData.email.trim()) {
      toast.error('Store email is required');
      return;
    }
    if (!editFormData.url.trim()) {
      toast.error('Store URL is required');
      return;
    }

    setEditLoading(true);
    try {
      const response = await fetch(`/api/oneshop/admin/stores/${editFormData.id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editFormData.name,
          email: editFormData.email,
          url: editFormData.url,
          status: editFormData.status,
          featured: editFormData.featured,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Store updated successfully');
        setEditModalOpen(false);
        fetchStores();
        fetchStats();
      } else {
        toast.error(data.message || 'Failed to update store');
      }
    } catch (error) {
      console.error('Error updating store:', error);
      toast.error('Failed to update store');
    } finally {
      setEditLoading(false);
    }
  };

  // Bulk operations
  const handleBulkAction = async (
    action: "delete" | "update-status" | "feature",
    data?: any,
  ) => {
    if (selectedStores.length === 0) {
      toast.error("Please select stores to perform this action");
      return;
    }

    try {
      setBulkLoading(true);

      const response = await fetch("/api/oneshop/admin/stores/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      console.error("Error performing bulk action:", error);
      toast.error("Error performing bulk action");
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle store deletion
  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (!confirm(`Are you sure you want to delete "${storeName}"?`)) return;

    try {
      const response = await fetch(`/api/oneshop/admin/stores/${storeId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Store deleted successfully");
        fetchStores();
        fetchStats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting store:", error);
      toast.error("Error deleting store");
    }
  };

  // Handle status change
  const handleStatusChange = async (
    storeId: string,
    newStatus: StoreStatus,
  ) => {
    try {
      const response = await fetch(`/api/oneshop/admin/stores/${storeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Store status updated");
        fetchStores();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating store status:", error);
      toast.error("Error updating store status");
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Select all stores
  const handleSelectAll = () => {
    if (selectedStores.length === stores.length) {
      setSelectedStores([]);
    } else {
      setSelectedStores(stores.map((store) => store.id));
    }
  };

  // Export stores
  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "URL",
      "Status",
      "Products",
      "Followers",
      "Owner",
      "Created At",
    ];
    const csvData = stores.map((store) => [
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
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stores-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Status options
  const statusOptions = [
    { value: "ALL", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "PENDING", label: "Pending" },
    { value: "BANNED", label: "Banned" },
    { value: "DISABLED", label: "Disabled" },
  ];

  const bulkStatusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "PENDING", label: "Pending" },
    { value: "BANNED", label: "Banned" },
    { value: "DISABLED", label: "Disabled" },
  ];

  return (
    <Fragment>
      <div className="main-content">
        {/* Header */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Stores Management
                </h1>
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
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Total Stores */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Stores
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {statsLoading
                        ? "..."
                        : stats?.totalStores.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Active
                    </span>
                    <span className="font-semibold">
                      {statsLoading ? "..." : stats?.storesByStatus.ACTIVE || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* New Stores Today */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      New Today
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {statsLoading ? "..." : stats?.newStoresToday}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      This Week
                    </span>
                    <span className="font-semibold">
                      {statsLoading ? "..." : stats?.newStoresThisWeek}
                    </span>
                  </div>
                </div>
              </div>

              {/* Average Rating */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Rating
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {statsLoading ? "..." : stats?.averageRating.toFixed(1)}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
                    <Star className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Featured
                    </span>
                    <span className="font-semibold">
                      {statsLoading ? "..." : stats?.featuredStoresCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* New Stores This Month */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This Month
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {statsLoading ? "..." : stats?.newStoresThisMonth}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Pending
                    </span>
                    <span className="font-semibold">
                      {statsLoading
                        ? "..."
                        : stats?.storesByStatus.PENDING || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="section !pt-0">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search stores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ti-form-control w-full sm:w-64"
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
                        onClick={() => setSearchTerm("")}
                        className="ti-btn ti-btn-outline-light"
                      >
                        Clear
                      </button>
                    )}
                  </form>

                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as StoreStatus | "ALL");
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="ti-form-control w-full sm:w-40"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bulk Actions */}
                {selectedStores.length > 0 && (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedStores.length} selected
                    </span>
                    <select
                      value=""
                      onChange={(e) => {
                        const action = e.target.value;
                        if (action === "delete") {
                          if (
                            confirm(`Delete ${selectedStores.length} stores?`)
                          ) {
                            handleBulkAction("delete");
                          }
                        } else if (action.startsWith("status-")) {
                          const status = action.replace(
                            "status-",
                            "",
                          ) as StoreStatus;
                          handleBulkAction("update-status", { status });
                        } else if (action === "feature") {
                          handleBulkAction("feature", { featured: true });
                        } else if (action === "unfeature") {
                          handleBulkAction("feature", { featured: false });
                        }
                        e.target.value = "";
                      }}
                      disabled={bulkLoading}
                      className="ti-form-control"
                    >
                      <option value="">Bulk Actions</option>
                      <optgroup label="Update Status">
                        {bulkStatusOptions.map((option) => (
                          <option
                            key={option.value}
                            value={`status-${option.value}`}
                          >
                            Set as {option.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Featured">
                        <option value="feature">Mark as Featured</option>
                        <option value="unfeature">Remove Featured</option>
                      </optgroup>
                      <optgroup label="Danger">
                        <option value="delete" className="text-danger">
                          Delete Selected
                        </option>
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
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                    {searchTerm || statusFilter !== "ALL"
                      ? "Try changing your filters"
                      : "Get started by creating a new store"}
                  </p>
                  {searchTerm || statusFilter !== "ALL" ? (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("ALL");
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
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold w-12">
                            <input
                              type="checkbox"
                              checked={
                                stores.length > 0 &&
                                selectedStores.length === stores.length
                              }
                              onChange={handleSelectAll}
                              className="ti-form-checkbox"
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Store</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold hidden md:table-cell">Owner</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold hidden sm:table-cell">Products</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">Followers</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold hidden xl:table-cell">Rating</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold hidden 2xl:table-cell">Created</th>
                          <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {stores.map((store) => (
                          <tr
                            key={store.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedStores.includes(store.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStores((prev) => [
                                      ...prev,
                                      store.id,
                                    ]);
                                  } else {
                                    setSelectedStores((prev) =>
                                      prev.filter((id) => id !== store.id),
                                    );
                                  }
                                }}
                                className="ti-form-checkbox"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                  <Image
                                    src={store.logo || "/default-store-logo.png"}
                                    alt={store.name}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-gray-800 dark:text-white truncate max-w-[150px] sm:max-w-none">
                                      {store.name}
                                    </span>
                                    <FeaturedBadge featured={store.featured} />
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px] sm:max-w-none">
                                    {store.email}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-500 truncate">
                                    /{store.url}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <div>
                                <div className="font-medium text-gray-800 dark:text-white">
                                  {store.owner.username}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {store.owner.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={store.status} />
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <div className="font-medium">
                                {store.productCount.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">
                                  {store.followerCount.toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden xl:table-cell">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-medium">
                                  {store.averageRating.toFixed(1)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden 2xl:table-cell">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(store.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1 sm:gap-2">
                                <Link
                                  href={`/admin/stores/${store.id}`}
                                  className="ti-btn ti-btn-outline-light ti-btn-sm"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => openEditModal(store)}
                                  className="ti-btn ti-btn-outline-light ti-btn-sm"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteStore(store.id, store.name)
                                  }
                                  className="ti-btn ti-btn-outline-light ti-btn-sm hover:bg-red-500/10 hover:text-red-500"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {(pagination.page - 1) * pagination.limit + 1}{" "}
                        to{" "}
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total,
                        )}{" "}
                        of {pagination.total} stores
                      </div>
                      <div className="flex gap-1 flex-wrap justify-center">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1 || loading}
                          className="ti-btn ti-btn-outline-light ti-btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        {Array.from(
                          { length: Math.min(5, pagination.pages) },
                          (_, i) => {
                            let pageNum;
                            if (pagination.pages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                              pageNum = i + 1;
                            } else if (
                              pagination.page >=
                              pagination.pages - 2
                            ) {
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
                                    ? "ti-btn-primary"
                                    : "ti-btn-outline-light"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          },
                        )}
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={
                            pagination.page === pagination.pages || loading
                          }
                          className="ti-btn ti-btn-outline-light ti-btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* EDIT STORE MODAL - Responsive with optimal height and scroll */}
      {editModalOpen && selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h5 className="font-semibold text-xl">Edit Store</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update store information
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Store Logo */}
              <div>
                <label className="block text-sm font-medium mb-2">Store Logo</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="Store logo"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                    />
                    {uploadingLogo && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Uploading...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Cover */}
              <div>
                <label className="block text-sm font-medium mb-2">Store Cover</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-28 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                    {coverPreview ? (
                      <Image
                        src={coverPreview}
                        alt="Store cover"
                        width={112}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                    />
                    {uploadingCover && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Uploading...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  className="form-control w-full"
                  placeholder="Enter store name"
                />
              </div>

              {/* Store Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Store Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  className="form-control w-full"
                  placeholder="store@example.com"
                />
              </div>

              {/* Store URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Store URL <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-2 rounded">/store/</span>
                  <input
                    type="text"
                    name="url"
                    value={editFormData.url}
                    onChange={handleEditInputChange}
                    className="form-control flex-1"
                    placeholder="store-url"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  URL will be used for store page (e.g., example.com/store/store-url)
                </p>
              </div>

              {/* Status and Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditInputChange}
                    className="form-control w-full"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DISABLED">Disabled</option>
                    <option value="BANNED">Banned</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={editFormData.featured}
                    onChange={handleEditInputChange}
                    className="ti-form-checkbox w-5 h-5"
                  />
                  <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                    Feature this store
                  </label>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
                      About Store Management
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                      Changing store status affects visibility. Featured stores appear on the homepage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={() => setEditModalOpen(false)}
                className="ti-btn ti-btn-outline-light w-full sm:w-auto order-2 sm:order-1"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={updateStore}
                className="ti-btn ti-btn-primary w-full sm:w-auto flex items-center justify-center gap-2 order-1 sm:order-2"
                disabled={editLoading}
              >
                {editLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}