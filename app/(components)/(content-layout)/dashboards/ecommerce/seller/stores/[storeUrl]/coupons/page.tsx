"use client";

import { Fragment, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import {
  format,
  isBefore,
  isAfter,
  parseISO,
  differenceInDays,
} from "date-fns";

interface Coupon {
  id: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  userRelations?: Array<{
    user: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string | null;
    };
  }>;
  orders?: Array<{
    id: string;
    createdAt: string;
    total: number;
    status: string;
  }>;
}

export default function SellerCouponsPage() {
  const params = useParams();
  const router = useRouter();
  const storeUrl = params.storeUrl as string;

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/main/coupons`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  // Fetch single coupon details for edit
  const fetchCouponDetails = async (couponId: string) => {
    try {
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/main/coupons/${couponId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.coupon;
    } catch (error) {
      console.error("Error fetching coupon details:", error);
      toast.error("Failed to load coupon details");
      return null;
    }
  };

  useEffect(() => {
    if (storeUrl) {
      fetchCoupons();
    }
  }, [storeUrl]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: "",
      discount: "",
      startDate: "",
      endDate: "",
    });
  };

  // Create coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/main/coupons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          discount: parseInt(formData.discount),
        }),
      });

      if (response.ok) {
        toast.success("Coupon created successfully");
        setShowCreateModal(false);
        resetForm();
        fetchCoupons();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create coupon");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("An error occurred");
    }
  };

  // Update coupon
  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoupon) return;

    try {
      const response = await fetch(
        `/api/oneshop/seller/stores/${storeUrl}/main/coupons/${selectedCoupon.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            discount: parseInt(formData.discount),
          }),
        }
      );

      if (response.ok) {
        toast.success("Coupon updated successfully");
        setShowEditModal(false);
        setSelectedCoupon(null);
        resetForm();
        fetchCoupons();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update coupon");
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error("An error occurred");
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return;

    try {
      const response = await fetch(
        `/api/oneshop/seller/stores/${storeUrl}/main/coupons/${selectedCoupon.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Coupon deleted successfully");
        setShowDeleteModal(false);
        setSelectedCoupon(null);
        fetchCoupons();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("An error occurred");
    }
  };

  // Calculate coupon status
  const getCouponStatus = (coupon: Coupon) => {
    try {
      const now = new Date();
      const startDate = parseISO(coupon.startDate);
      const endDate = parseISO(coupon.endDate);

      if (isBefore(now, startDate)) {
        return {
          text: "Upcoming",
          color: "bg-info/10 text-info",
        };
      } else if (isAfter(now, endDate)) {
        return {
          text: "Expired",
          color: "bg-danger/10 text-danger",
        };
      } else {
        return {
          text: "Active",
          color: "bg-success/10 text-success",
        };
      }
    } catch {
      return {
        text: "Invalid Date",
        color: "bg-warning/10 text-warning",
      };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMM yyyy");
    } catch {
      return dateString;
    }
  };

  // Handle edit click
  const handleEditClick = async (coupon: Coupon) => {
    try {
      // Fetch coupon details
      const couponDetails = await fetchCouponDetails(coupon.id);
      if (couponDetails) {
        setSelectedCoupon(couponDetails);
        setFormData({
          code: couponDetails.code,
          discount: couponDetails.discount.toString(),
          startDate: couponDetails.startDate,
          endDate: couponDetails.endDate,
        });
        setShowEditModal(true);
      } else {
        // Use basic coupon data if details fetch fails
        setSelectedCoupon(coupon);
        setFormData({
          code: coupon.code,
          discount: coupon.discount.toString(),
          startDate: coupon.startDate,
          endDate: coupon.endDate,
        });
        setShowEditModal(true);
      }
    } catch (error) {
      console.error("Error preparing edit:", error);
      // Use basic coupon data
      setSelectedCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount: coupon.discount.toString(),
        startDate: coupon.startDate,
        endDate: coupon.endDate,
      });
      setShowEditModal(true);
    }
  };

  // Handle delete click
  const handleDeleteClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowDeleteModal(true);
  };

  // Get user count safely
  const getUserCount = (coupon: Coupon) => {
    return coupon.userRelations?.length || 0;
  };

  // Get order count safely
  const getOrderCount = (coupon: Coupon) => {
    return coupon.orders?.length || 0;
  };

  // Get first few users for display
  const getDisplayUsers = (coupon: Coupon) => {
    return coupon.userRelations?.slice(0, 3) || [];
  };

  return (
    <Fragment>
      <div className="main-content">
        {/* Start:: Breadcrumb */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={"Seller Coupons"} />
            <Pageheader
              Updated={true}
              breadcrumbs={["Dashboard", "Shop", "Seller", "Stores", "Coupons"]}
              currentpage="Coupons Management"
            />
          </div>
        </div>
        {/* End:: Breadcrumb */}

        {/* Start:: Main Content */}
        <section className="section !py-6">
          <div className="container">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="xl:col-span-12 col-span-12">
                <div className="box">
                  <div className="box-header flex justify-between items-center">
                    <div className="box-title flex-grow-1">
                      Coupons Management
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="ti-btn ti-btn-primary btn-wave"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create New Coupon
                    </button>
                  </div>
                  <div className="box-body">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="ms-2">Loading coupons...</span>
                        </div>
                      </div>
                    ) : coupons.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="empty-state">
                          <div className="empty-state-icon">
                            <i className="bi bi-tags text-4xl text-muted"></i>
                          </div>
                          <h4 className="empty-state-title">No coupons found</h4>
                          <p className="empty-state-subtitle">
                            Create your first coupon to offer discounts to customers
                          </p>
                          <button
                            onClick={() => setShowCreateModal(true)}
                            className="ti-btn ti-btn-primary mt-4"
                          >
                            Create Coupon
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table min-w-full">
                          <thead>
                            <tr>
                              <th className="text-start">Code</th>
                              <th className="text-start">Discount</th>
                              <th className="text-start">Period</th>
                              <th className="text-start">Used By</th>
                              <th className="text-start">Status</th>
                              <th className="text-start">Created</th>
                              <th className="text-start">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {coupons.map((coupon) => {
                              const status = getCouponStatus(coupon);
                              const daysLeft = differenceInDays(
                                parseISO(coupon.endDate),
                                new Date()
                              );
                              const userCount = getUserCount(coupon);
                              const displayUsers = getDisplayUsers(coupon);
                              
                              return (
                                <tr key={coupon.id} className="hover:bg-light/50 dark:hover:bg-light/10">
                                  <td>
                                    <div className="flex items-center">
                                      <span className="font-semibold text-primary">{coupon.code}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="badge bg-primary/10 text-primary px-3 py-1">
                                      {coupon.discount}% OFF
                                    </span>
                                  </td>
                                  <td>
                                    <div className="text-sm">
                                      <div className="font-medium">{formatDate(coupon.startDate)}</div>
                                      <div className="text-muted text-xs">to</div>
                                      <div className="font-medium">{formatDate(coupon.endDate)}</div>
                                      {daysLeft > 0 && daysLeft <= 7 && (
                                        <div className="text-xs text-warning mt-1">
                                          <i className="bi bi-clock me-1"></i>
                                          {daysLeft} days left
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center">
                                      <span className="me-2 text-sm">
                                        {userCount} user{userCount !== 1 ? 's' : ''}
                                      </span>
                                      {userCount > 0 && (
                                        <div className="avatar-group -space-x-2">
                                          {displayUsers.map((rel, idx) => (
                                            <div
                                              key={idx}
                                              className="avatar avatar-xs avatar-rounded border-2 border-white dark:border-defaultborder"
                                              title={rel.user.displayName}
                                            >
                                              {rel.user.avatarUrl ? (
                                                <img
                                                  src={rel.user.avatarUrl}
                                                  alt={rel.user.displayName}
                                                  className="rounded-full"
                                                />
                                              ) : (
                                                <div className="avatar-initials bg-primary/20 text-primary text-xs flex items-center justify-center w-full h-full">
                                                  {rel.user.displayName?.charAt(0) || 'U'}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                          {userCount > 3 && (
                                            <div className="avatar avatar-xs avatar-rounded border-2 border-white dark:border-defaultborder bg-light dark:bg-light/10">
                                              <span className="text-xs">
                                                +{userCount - 3}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`badge ${status.color} px-3 py-1`}>
                                      {status.text}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="text-sm">
                                      {format(parseISO(coupon.createdAt), "dd MMM yyyy")}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleEditClick(coupon)}
                                        className="ti-btn ti-btn-outline-primary ti-btn-sm"
                                        title="Edit coupon"
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteClick(coupon)}
                                        className="ti-btn ti-btn-outline-danger ti-btn-sm"
                                        title="Delete coupon"
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End:: Main Content */}
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border border-defaultborder dark:border-defaultborder/10">
              <div className="modal-header">
                <h5 className="modal-title">Create New Coupon</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleCreateCoupon}>
                <div className="modal-body">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <label className="ti-form-label">Coupon Code *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="SUMMER2024"
                        required
                        pattern="[A-Z0-9]+"
                        title="Only uppercase letters and numbers"
                      />
                      <div className="text-xs text-muted mt-1">
                        Use only uppercase letters and numbers (no spaces or special characters)
                      </div>
                    </div>
                    <div className="col-span-12">
                      <label className="ti-form-label">Discount Percentage *</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          name="discount"
                          value={formData.discount}
                          onChange={handleInputChange}
                          placeholder="10"
                          min="1"
                          max="100"
                          required
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label className="ti-form-label">Start Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="col-span-6">
                      <label className="ti-form-label">End Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="ti-btn ti-btn-outline-light"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ti-btn ti-btn-primary">
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {showEditModal && selectedCoupon && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border border-defaultborder dark:border-defaultborder/10">
              <div className="modal-header">
                <h5 className="modal-title">Edit Coupon: {selectedCoupon.code}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCoupon(null);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleUpdateCoupon}>
                <div className="modal-body">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <label className="ti-form-label">Coupon Code *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                        pattern="[A-Z0-9]+"
                        title="Only uppercase letters and numbers"
                      />
                    </div>
                    <div className="col-span-12">
                      <label className="ti-form-label">Discount Percentage *</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          name="discount"
                          value={formData.discount}
                          onChange={handleInputChange}
                          min="1"
                          max="100"
                          required
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <label className="ti-form-label">Start Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-6">
                      <label className="ti-form-label">End Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate}
                        required
                      />
                    </div>
                    <div className="col-span-12">
                      <div className="alert alert-info">
                        <div className="d-flex">
                          <div className="me-3">
                            <i className="bi bi-info-circle"></i>
                          </div>
                          <div>
                            <p className="mb-1">
                              <strong>Used by {getUserCount(selectedCoupon)} users</strong>
                            </p>
                            <p className="mb-0 text-sm">
                              This coupon has been applied in {getOrderCount(selectedCoupon)} orders
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
                      setShowEditModal(false);
                      setSelectedCoupon(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="ti-btn ti-btn-primary">
                    Update Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCoupon && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border border-defaultborder dark:border-defaultborder/10">
              <div className="modal-header">
                <h5 className="modal-title">Delete Coupon</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCoupon(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <div className="text-danger mb-3">
                    <i className="bi bi-exclamation-triangle text-4xl"></i>
                  </div>
                  <h6 className="mb-2">Are you sure you want to delete this coupon?</h6>
                  <p className="text-muted mb-3">
                    Coupon code: <strong>{selectedCoupon.code}</strong>
                  </p>
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    This action cannot be undone. This coupon has been used by{" "}
                    {getUserCount(selectedCoupon)} users in{" "}
                    {getOrderCount(selectedCoupon)} orders.
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-center">
                <button
                  type="button"
                  className="ti-btn ti-btn-outline-light"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedCoupon(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ti-btn ti-btn-danger"
                  onClick={handleDeleteCoupon}
                >
                  Yes, Delete Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {(showCreateModal || showEditModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}

      <style jsx>{`
        .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          font-weight: 600;
        }
        
        .avatar-group {
          display: flex;
          align-items: center;
        }
        
        .empty-state {
          padding: 2rem 1rem;
          text-align: center;
        }
        
        .empty-state-icon {
          margin-bottom: 1rem;
        }
        
        .empty-state-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .empty-state-subtitle {
          color: #6c757d;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </Fragment>
  );
}