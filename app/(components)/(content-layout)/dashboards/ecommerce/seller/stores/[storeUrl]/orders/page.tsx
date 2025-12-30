"use client";

import { Fragment, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import { format, parseISO, differenceInDays } from "date-fns";
import { OrderGroup, OrderStatus, ProductStatus } from "@prisma/client";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: ProductStatus;
  size: string;
  image: string;
  sku: string;
  productSlug: string;
  variantSlug: string;
}

interface OrderGroupWithRelations extends OrderGroup {
  order: {
    id: string;
    user: {
      id: string;
      username: string;
      displayName: string;
      email: string;
      avatarUrl: string | null;
    };
    shippingAddress: {
      firstName: string;
      lastName: string;
      city: string;
      state: string;
      country: {
        name: string;
      };
    };
    createdAt: string;
  };
  items: OrderItem[];
  coupon?: {
    id: string;
    code: string;
    discount: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Summary {
  totalRevenue: number;
  totalOrders: number;
  byStatus: Record<string, { count: number; revenue: number }>;
}

export default function SellerOrdersPage() {
  const params = useParams();
  const storeUrl = params.storeUrl as string;

  const [orders, setOrders] = useState<OrderGroupWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });
  const [summary, setSummary] = useState<Summary>({
    totalRevenue: 0,
    totalOrders: 0,
    byStatus: {},
  });

