"use client";

import dynamic from 'next/dynamic';
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  Star,
  TrendingUp,
  Eye,
  Share2,
  Edit,
  Trash2,
  Plus,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  MoreVertical,
  Filter,
  Search,
  Calendar,
  BarChart3,
  Download
} from 'lucide-react';
import Seo from '@/shared/layouts-components/seo/seo';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';

// Dinamik import for client-side only components
const SpkSelect = dynamic(
  () => import('@/shared/@spk-reusable-components/spk-packages/spk-reactselect'),
  { ssr: false }
);

interface Store {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  url: string;
  logo: string;
  cover: string;
  status: 'PENDING' | 'ACTIVE' | 'BANNED' | 'DISABLED';
  averageRating: number;
  featured: boolean;
  returnPolicy: string;
  defaultShippingService: string;
  defaultShippingFeePerItem: number;
  defaultShippingFeeForAdditionalItem: number;
  defaultShippingFeePerKg: number;
  defaultShippingFeeFixed: number;
  defaultDeliveryTimeMin: number;
  defaultDeliveryTimeMax: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  brand: string;
  rating: number;
  sales: number;
  numReviews: number;
  shippingFeeMethod: 'ITEM' | 'WEIGHT' | 'FIXED';
  views: number;
  freeShippingForAllCountries: boolean;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  offerTagId?: string;
  variants: ProductVariant[];
}

interface ProductVariant {
  id: string;
  variantName: string;
  variantImage: string;
  slug: string;
  isSale: boolean;
  saleEndDate?: string;
  keywords: string;
  sku: string;
  sales: number;
  weight: number;
  createdAt: string;
  updatedAt: string;
  sizes: Size[];
}

