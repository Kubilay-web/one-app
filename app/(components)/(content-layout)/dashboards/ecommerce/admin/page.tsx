"use client"

import React, { Fragment, useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import SpkEcommerceCard from "@/shared/@spk-reusable-components/dashboards/spk-ecommerce-card";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Image from "next/image";
import Link from "next/link";
import { useSession } from '@/app/SessionProvider';

// Dynamically import charts to reduce initial bundle size
const Spkapexcharts = dynamic(
  () => import("@/shared/@spk-reusable-components/spk-packages/apexcharts-component"),
  { ssr: false, loading: () => <div className="h-[300px] animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div> }
);

// Types
interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  activeProducts: number
  todayRevenue: number
  conversionRate: number
  averageOrderValue: number
}

interface RecentOrder {
  id: string
  orderId: string
  customerName: string
  customerEmail: string
  customerSrc: string
  quantity: number
  price: string
  status: string
  statusColor: string
  date: string
}

interface TopProduct {
  id: number
  name: string
  src: string
  price: string
  category: string
  categoryColor: string
  sales: number
}

interface User {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
  lastLogin: string
  status: 'active' | 'inactive' | 'banned'
  avatarUrl?: string
}

interface Transaction {
  id: string
  method: string
  date: string
  amount: string
  status: string
  statusClass: string
  bgClass: string
  iconColor: string
  icon: string
}

const AdminPage = () => {
  const router = useRouter()
  const { user } = useSession()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeProducts: 0,
    todayRevenue: 0,
    conversionRate: 0,
    averageOrderValue: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [salesData, setSalesData] = useState({
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['Completed', 'Pending', 'Cancelled', 'Returned', 'Processing'],
      colors: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'],
      legend: {
        position: 'bottom'
      }
    }
  })

  // Check admin access
  useEffect(() => {
  
    fetchAdminData()
  }, [user, router])

  // Fetch all admin data efficiently
  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Use Promise.all to fetch all data in parallel
      const [statsRes, ordersRes, productsRes, usersRes, transactionsRes] = await Promise.all([
        fetch('/api/oneshop/admin/stats'),
        fetch('/api/oneshop/admin/orders'),
        fetch('/api/oneshop/admin/products'),
        fetch('/api/oneshop/admin/users'),
        fetch('/api/oneshop/admin/transactions')
      ])

      // Parse all responses
      const [statsData, ordersData, productsData, usersData, transactionsData] = await Promise.all([
        statsRes.json(),
        ordersRes.json(),
        productsRes.json(),
        usersRes.json(),
        transactionsRes.json()
      ])

      // Update state
      setStats(statsData)
      setRecentOrders(ordersData.orders || [])
      setTopProducts(productsData.products || [])
      setUsers(usersData.users || [])
      setTransactions(transactionsData.transactions || [])
      
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Stats card data
  const cardData = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      percentage: "+12.3%",
      growth: "increase",
      icon: "ri-group-line",
      bgClass: "bg-primary/10",
      textClass: "text-primary",
      trendIcon: "ri-arrow-up-s-line"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      percentage: "+8.5%",
      growth: "increase",
      icon: "ri-shopping-bag-line",
      bgClass: "bg-secondary/10",
      textClass: "text-secondary",
      trendIcon: "ri-arrow-up-s-line"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      percentage: "+15.2%",
      growth: "increase",
      icon: "ri-money-dollar-circle-line",
      bgClass: "bg-success/10",
      textClass: "text-success",
      trendIcon: "ri-arrow-up-s-line"
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toLocaleString(),
      percentage: "-3.2%",
      growth: "decrease",
      icon: "ri-time-line",
      bgClass: "bg-warning/10",
      textClass: "text-warning",
      trendIcon: "ri-arrow-down-s-line"
    }
  ]

  // Additional stats cards
  const additionalCards = [
    {
      title: "Active Products",
      value: stats.activeProducts.toLocaleString(),
      percentage: "+5.7%",
      growth: "increase",
      icon: "ri-shopping-cart-line",
      bgClass: "bg-info/10",
      textClass: "text-info",
      trendIcon: "ri-arrow-up-s-line"
    },
    {
      title: "Today's Revenue",
      value: `$${stats.todayRevenue.toLocaleString()}`,
      percentage: "+22.1%",
      growth: "increase",
      icon: "ri-calendar-line",
      bgClass: "bg-purple-500/10",
      textClass: "text-purple-500",
      trendIcon: "ri-arrow-up-s-line"
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      percentage: "+2.4%",
      growth: "increase",
      icon: "ri-line-chart-line",
      bgClass: "bg-pink-500/10",
      textClass: "text-pink-500",
      trendIcon: "ri-arrow-up-s-line"
    },
    {
      title: "Avg Order Value",
      value: `$${stats.averageOrderValue}`,
      percentage: "+7.8%",
      growth: "increase",
      icon: "ri-money-dollar-box-line",
      bgClass: "bg-indigo-500/10",
      textClass: "text-indigo-500",
      trendIcon: "ri-arrow-up-s-line"
    }
  ]

  // Handle user actions
  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      const response = await fetch(`/api/oneshop/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        // Refresh users list
        fetchAdminData()
      }
    } catch (error) {
      console.error('Error performing user action:', error)
    }
  }

  // Handle order action
  const handleOrderAction = async (orderId: string, action: 'approve' | 'cancel' | 'ship') => {
    try {
      const response = await fetch(`/api/oneshop/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        // Refresh orders list
        fetchAdminData()
      }
    } catch (error) {
      console.error('Error performing order action:', error)
    }
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="grid grid-cols-12 gap-x-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="xxl:col-span-3 lg:col-span-6 md:col-span-6 col-span-12">
              <div className="box h-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <div className="container-fluid">
        {/* <!-- Page Header --> */}
        <Seo title="Admin Dashboard" />
        <Pageheader 
          Heading="Admin Dashboard" 
          breadcrumbs={['Dashboards', 'Admin']} 
          currentpage="Admin Dashboard" 
        />
        {/* <!-- Page Header Close --> */}

        {/* <!-- Start:: Stats Overview --> */}
        <div className="grid grid-cols-12 gap-x-6 mb-6">
          {cardData.map((card, index) => (
            <div key={index} className="xxl:col-span-3 lg:col-span-6 md:col-span-6 col-span-12">
              <SpkEcommerceCard card={card} />
            </div>
          ))}
        </div>
        {/* <!-- End:: Stats Overview --> */}

        {/* <!-- Start:: Additional Stats --> */}
        <div className="grid grid-cols-12 gap-x-6 mb-6">
          {additionalCards.map((card, index) => (
            <div key={index} className="xxl:col-span-3 lg:col-span-6 md:col-span-6 col-span-12">
              <SpkEcommerceCard card={card} />
            </div>
          ))}
        </div>
        {/* <!-- End:: Additional Stats --> */}

        {/* <!-- Start:: Revenue Chart --> */}
        <div className="grid grid-cols-12 gap-x-6 mb-6">
          <div className="xl:col-span-8 col-span-12">
            <div className="box">
              <div className="box-header justify-between">
                <div className="box-title">Revenue Overview</div>
                <select className="form-control form-control-sm w-auto">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last year</option>
                </select>
              </div>
              <div className="box-body">
                <div id="revenue-chart">
                  <Spkapexcharts 
                    chartOptions={{
                      chart: {
                        type: 'area',
                        height: 350,
                        toolbar: { show: false }
                      },
                      dataLabels: { enabled: false },
                      stroke: { curve: 'smooth' },
                      xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                      },
                      colors: ['#3b82f6'],
                      fill: {
                        type: 'gradient',
                        gradient: {
                          shadeIntensity: 1,
                          opacityFrom: 0.7,
                          opacityTo: 0.2,
                        }
                      }
                    }}
                    chartSeries={[{
                      name: 'Revenue',
                      data: [30000, 41000, 35000, 51000, 49000, 62000, 69000, 91000, 82000, 72000, 89000, 94000]
                    }]}
                    type="area"
                    width="100%"
                    height={350}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="xl:col-span-4 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">Sales Distribution</div>
              </div>
              <div className="box-body">
                <div id="sales-distribution">
                  <Spkapexcharts 
                    chartOptions={salesData.options}
                    chartSeries={salesData.series}
                    type="donut"
                    width="100%"
                    height={350}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- End:: Revenue Chart --> */}

        {/* <!-- Start:: Recent Orders --> */}
        <div className="grid grid-cols-12 gap-x-6 mb-6">
          <div className="xl:col-span-8 col-span-12">
            <div className="box overflow-hidden">
              <div className="box-header justify-between">
                <div className="box-title">Recent Orders</div>
                <Link 
                  scroll={false} 
                  href="/admin/orders"
                  className="text-[0.75rem] text-textmuted dark:text-textmuted/50 hover:text-primary"
                >
                  View All <i className="ti ti-arrow-narrow-right ms-1"></i>
                </Link>
              </div>
              <div className="box-body !p-0">
                <div className="table-responsive">
                  <Spktables 
                    tableClass="ti-custom-table ti-custom-table-head w-full" 
                    Customcheckclass="!text-center" 
                    showCheckbox={true}
                    header={[
                      { title: 'Order ID', headerClassname: 'text-left' }, 
                      { title: 'Customer', }, 
                      { title: 'Amount', }, 
                      { title: 'Status', }, 
                      { title: 'Date', }, 
                      { title: 'Actions', headerClassname: 'text-center' }
                    ]}
                  >
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="text-left">
                          <span className="font-semibold">{order.orderId}</span>
                        </td>
                        <td>
                          <div className="flex items-center">
                            <div className="me-2 leading-none">
                              <span className="avatar avatar-sm">
                                <Image 
                                  width={32} 
                                  height={32}
                                  src={order.customerSrc} 
                                  alt={order.customerName}
                                  className="rounded-full"
                                />
                              </span>
                            </div>
                            <div>
                              <div className="text-[0.875rem] font-medium">{order.customerName}</div>
                              <div className="text-textmuted dark:text-textmuted/50 text-[0.75rem]">{order.customerEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="font-semibold text-[0.875rem]">{order.price}</span>
                        </td>
                        <td>
                          <span className={`badge bg-${order.statusColor}/[0.15] text-${order.statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span className="text-textmuted dark:text-textmuted/50">{order.date}</span>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => handleOrderAction(order.id, 'approve')}
                              className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-success btn-wave"
                              title="Approve"
                            >
                              <i className="ri-check-line"></i>
                            </button>
                            <button
                              onClick={() => handleOrderAction(order.id, 'ship')}
                              className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-info btn-wave"
                              title="Mark as Shipped"
                            >
                              <i className="ri-truck-line"></i>
                            </button>
                            <button
                              onClick={() => handleOrderAction(order.id, 'cancel')}
                              className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-danger btn-wave"
                              title="Cancel"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Spktables>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Start:: Recent Transactions --> */}
          <div className="xl:col-span-4 col-span-12">
            <div className="box overflow-hidden">
              <div className="box-header justify-between">
                <div className="box-title">Recent Transactions</div>
                <Link 
                  scroll={false} 
                  href="/admin/transactions"
                  className="text-[0.75rem] text-textmuted dark:text-textmuted/50 hover:text-primary"
                >
                  View All <i className="ti ti-arrow-narrow-right ms-1"></i>
                </Link>
              </div>
              <div className="box-body">
                <ul className="list-unstyled transactions-list">
                  {transactions.map((transaction) => (
                    <li key={transaction.id} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div>
                            <span className={`avatar avatar-sm ${transaction.bgClass} ${transaction.iconColor}`}>
                              <i className={`${transaction.icon} text-[1.125rem]`}></i>
                            </span>
                          </div>
                          <div>
                            <div className="block font-medium mb-1">{transaction.method}</div>
                            <div className="block text-[0.6875rem] text-textmuted dark:text-textmuted/50">{transaction.date}</div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="block font-medium">{transaction.amount}</div>
                          <div className={`text-[0.75rem] ${transaction.statusClass}`}>{transaction.status}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* <!-- End:: Recent Transactions --> */}
        </div>
        {/* <!-- End:: Recent Orders --> */}

        {/* <!-- Start:: Top Products --> */}
        <div className="grid grid-cols-12 gap-x-6 mb-6">
          <div className="xl:col-span-6 col-span-12">
            <div className="box overflow-hidden">
              <div className="box-header justify-between">
                <div className="box-title">Top Selling Products</div>
                <Link 
                  scroll={false} 
                  href="/admin/products"
                  className="text-[0.75rem] text-textmuted dark:text-textmuted/50 hover:text-primary"
                >
                  View All <i className="ti ti-arrow-narrow-right ms-1"></i>
                </Link>
              </div>
              <div className="box-body !p-0">
                <div className="table-responsive">
                  <Spktables 
                    tableClass="ti-custom-table ti-custom-table-head w-full" 
                    header={[
                      { title: 'Product', }, 
                      { title: 'Price', }, 
                      { title: 'Category', }, 
                      { title: 'Sales', }
                    ]}
                  >
                    {topProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <Link scroll={false} href={`/admin/products/${product.id}`}>
                            <div className="flex items-center">
                              <div className="me-2 leading-none">
                                <span className="avatar avatar-sm">
                                  <Image 
                                    width={32} 
                                    height={32}
                                    src={product.src} 
                                    alt={product.name}
                                    className="rounded"
                                  />
                                </span>
                              </div>
                              <div className="text-[0.875rem]">{product.name}</div>
                            </div>
                          </Link>
                        </td>
                        <td>
                          <span className="font-medium text-[0.875rem]">{product.price}</span>
                        </td>
                        <td>
                          <span className={`badge bg-${product.categoryColor}/[0.15] text-${product.categoryColor}`}>
                            {product.category}
                          </span>
                        </td>
                        <td>
                          <span className="font-medium text-[0.875rem]">{product.sales.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </Spktables>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Start:: User Management --> */}
          <div className="xl:col-span-6 col-span-12">
            <div className="box overflow-hidden">
              <div className="box-header justify-between">
                <div className="box-title">User Management</div>
                <Link 
                  scroll={false} 
                  href="/admin/users"
                  className="text-[0.75rem] text-textmuted dark:text-textmuted/50 hover:text-primary"
                >
                  View All <i className="ti ti-arrow-narrow-right ms-1"></i>
                </Link>
              </div>
              <div className="box-body !p-0">
                <div className="table-responsive">
                  <Spktables 
                    tableClass="ti-custom-table ti-custom-table-head w-full" 
                    header={[
                      { title: 'User', }, 
                      { title: 'Email', }, 
                      { title: 'Role', }, 
                      { title: 'Status', }, 
                      { title: 'Actions', headerClassname: 'text-center' }
                    ]}
                  >
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="flex items-center">
                            <div className="me-2 leading-none">
                              <span className="avatar avatar-sm">
                                <Image 
                                  width={32} 
                                  height={32}
                                  src={user.avatarUrl || '/images/avatar-placeholder.png'} 
                                  alt={user.username}
                                  className="rounded-full"
                                />
                              </span>
                            </div>
                            <div>
                              <div className="text-[0.875rem] font-medium">{user.username}</div>
                              <div className="text-textmuted dark:text-textmuted/50 text-[0.75rem]">
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-[0.875rem]">{user.email}</span>
                        </td>
                        <td>
                          <span className={`badge ${
                            user.role === 'ADMIN' 
                              ? 'bg-purple-500/[0.15] text-purple-500' 
                              : user.role === 'SELLER'
                              ? 'bg-blue-500/[0.15] text-blue-500'
                              : 'bg-gray-500/[0.15] text-gray-500'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            user.status === 'active'
                              ? 'bg-green-500/[0.15] text-green-500'
                              : user.status === 'inactive'
                              ? 'bg-yellow-500/[0.15] text-yellow-500'
                              : 'bg-red-500/[0.15] text-red-500'
                          }`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => handleUserAction(user.id, 'activate')}
                              className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-success btn-wave"
                              title="Activate"
                              disabled={user.status === 'active'}
                            >
                              <i className="ri-user-follow-line"></i>
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'deactivate')}
                              className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-warning btn-wave"
                              title="Deactivate"
                              disabled={user.status === 'inactive'}
                            >
                              <i className="ri-user-unfollow-line"></i>
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="ti-btn ti-btn-icon ti-btn-sm ti-btn-soft-danger btn-wave"
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Spktables>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- End:: User Management --> */}
        </div>
        {/* <!-- End:: Top Products --> */}

        {/* <!-- Start:: Quick Stats --> */}
        <div className="grid grid-cols-12 gap-x-6">
          <div className="xl:col-span-3 lg:col-span-6 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">Store Performance</div>
              </div>
              <div className="box-body">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">94.2%</div>
                  <div className="text-textmuted dark:text-textmuted/50 mb-4">Overall Performance</div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '94.2%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="xl:col-span-3 lg:col-span-6 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">Customer Satisfaction</div>
              </div>
              <div className="box-body">
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">4.8</div>
                  <div className="text-textmuted dark:text-textmuted/50 mb-4">Average Rating</div>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="ri-star-fill text-yellow-500 text-xl"></i>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="xl:col-span-3 lg:col-span-6 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">Active Sessions</div>
              </div>
              <div className="box-body">
                <div className="text-center">
                  <div className="text-3xl font-bold text-info mb-2">1,247</div>
                  <div className="text-textmuted dark:text-textmuted/50 mb-4">Current Active Users</div>
                  <div className="text-sm">
                    <span className="text-success">↑ 12%</span> from last hour
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="xl:col-span-3 lg:col-span-6 col-span-12">
            <div className="box">
              <div className="box-header">
                <div className="box-title">Server Status</div>
              </div>
              <div className="box-body">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">100%</div>
                  <div className="text-textmuted dark:text-textmuted/50 mb-4">Uptime</div>
                  <div className="flex items-center justify-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- End:: Quick Stats --> */}
      </div>
    </Fragment>
  )
}

export default AdminPage