  // Filtreler
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    startDate: "",
    endDate: "",
  });

  // Modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderGroupWithRelations | null>(null);
  const [updateData, setUpdateData] = useState({
    status: "",
    trackingNumber: "",
    shippingCompany: "",
    note: "",
  });

  // Order status options
  const orderStatusOptions = [
    { value: "all", label: "All Orders" },
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Processing", label: "Processing" },
    { value: "Shipped", label: "Shipped" },
    { value: "OutforDelivery", label: "Out for Delivery" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Refunded", label: "Refunded" },
  ];

  // Product status options
  const productStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "ReadyForShipment", label: "Ready for Shipment" },
    { value: "Shipped", label: "Shipped" },
    { value: "Delivered", label: "Delivered" },
    { value: "Canceled", label: "Canceled" },
    { value: "Returned", label: "Returned" },
  ];

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/orders?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
      setPagination(data.pagination);
      setSummary(data.summary || {
        totalRevenue: 0,
        totalOrders: 0,
        byStatus: {},
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [storeUrl, pagination.page, pagination.limit, filters]);

  // Fetch single order details
  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/orders/${orderId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
      return null;
    }
  };

  useEffect(() => {
    if (storeUrl) {
      fetchOrders();
    }
  }, [storeUrl, pagination.page, fetchOrders]);

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchOrders();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "all",
      search: "",
      startDate: "",
      endDate: "",
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMM yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "bg-warning/10 text-warning",
      Confirmed: "bg-info/10 text-info",
      Processing: "bg-primary/10 text-primary",
      Shipped: "bg-success/10 text-success",
      OutforDelivery: "bg-purple-500/10 text-purple-600",
      Delivered: "bg-success/20 text-success",
      Cancelled: "bg-danger/10 text-danger",
      Failed: "bg-danger/20 text-danger",
      Refunded: "bg-secondary/10 text-secondary",
      Returned: "bg-orange-500/10 text-orange-600",
      PartiallyShipped: "bg-blue-500/10 text-blue-600",
      OnHold: "bg-gray-500/10 text-gray-600",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Get product status color
  const getProductStatusColor = (status: ProductStatus) => {
    const colors: Record<ProductStatus, string> = {
      Pending: "bg-warning/10 text-warning",
      Processing: "bg-primary/10 text-primary",
      ReadyForShipment: "bg-blue-500/10 text-blue-600",
      Shipped: "bg-success/10 text-success",
      Delivered: "bg-success/20 text-success",
      Canceled: "bg-danger/10 text-danger",
      Returned: "bg-orange-500/10 text-orange-600",
      Refunded: "bg-secondary/10 text-secondary",
      FailedDelivery: "bg-danger/20 text-danger",
      OnHold: "bg-gray-500/10 text-gray-600",
      Backordered: "bg-yellow-500/10 text-yellow-600",
      PartiallyShipped: "bg-blue-500/10 text-blue-600",
      ExchangeRequested: "bg-purple-500/10 text-purple-600",
      AwaitingPickup: "bg-teal-500/10 text-teal-600",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Handle order click
  const handleOrderClick = async (order: OrderGroupWithRelations) => {
    try {
      const orderDetails = await fetchOrderDetails(order.id);
      if (orderDetails) {
        setSelectedOrder(orderDetails);
      } else {
        setSelectedOrder(order);
      }
      setShowOrderModal(true);
    } catch (error) {
      console.error("Error loading order details:", error);
      setSelectedOrder(order);
      setShowOrderModal(true);
    }
  };

  // Handle update click
  const handleUpdateClick = (order: OrderGroupWithRelations) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      trackingNumber: order.trackingNumber || "",
      shippingCompany: order.shippingCompany || "",
      note: order.note || "",
    });
    setShowUpdateModal(true);
  };

  // Update order status
  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const response = await fetch(
        `/api/oneshop/seller/stores/${storeUrl}/orders/${selectedOrder.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        toast.success("Order updated successfully");
        setShowUpdateModal(false);
        setSelectedOrder(null);
        setUpdateData({
          status: "",
          trackingNumber: "",
          shippingCompany: "",
          note: "",
        });
        fetchOrders();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("An error occurred");
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Calculate days since order
  const getDaysSince = (dateString: string) => {
    try {
      const days = differenceInDays(new Date(), parseISO(dateString));
      if (days === 0) return "Today";
      if (days === 1) return "Yesterday";
      return `${days} days ago`;
    } catch {
      return "";
    }
  };

  // Get product status text
  const getProductStatusText = (status: ProductStatus) => {
    return status.replace(/([A-Z])/g, ' $1').trim();
  };

  // Get product image or placeholder
  const getProductImage = (item: OrderItem) => {
    if (item.image) return item.image;
    return "/assets/images/ecommerce/png/13.png"; // Default placeholder image
  };

  return (
    <Fragment>
      <div className="main-content">
        {/* Start:: Breadcrumb */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={"Seller Orders"} />
            <Pageheader
              Updated={true}
              breadcrumbs={["Dashboard", "Shop", "Seller", "Stores", "Orders"]}
              currentpage="Orders Management"
            />
          </div>
        </div>
        {/* End:: Breadcrumb */}

        {/* Start:: Main Content */}
        <section className="section !py-6">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-12 col-span-12">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="box">
                    <div className="box-body">
                      <div className="flex items-center">
                        <div className="me-4">
                          <span className="avatar avatar-md bg-primary/10 text-primary">
                            <i className="bi bi-cart-check text-xl"></i>
                          </span>
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm text-muted mb-1">Total Orders</p>
                          <h4 className="font-semibold text-2xl">{summary.totalOrders}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="box">
                    <div className="box-body">
                      <div className="flex items-center">
                        <div className="me-4">
                          <span className="avatar avatar-md bg-success/10 text-success">
                            <i className="bi bi-currency-dollar text-xl"></i>
                          </span>
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm text-muted mb-1">Total Revenue</p>
                          <h4 className="font-semibold text-2xl">{formatCurrency(summary.totalRevenue)}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="box">
                    <div className="box-body">
                      <div className="flex items-center">
                        <div className="me-4">
                          <span className="avatar avatar-md bg-warning/10 text-warning">
                            <i className="bi bi-clock-history text-xl"></i>
                          </span>
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm text-muted mb-1">Pending Orders</p>
                          <h4 className="font-semibold text-2xl">{summary.byStatus.Pending?.count || 0}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="box">
                    <div className="box-body">
                      <div className="flex items-center">
                        <div className="me-4">
                          <span className="avatar avatar-md bg-info/10 text-info">
                            <i className="bi bi-truck text-xl"></i>
                          </span>
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm text-muted mb-1">Shipped Orders</p>
                          <h4 className="font-semibold text-2xl">{summary.byStatus.Shipped?.count || 0}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="box mb-6">
                  <div className="box-header">
                    <div className="box-title">Filters</div>
                  </div>
                  <div className="box-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="ti-form-label">Status</label>
                        <select
                          className="form-control"
                          value={filters.status}
                          onChange={(e) => handleFilterChange("status", e.target.value)}
                        >
                          {orderStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="ti-form-label">Search</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Order ID, Customer, SKU..."
                          value={filters.search}
                          onChange={(e) => handleFilterChange("search", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="ti-form-label">From Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={filters.startDate}
                          onChange={(e) => handleFilterChange("startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="ti-form-label">To Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={filters.endDate}
                          onChange={(e) => handleFilterChange("endDate", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={resetFilters}
                        className="ti-btn ti-btn-outline-light"
                      >
                        Reset
                      </button>
                      <button
                        onClick={applyFilters}
                        className="ti-btn ti-btn-primary"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="box">
                  <div className="box-header">
                    <div className="box-title">Recent Orders</div>
                  </div>
                  <div className="box-body">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="ms-2">Loading orders...</span>
                        </div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="empty-state">
                          <div className="empty-state-icon">
                            <i className="bi bi-cart-x text-4xl text-muted"></i>
                          </div>
                          <h4 className="empty-state-title">No orders found</h4>
                          <p className="empty-state-subtitle">
                            {filters.status !== "all" || filters.search || filters.startDate || filters.endDate
                              ? "Try changing your filters"
                              : "When customers place orders, they will appear here"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="table min-w-full">
                            <thead>
                              <tr>
                                <th className="text-start">Order ID</th>
                                <th className="text-start">Customer</th>
                                <th className="text-start">Items</th>
                                <th className="text-start">Total</th>
                                <th className="text-start">Status</th>
                                <th className="text-start">Date</th>
                                <th className="text-start">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-light/50 dark:hover:bg-light/10">
                                  <td>
                                    <div className="flex items-center">
                                      <span className="font-semibold text-primary cursor-pointer hover:underline"
                                        onClick={() => handleOrderClick(order)}>
                                        #{order.id.slice(-8)}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center">
                                      {order.order.user.avatarUrl ? (
                                        <img
                                          src={order.order.user.avatarUrl}
                                          alt={order.order.user.displayName}
                                          className="w-8 h-8 rounded-full me-3"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center me-3">
                                          {order.order.user.displayName?.charAt(0) || 'C'}
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-medium">{order.order.user.displayName}</div>
                                        <div className="text-xs text-muted">{order.order.user.email}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-sm">
                                      <div>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                                      <div className="text-muted text-xs">
                                        {order.items.slice(0, 2).map((item, idx) => (
                                          <span key={idx}>
                                            {item.name}
                                            {idx < order.items.slice(0, 2).length - 1 ? ', ' : ''}
                                          </span>
                                        ))}
                                        {order.items.length > 2 && '...'}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="font-semibold">{formatCurrency(order.total)}</div>
                                    {order.coupon && (
                                      <div className="text-xs text-success">
                                        Coupon: {order.coupon.code} (-{order.coupon.discount}%)
                                      </div>
                                    )}
                                  </td>
                                  <td>
                                    <span className={`badge ${getStatusColor(order.status)} px-3 py-1`}>
                                      {order.status}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="text-sm">
                                      <div>{formatDate(order.createdAt)}</div>
                                      <div className="text-muted text-xs">
                                        {getDaysSince(order.createdAt)}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleOrderClick(order)}
                                        className="ti-btn ti-btn-outline-primary ti-btn-sm"
                                        title="View details"
                                      >
                                        <i className="bi bi-eye"></i>
                                      </button>
                                      <button
                                        onClick={() => handleUpdateClick(order)}
                                        className="ti-btn ti-btn-outline-success ti-btn-sm"
                                        title="Update status"
                                      >
                                        <i className="bi bi-pencil"></i>
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
                          <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-muted">
                              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                              {pagination.total} orders
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
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
                                    className={`ti-btn ti-btn-sm ${pagination.page === pageNum
                                        ? "ti-btn-primary"
                                        : "ti-btn-outline-light"
                                      }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                              <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
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
          </div>
        </section>
        {/* End:: Main Content */}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border border-defaultborder dark:border-defaultborder/10">
              <div className="modal-header">
                <h5 className="modal-title">Order Details: #{selectedOrder.id.slice(-8)}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedOrder(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Info */}
                  <div>
                    <h6 className="font-semibold mb-3">Order Information</h6>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted">Order ID:</span>
                        <span className="font-medium">#{selectedOrder.id.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Date:</span>
                        <span>{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Status:</span>
                        <span className={`badge ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Shipping Service:</span>
                        <span>{selectedOrder.shippingService}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Delivery Time:</span>
                        <span>{selectedOrder.shippingDeliveryMin}-{selectedOrder.shippingDeliveryMax} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Shipping Fee:</span>
                        <span>{formatCurrency(selectedOrder.shippingFees)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Subtotal:</span>
                        <span>{formatCurrency(selectedOrder.subTotal)}</span>
                      </div>
                      {selectedOrder.coupon && (
                        <div className="flex justify-between">
                          <span className="text-muted">Coupon Discount:</span>
                          <span className="text-success">-{selectedOrder.coupon.discount}% ({selectedOrder.coupon.code})</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h6 className="font-semibold mb-3">Customer Information</h6>
                    <div className="space-y-2">
                      <div className="flex items-center mb-3">
                        {selectedOrder.order.user.avatarUrl ? (
                          <img
                            src={selectedOrder.order.user.avatarUrl}
                            alt={selectedOrder.order.user.displayName}
                            className="w-10 h-10 rounded-full me-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center me-3">
                            {selectedOrder.order.user.displayName?.charAt(0) || 'C'}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{selectedOrder.order.user.displayName}</div>
                          <div className="text-sm text-muted">{selectedOrder.order.user.email}</div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Username:</span>
                        <span>{selectedOrder.order.user.username}</span>
                      </div>
                    </div>

                    <h6 className="font-semibold mb-3 mt-4">Shipping Address</h6>
                    <div className="space-y-1 text-sm">
                      <div>{selectedOrder.order.shippingAddress.firstName} {selectedOrder.order.shippingAddress.lastName}</div>
                      <div>{selectedOrder.order.shippingAddress.city}, {selectedOrder.order.shippingAddress.state}</div>
                      <div>{selectedOrder.order.shippingAddress.country?.name}</div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h6 className="font-semibold mb-3">Order Items</h6>
                  <div className="overflow-x-auto">
                    <table className="table min-w-full">
                      <thead>
                        <tr>
                          <th className="text-start">Product</th>
                          <th className="text-start">SKU</th>
                          <th className="text-start">Size</th>
                          <th className="text-start">Quantity</th>
                          <th className="text-start">Price</th>
                          <th className="text-start">Total</th>
                          <th className="text-start">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="flex items-center">
                                <img
                                  src={getProductImage(item)}
                                  alt={item.name}
                                  className="w-10 h-10 rounded me-3"
                                />
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-muted">SKU: {item.sku}</div>
                                </div>
                              </div>
                            </td>
                            <td>{item.sku}</td>
                            <td>{item.size || 'N/A'}</td>
                            <td>{item.quantity}</td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>{formatCurrency(item.totalPrice)}</td>
                            <td>
                              <span className={`badge ${getProductStatusColor(item.status)}`}>
                                {getProductStatusText(item.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="ti-btn ti-btn-outline-light"
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="ti-btn ti-btn-primary"
                  onClick={() => {
                    setShowOrderModal(false);
                    handleUpdateClick(selectedOrder);
                  }}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Order Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border border-defaultborder dark:border-defaultborder/10">
              <div className="modal-header">
                <h5 className="modal-title">Update Order Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedOrder(null);
                    setUpdateData({
                      status: "",
                      trackingNumber: "",
                      shippingCompany: "",
                      note: "",
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={handleUpdateOrder}>
                <div className="modal-body">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <label className="ti-form-label">Order Status *</label>
                      <select
                        className="form-control"
                        value={updateData.status}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                        required
                      >
                        <option value="">Select status</option>
                        {orderStatusOptions
                          .filter(opt => opt.value !== 'all')
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-span-12">
                      <label className="ti-form-label">Tracking Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={updateData.trackingNumber}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                        placeholder="Enter tracking number"
                      />
                    </div>
                    <div className="col-span-12">
                      <label className="ti-form-label">Shipping Company</label>
                      <input
                        type="text"
                        className="form-control"
                        value={updateData.shippingCompany}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, shippingCompany: e.target.value }))}
                        placeholder="Enter shipping company"
                      />
                    </div>
                    <div className="col-span-12">
                      <label className="ti-form-label">Note (Optional)</label>
                      <textarea
                        className="form-control"
                        value={updateData.note}
                        onChange={(e) => setUpdateData(prev => ({ ...prev, note: e.target.value }))}
                        rows={3}
                        placeholder="Add any notes about this order..."
                      ></textarea>
                    </div>
                    <div className="col-span-12">
                      <div className="alert alert-info">
                        <div className="d-flex">
                          <div className="me-3">
                            <i className="bi bi-info-circle"></i>
                          </div>
                          <div>
                            <p className="mb-0 text-sm">
                              When you update the status to "Shipped", the customer will be notified automatically.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="ti-btn ti-btn-outline-light"
                    onClick={() => {
                      setShowUpdateModal(false);
                      setSelectedOrder(null);
                      setUpdateData({
                        status: "",
                        trackingNumber: "",
                        shippingCompany: "",
                        note: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ti-btn ti-btn-primary">
                    Update Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {(showOrderModal || showUpdateModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </Fragment>
  );
}