interface Size {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount: number;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface StoreStats {
  totalProducts: number;
  totalViews: number;
  totalSales: number;
  conversionRate: number;
  followerCount: number;
}

const SellerStorePage = () => {
  const params = useParams();
  const router = useRouter();
  const storeUrl = params.storeUrl as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  const [storeStats, setStoreStats] = useState<StoreStats>({
    totalProducts: 0,
    totalViews: 0,
    totalSales: 0,
    conversionRate: 0,
    followerCount: 0
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch store and products data
  const fetchStoreData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Parallel fetching for better performance
      const [storeRes, productsRes, statsRes] = await Promise.all([
        fetch(`/api/oneshop/seller/stores/${storeUrl}/mainpage`),
        fetch(`/api/oneshop/seller/stores/${storeUrl}/mainpage/products?limit=10`),
        fetch(`/api/oneshop/seller/stores/${storeUrl}/mainpage/stats?period=${selectedTimeRange}`)
      ]);

      if (!storeRes.ok) throw new Error('Store not found');
      if (!productsRes.ok) throw new Error('Failed to fetch products');
      if (!statsRes.ok) throw new Error('Failed to fetch stats');

      const storeData = await storeRes.json();
      const productsData = await productsRes.json();
      const statsData = await statsRes.json();

      setStore(storeData);
      setProducts(productsData.products || []);
      setOrderStats(statsData.orderStats || {});
      setStoreStats(statsData.storeStats || {});
      setError(null);
    } catch (err) {
      console.error('Error fetching store data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load store data');
    } finally {
      setLoading(false);
    }
  }, [storeUrl, selectedTimeRange]);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/oneshop/seller/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        await fetchStoreData(); // Refresh stats
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleUpdateStatus = async (productId: string, status: boolean) => {
    try {
      const response = await fetch(`/api/oneshop/seller/products/${productId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: status }),
      });

      if (response.ok) {
        fetchStoreData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">{error || 'Store not found'}</div>
        <Link
          href="/dashboards/ecommerce/seller/"
          className="ti-btn ti-btn-primary"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.variants.some(v => 
      v.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.keywords.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Fragment>
      {/* <!-- Start::app-content --> */}
      <div className="main-content landing-main ecommerce-main">
        {/* Start:: Breadcrumb*/}
        <div className="border-b border-defaultborder dark:border-defaultborder/10 py-4 page-breadcrumb">
          <div className="container">
            <Seo title={`${store.name} - Seller Store`} />
            <Pageheader 
              Updated={true} 
              breadcrumbs={['Dashboard', 'Ecommerce', 'Seller', 'Stores']} 
              currentpage={store.name}
            />
          </div>
        </div>
        {/* End:: Breadcrumb*/}

        {/* Store Header Section */}
        <section className="section !py-6">
          <div className="container">
            <div className="bg-white dark:bg-bodydark rounded-xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {store.logo ? (
                      <Image
                        src={store.logo}
                        alt={store.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag size={32} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {store.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        store.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : store.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {store.status}
                      </span>
                      {store.featured && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {store.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/dashboards/ecommerce/seller/stores/${storeUrl}/edit`)}
                    className="ti-btn ti-btn-outline flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Edit Store
                  </button>
                  <button
                    onClick={() => router.push(`/dashboards/ecommerce/seller/stores/${storeUrl}/products/new`)}
                    className="ti-btn ti-btn-primary flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Product
                  </button>
                </div>
              </div>

              {/* Store Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Store URL</p>
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {store.url}
                      </p>
                    </div>
                    <Share2 size={20} className="text-gray-400" />
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Contact Email</p>
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {store.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {store.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {store.averageRating?.toFixed(1)} / 5.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="section !py-3">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Revenue */}
              <div className="bg-white dark:bg-bodydark rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                    <DollarSign size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    +12.5%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatCurrency(orderStats.totalRevenue)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Total Revenue</p>
              </div>

              {/* Total Orders */}
              <div className="bg-white dark:bg-bodydark rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <ShoppingCart size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    +8.2%
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {orderStats.totalOrders}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Total Orders</p>
              </div>

              {/* Total Products */}
              <div className="bg-white dark:bg-bodydark rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Package size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    +{storeStats.totalProducts}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {storeStats.totalProducts}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Total Products</p>
              </div>

              {/* Store Followers */}
              <div className="bg-white dark:bg-bodydark rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900">
                    <Users size={24} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                    +{storeStats.followerCount}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {storeStats.followerCount}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Store Followers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="section !py-3">
          <div className="container">
            <div className="bg-white dark:bg-bodydark rounded-xl shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Products ({filteredProducts.length})
                  </h2>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <select
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                      <option value="1year">Last Year</option>
                    </select>
                    
                    <button
                      onClick={() => router.push(`/dashboards/ecommerce/seller/stores/${storeUrl}/products/new`)}
                      className="ti-btn ti-btn-primary flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Product
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-bodydark divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => {
                        const totalStock = product.variants.reduce(
                          (sum, variant) => sum + variant.sizes.reduce((s, size) => s + size.quantity, 0),
                          0
                        );
                        const lowestPrice = Math.min(
                          ...product.variants.flatMap(v => 
                            v.sizes.map(s => s.price * (1 - s.discount / 100))
                          )
                        );
                        const totalSales = product.variants.reduce((sum, v) => sum + v.sales, 0);

                        return (
                          <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 relative">
                                  {product.variants[0]?.variantImage ? (
                                    <Image
                                      src={product.variants[0].variantImage}
                                      alt={product.name}
                                      fill
                                      className="rounded-md object-cover"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                      <Package size={20} className="text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {product.brand}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {product.variants[0]?.sku || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      totalStock > 50
                                        ? 'bg-green-500'
                                        : totalStock > 10
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.min((totalStock / 100) * 100, 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {totalStock}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(lowestPrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <TrendingUp size={16} className="text-green-500 mr-1" />
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {totalSales}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => router.push(`/ecommerce/seller/products/${product.slug}/edit`)}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => router.push(`/products/${product.slug}`)}
                                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                  title="View"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="text-gray-500 dark:text-gray-400">
                            {searchQuery ? 'No products match your search.' : 'No products found.'}
                          </div>
                          {!searchQuery && (
                            <button
                              onClick={() => router.push(`/dashboards/ecommerce/seller/stores/${storeUrl}/products/new`)}
                              className="mt-4 ti-btn ti-btn-primary"
                            >
                              Add Your First Product
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredProducts.length} of {products.length} products
                  </div>
                  <button
                    onClick={() => router.push(`/dashboards/ecommerce/seller/stores/${storeUrl}/products`)}
                    className="ti-btn ti-btn-outline flex items-center gap-2"
                  >
                    View All Products
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Stats & Actions */}
        <section className="section !py-3">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <div className="bg-white dark:bg-bodydark rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Orders
                  </h3>
                  <Activity size={20} className="text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Pending</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {orderStats.pendingOrders} orders
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-500">
                      {orderStats.pendingOrders}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Completed</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {orderStats.completedOrders} orders
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-green-600 dark:text-green-500">
                      {orderStats.completedOrders}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Cancelled</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {orderStats.cancelledOrders} orders
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-red-600 dark:text-red-500">
                      {orderStats.cancelledOrders}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/dashboards/ecommerce/seller/stores/${storeUrl}/orders`)}
                  className="w-full mt-6 ti-btn ti-btn-outline"
                >
                  View All Orders
                </button>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white dark:bg-bodydark rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Performance
                  </h3>
                  <BarChart3 size={20} className="text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {storeStats.conversionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(storeStats.conversionRate, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Product Views</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {storeStats.totalViews.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min((storeStats.totalViews / 10000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Sales</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {storeStats.totalSales.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${Math.min((storeStats.totalSales / 5000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-bodydark rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Quick Actions
                  </h3>
                  <MoreVertical size={20} className="text-gray-400" />
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push(`/dashboards/ecommerce/seller/stores/${storeUrl}/products/new`)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Plus size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Add New Product
                      </span>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => router.push(`/dashboards/ecommerce/seller/stores/${storeUrl}/edit`)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Edit size={18} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Edit Store Settings
                      </span>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => router.push(`/dashboards/ecommerce/seller/stores/${storeUrl}/analytics`)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <BarChart3 size={18} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        View Analytics
                      </span>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400" />
                  </button>
                  
                  <button
                    onClick={() => {
                      // Export store data
                      const dataStr = JSON.stringify({
                        store,
                        stats: { orderStats, storeStats },
                        timestamp: new Date().toISOString()
                      }, null, 2);
                      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                      const exportFileDefaultName = `${store.name}-data-${new Date().toISOString().split('T')[0]}.json`;
                      const linkElement = document.createElement('a');
                      linkElement.setAttribute('href', dataUri);
                      linkElement.setAttribute('download', exportFileDefaultName);
                      linkElement.click();
                    }}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <Download size={18} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Export Store Data
                      </span>
                    </div>
                    <ArrowUpRight size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <!-- End::app-content --> */}
    </Fragment>
  );
};

export default SellerStorePage;