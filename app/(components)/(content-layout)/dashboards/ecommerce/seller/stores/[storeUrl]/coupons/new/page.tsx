"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Fragment } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Star, 
  Package, 
  TrendingUp, 
  AlertCircle,
  Download,
  RefreshCw,
  MoreVertical,
  Tag,
  Percent,
  Calendar,
  Copy,
  Users,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Zap,
  Sparkles,
  Clock,
  ChevronLeft,
  Store,
  QrCode,
  Share2,
  BarChart
} from 'lucide-react';
import toast from 'react-hot-toast';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';

// Types
interface Coupon {
  id: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'upcoming';
  isActive: boolean;
  isExpired: boolean;
  isUpcoming: boolean;
  usageCount: number;
  uniqueUsers: number;
  createdAt: string;
  updatedAt: string;
}

interface CouponFormData {
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
}

interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  upcomingCoupons: number;
  totalUsage: number;
  estimatedSavings: number;
  topCoupons: Array<{
    code: string;
    discount: number;
    usageCount: number;
  }>;
  monthlyUsage: Array<{
    month: string;
    count: number;
  }>;
}

// Main component
export default function SellerNewCouponPage() {
  const router = useRouter();
  const params = useParams();
  const storeUrl = params.storeUrl as string;
  
  // State
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [stats, setStats] = useState<CouponStats | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    discount: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [formErrors, setFormErrors] = useState<Partial<CouponFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(5);
  const [showBulkGenerate, setShowBulkGenerate] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Store info fetch
  const fetchStoreInfo = useCallback(async () => {
    try {
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}`);
      const data = await response.json();

      if (data.success) {
        setStoreInfo(data.data);
      } else {
        toast.error(data.message || 'Failed to load store information');
        router.push('/seller/dashboard');
      }
    } catch (error) {
      console.error('Error fetching store info:', error);
      toast.error('Error loading store information');
    }
  }, [storeUrl, router]);

  // Fetch coupons
  const fetchCoupons = useCallback(async () => {
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

      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/coupons?${params}`);
      const data = await response.json();

      if (data.success) {
        setCoupons(data.data);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || 'Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Error fetching coupons');
    } finally {
      setLoading(false);
    }
  }, [storeUrl, pagination.page, pagination.limit, searchTerm, statusFilter]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/coupons/stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [storeUrl]);

  // Generate coupon code
  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Handle generate code button
  const handleGenerateCode = () => {
    const newCode = generateCouponCode();
    setFormData(prev => ({ ...prev, code: newCode }));
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Share coupon
  const shareCoupon = (code: string) => {
    const shareUrl = `${window.location.origin}/coupon/${code}`;
    if (navigator.share) {
      navigator.share({
        title: `Use coupon code ${code}`,
        text: `Get ${formData.discount}% off at ${storeInfo?.name} with code ${code}`,
        url: shareUrl,
      });
    } else {
      copyToClipboard(shareUrl);
      toast.success('Share link copied to clipboard!');
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<CouponFormData> = {};
    
    if (!formData.code.trim()) {
      errors.code = 'Coupon code is required';
    } else if (formData.code.length < 4) {
      errors.code = 'Coupon code must be at least 4 characters';
    }
    
    if (!formData.discount || formData.discount < 1 || formData.discount > 100) {
      errors.discount = 'Discount must be between 1 and 100';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Coupon created successfully!');
        
        // Reset form
        setFormData({
          code: '',
          discount: 10,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
        setFormErrors({});
        
        // Refresh the list
        fetchCoupons();
        fetchStats();
      } else {
        toast.error(data.message || 'Error creating coupon');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error('Error creating coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle bulk generate
  const handleBulkGenerate = async () => {
    if (generatedCount < 1 || generatedCount > 50) {
      toast.error('Please enter a number between 1 and 50');
      return;
    }

    try {
      setIsGenerating(true);
      
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/coupons/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          couponIds: [],
          data: {
            count: generatedCount,
            discount: formData.discount,
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Successfully generated ${generatedCount} coupons!`);
        setShowBulkGenerate(false);
        setGeneratedCount(5);
        
        // Refresh the list
        fetchCoupons();
        fetchStats();
      } else {
        toast.error(data.message || 'Error generating coupons');
      }
    } catch (error) {
      console.error('Error generating coupons:', error);
      toast.error('Error generating coupons');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Bulk operations
  const handleBulkAction = async (action: 'delete') => {
    if (selectedCoupons.length === 0) {
      toast.error('Please select coupons to perform this action');
      return;
    }

    try {
      setBulkLoading(true);
      
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/coupons/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          couponIds: selectedCoupons,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setSelectedCoupons([]);
        fetchCoupons();
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

  // Handle coupon deletion
  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;

    try {
      const response = await fetch(`/api/oneshop/seller/stores/${storeUrl}/coupons/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Coupon deleted successfully');
        fetchCoupons();
        fetchStats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Error deleting coupon');
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Select all coupons
  const handleSelectAll = () => {
    if (selectedCoupons.length === coupons.length) {
      setSelectedCoupons([]);
    } else {
      setSelectedCoupons(coupons.map(c => c.id));
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStoreInfo();
    fetchCoupons();
    fetchStats();
  }, [fetchStoreInfo, fetchCoupons, fetchStats]);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
      switch (status) {
        case 'active':
          return {
            className: 'bg-success/10 text-success dark:bg-success/20',
            icon: <Check className="w-3 h-3" />,
            text: 'Active'
          };
        case 'expired':
          return {
            className: 'bg-danger/10 text-danger dark:bg-danger/20',
            icon: <X className="w-3 h-3" />,
            text: 'Expired'
          };
        case 'upcoming':
          return {
            className: 'bg-warning/10 text-warning dark:bg-warning/20',
            icon: <Clock className="w-3 h-3" />,
            text: 'Upcoming'
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

  return (
    <Fragment>
      <div className="main-content">
        {/* Breadcrumb */}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={"Manage Coupons"} />
            <Pageheader 
              Updated={true} 
              breadcrumbs={[
                'Dashboard', 
                'Seller', 
                'Stores', 
                storeInfo?.name || 'Store', 
                'Coupons'
              ]} 
              currentpage="New Coupon" 
            />
          </div>
        </div>

        {/* Header */}
        <div className="section">
          <div className="container">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href={`/seller/stores/${storeUrl}/coupons`}
                  className="ti-btn ti-btn-outline-light flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Coupons
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create New Coupon</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    For store: <span className="font-semibold">{storeInfo?.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowBulkGenerate(!showBulkGenerate)}
                  className="ti-btn ti-btn-outline-light flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Bulk Generate
                </button>
                <Link
                  href={`/seller/stores/${storeUrl}/coupons/analytics`}
                  className="ti-btn ti-btn-outline-light flex items-center gap-2"
                >
                  <BarChart className="w-4 h-4" />
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Form & Stats */}
              <div className="lg:col-span-4 col-span-12">
                {/* Create Coupon Form */}
                <div className="box">
                  <div className="box-header">
                    <div className="box-title flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Create Coupon
                    </div>
                  </div>
                  <div className="box-body">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Coupon Code */}
                      <div>
                        <label htmlFor="code" className="ti-form-label flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Coupon Code
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                            className={`ti-form-control flex-1 ${formErrors.code ? 'border-danger' : ''}`}
                            placeholder="e.g., SAVE20"
                          />
                          <button
                            type="button"
                            onClick={handleGenerateCode}
                            className="ti-btn ti-btn-outline-light"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                        {formErrors.code && (
                          <p className="text-danger text-sm mt-1">{formErrors.code}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Use uppercase letters and numbers for better readability
                        </p>
                      </div>

                      {/* Discount */}
                      <div>
                        <label htmlFor="discount" className="ti-form-label flex items-center gap-2">
                          <Percent className="w-4 h-4" />
                          Discount Percentage
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            id="discount"
                            min="1"
                            max="100"
                            value={formData.discount}
                            onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                            className={`ti-form-control pl-12 ${formErrors.discount ? 'border-danger' : ''}`}
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            %
                          </div>
                        </div>
                        {formErrors.discount && (
                          <p className="text-danger text-sm mt-1">{formErrors.discount}</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {[10, 20, 30, 50].map(percent => (
                            <button
                              key={percent}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, discount: percent }))}
                              className={`ti-btn ti-btn-sm ${formData.discount === percent ? 'ti-btn-primary' : 'ti-btn-outline-light'}`}
                            >
                              {percent}%
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="startDate" className="ti-form-label flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="startDate"
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            className={`ti-form-control ${formErrors.startDate ? 'border-danger' : ''}`}
                          />
                          {formErrors.startDate && (
                            <p className="text-danger text-sm mt-1">{formErrors.startDate}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="endDate" className="ti-form-label flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            End Date
                          </label>
                          <input
                            type="date"
                            id="endDate"
                            value={formData.endDate}
                            min={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                            className={`ti-form-control ${formErrors.endDate ? 'border-danger' : ''}`}
                          />
                          {formErrors.endDate && (
                            <p className="text-danger text-sm mt-1">{formErrors.endDate}</p>
                          )}
                        </div>
                      </div>

                      {/* Duration Presets */}
                      <div>
                        <label className="ti-form-label">Quick Duration</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: '7 Days', days: 7 },
                            { label: '30 Days', days: 30 },
                            { label: '90 Days', days: 90 },
                            { label: '1 Year', days: 365 },
                          ].map(preset => (
                            <button
                              key={preset.days}
                              type="button"
                              onClick={() => {
                                const start = new Date();
                                const end = new Date();
                                end.setDate(start.getDate() + preset.days);
                                setFormData(prev => ({
                                  ...prev,
                                  startDate: start.toISOString().split('T')[0],
                                  endDate: end.toISOString().split('T')[0],
                                }));
                              }}
                              className="ti-btn ti-btn-outline-light"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="ti-btn ti-btn-primary w-full flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Create Coupon
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Bulk Generate Modal */}
                {showBulkGenerate && (
                  <div className="box mt-6">
                    <div className="box-header">
                      <div className="box-title flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Bulk Generate Coupons
                      </div>
                    </div>
                    <div className="box-body">
                      <div className="space-y-4">
                        <div>
                          <label className="ti-form-label">Number of Coupons</label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={generatedCount}
                            onChange={(e) => setGeneratedCount(parseInt(e.target.value) || 1)}
                            className="ti-form-control"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Generate 1-50 coupons at once
                          </p>
                        </div>
                        
                        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-warning">Important Note</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Bulk generated coupons will use the same discount percentage and date range as above.
                                Each coupon will have a unique random code.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleBulkGenerate}
                            disabled={isGenerating}
                            className="ti-btn ti-btn-warning flex-1 flex items-center justify-center gap-2"
                          >
                            {isGenerating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4" />
                                Generate {generatedCount} Coupons
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setShowBulkGenerate(false)}
                            className="ti-btn ti-btn-outline-light"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="box mt-6">
                  <div className="box-header">
                    <div className="box-title flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Coupon Statistics
                    </div>
                  </div>
                  <div className="box-body">
                    {statsLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : stats && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 rounded-lg bg-primary/5 dark:bg-primary/10">
                            <div className="text-2xl font-bold text-primary">
                              {stats.totalCoupons}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Total Coupons
                            </div>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-success/5 dark:bg-success/10">
                            <div className="text-2xl font-bold text-success">
                              {stats.activeCoupons}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Active Now
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 rounded-lg bg-warning/5 dark:bg-warning/10">
                            <div className="text-2xl font-bold text-warning">
                              {stats.upcomingCoupons}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Upcoming
                            </div>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-danger/5 dark:bg-danger/10">
                            <div className="text-2xl font-bold text-danger">
                              {stats.expiredCoupons}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Expired
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Total Usage</p>
                              <h3 className="text-xl font-bold mt-1">
                                {stats.totalUsage.toLocaleString()}
                              </h3>
                            </div>
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                              <ShoppingCart className="w-6 h-6" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Savings</p>
                              <h3 className="text-xl font-bold mt-1">
                                ${stats.estimatedSavings.toLocaleString()}
                              </h3>
                            </div>
                            <div className="p-2 rounded-lg bg-success/10 text-success">
                              <DollarSign className="w-6 h-6" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tips */}
                <div className="box mt-6">
                  <div className="box-header">
                    <div className="box-title flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Tips for Success
                    </div>
                  </div>
                  <div className="box-body">
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Create time-limited coupons to create urgency.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Use clear, memorable codes that reflect your brand.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Offer different discount tiers for various customer segments.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Promote coupons through email marketing and social media.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Monitor coupon performance in the analytics section.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column - Coupons List */}
              <div className="lg:col-span-8 col-span-12">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {/* Total Coupons */}
                  <div className="box">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Coupons</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {statsLoading ? '...' : stats?.totalCoupons.toLocaleString()}
                        </h3>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <Tag className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Active Coupons */}
                  <div className="box">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Now</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {statsLoading ? '...' : stats?.activeCoupons}
                        </h3>
                      </div>
                      <div className="p-3 rounded-lg bg-success/10 text-success">
                        <Check className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Total Usage */}
                  <div className="box">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Usage</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {statsLoading ? '...' : stats?.totalUsage.toLocaleString()}
                        </h3>
                      </div>
                      <div className="p-3 rounded-lg bg-warning/10 text-warning">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Estimated Savings */}
                  <div className="box">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Est. Savings</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {statsLoading ? '...' : `$${stats?.estimatedSavings.toLocaleString()}`}
                        </h3>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupons List */}
                <div className="box">
                  <div className="box-header">
                    <div className="box-title flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Recent Coupons
                    </div>
                  </div>
                  
                  {/* Filters */}
                  <div className="box-body border-b border-defaultborder dark:border-defaultborder/10">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search coupon codes..."
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

                      <select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="ti-form-control"
                      >
                        <option value="ALL">All Status</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                    </div>

                    {/* Bulk Actions */}
                    {selectedCoupons.length > 0 && (
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-defaultborder dark:border-defaultborder/10">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedCoupons.length} selected
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${selectedCoupons.length} coupons?`)) {
                              handleBulkAction('delete');
                            }
                          }}
                          disabled={bulkLoading}
                          className="ti-btn ti-btn-danger ti-btn-sm flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Selected
                        </button>
                        <button
                          onClick={() => setSelectedCoupons([])}
                          className="ti-btn ti-btn-outline-light ti-btn-sm"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Coupons List */}
                  <div className="box-body">
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : coupons.length === 0 ? (
                      <div className="text-center py-12">
                        <Tag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          No coupons found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                          {searchTerm || statusFilter !== 'ALL' 
                            ? 'Try changing your filters' 
                            : 'Create your first coupon to get started'}
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
                          <button
                            onClick={handleGenerateCode}
                            className="ti-btn ti-btn-primary"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate First Coupon
                          </button>
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
                                    checked={coupons.length > 0 && selectedCoupons.length === coupons.length}
                                    onChange={handleSelectAll}
                                    className="ti-form-checkbox"
                                  />
                                </th>
                                <th scope="col">Code</th>
                                <th scope="col">Discount</th>
                                <th scope="col">Validity</th>
                                <th scope="col">Status</th>
                                <th scope="col">Usage</th>
                                <th scope="col" className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-black/20">
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={selectedCoupons.includes(coupon.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedCoupons(prev => [...prev, coupon.id]);
                                        } else {
                                          setSelectedCoupons(prev => prev.filter(id => id !== coupon.id));
                                        }
                                      }}
                                      className="ti-form-checkbox"
                                    />
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-2">
                                      <div className="font-mono font-bold text-lg text-gray-800 dark:text-white">
                                        {coupon.code}
                                      </div>
                                      <button
                                        onClick={() => copyToClipboard(coupon.code)}
                                        className="ti-btn ti-btn-outline-light ti-btn-sm"
                                        title="Copy code"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-1">
                                      <Percent className="w-4 h-4 text-primary" />
                                      <span className="font-bold text-lg text-primary">
                                        {coupon.discount}%
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-sm">
                                      <div className="text-gray-600 dark:text-gray-400">
                                        {new Date(coupon.startDate).toLocaleDateString()}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-500">
                                        to {new Date(coupon.endDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <StatusBadge status={coupon.status} />
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-4">
                                      <div className="text-center">
                                        <div className="font-bold">{coupon.usageCount}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-500">
                                          Uses
                                        </div>
                                      </div>
                                      <div className="text-center">
                                        <div className="font-bold">{coupon.uniqueUsers}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-500">
                                          Users
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => shareCoupon(coupon.code)}
                                        className="ti-btn ti-btn-outline-light ti-btn-sm"
                                        title="Share"
                                      >
                                        <Share2 className="w-4 h-4" />
                                      </button>
                                      <Link
                                        href={`/seller/stores/${storeUrl}/coupons/${coupon.id}`}
                                        className="ti-btn ti-btn-outline-light ti-btn-sm"
                                        title="View Details"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Link>
                                      <Link
                                        href={`/seller/stores/${storeUrl}/coupons/${coupon.id}/edit`}
                                        className="ti-btn ti-btn-outline-light ti-btn-sm"
                                        title="Edit"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Link>
                                      <button
                                        onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                                        className="ti-btn ti-btn-outline-light ti-btn-sm hover:bg-danger/10 hover:text-danger"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                      <div className="relative group">
                                        <button
                                          className="ti-btn ti-btn-outline-light ti-btn-sm"
                                          title="More options"
                                        >
                                          <MoreVertical className="w-4 h-4" />
                                        </button>
                                        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-defaultborder dark:border-defaultborder/10 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                          <div className="py-1">
                                            <button
                                              onClick={() => copyToClipboard(`${coupon.code} - ${coupon.discount}% OFF`)}
                                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
                                            >
                                              Copy Code & Details
                                            </button>
                                            <button
                                              onClick={() => copyToClipboard(`Use code ${coupon.code} for ${coupon.discount}% off at ${storeInfo?.name}`)}
                                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
                                            >
                                              Copy Promotion Text
                                            </button>
                                            <Link
                                              href={`/coupon/${coupon.code}`}
                                              target="_blank"
                                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
                                            >
                                              View Coupon Page
                                            </Link>
                                            <button
                                              onClick={() => {
                                                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/coupon/${coupon.code}`)}`;
                                                window.open(qrUrl, '_blank');
                                              }}
                                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 block"
                                            >
                                              Generate QR Code
                                            </button>
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
                              {pagination.total} coupons
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

                {/* Top Coupons */}
                {stats?.topCoupons && stats.topCoupons.length > 0 && (
                  <div className="box mt-6">
                    <div className="box-header">
                      <div className="box-title flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Most Used Coupons
                      </div>
                    </div>
                    <div className="box-body">
                      <div className="space-y-4">
                        {stats.topCoupons.map((coupon, index) => (
                          <div key={coupon.code} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-mono font-bold">{coupon.code}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {coupon.discount}% OFF
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{coupon.usageCount}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                uses
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
