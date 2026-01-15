"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home, Package, Truck, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image: string;
  size: string;
  sku: string;
  status: string;
}

interface OrderGroup {
  id: string;
  status: string;
  shippingService: string;
  shippingDeliveryMin: number;
  shippingDeliveryMax: number;
  shippingFees: number;
  subTotal: number;
  total: number;
  items: OrderItem[];
  store: {
    id: string;
    name: string;
    logo: string;
    email: string;
    phone: string;
  };
  coupon?: {
    code: string;
    discount: number;
  };
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: {
    name: string;
  };
}

interface PaymentDetails {
  paymentMethod: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface OrderData {
  id: string;
  orderStatus: string;
  paymentStatus: string;
  shippingFees: number;
  subTotal: number;
  total: number;
  createdAt: string;
  groups: OrderGroup[];
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
}

const steps = [
  { id: 1, name: 'Order Placed', icon: Package, description: 'Your order has been received' },
  { id: 2, name: 'Processing', icon: CreditCard, description: 'Payment confirmed' },
  { id: 3, name: 'Shipped', icon: Truck, description: 'Items are on the way' },
  { id: 4, name: 'Delivered', icon: CheckCircle, description: 'Order delivered successfully' },
];

const getStatusStep = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 1;
    case 'confirmed':
    case 'processing':
      return 2;
    case 'shipped':
    case 'outfordelivery':
    case 'partiallyshipped':
      return 3;
    case 'delivered':
      return 4;
    default:
      return 1;
  }
};

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [params.orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/oneshop/order/${params.orderId}`);
      if (!response.ok) {
        throw new Error('Order not found');
      }
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`/api/oneshop/order/${params.orderId}/invoice`);
      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${params.orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getStatusStep(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
              <p className="mt-1 text-gray-600">
                Thank you for your purchase. Your order #{order.id.slice(0, 8)} has been confirmed.
              </p>
              <p className="mt-2 text-gray-600">
                We've sent a confirmation email with your order details and tracking information.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Progress & Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const isCompleted = index + 1 <= currentStep;
                    const isCurrent = index + 1 === currentStep;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            isCompleted
                              ? 'bg-blue-600 border-blue-600'
                              : isCurrent
                              ? 'bg-white border-blue-600'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <step.icon className={`w-5 h-5 ${
                            isCompleted ? 'text-white' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                        </motion.div>
                        <div className="mt-4 text-center">
                          <p className={`text-sm font-medium ${
                            isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {step.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h3>
              
              {order.groups.map((group) => (
                <div key={group.id} className="mb-8 last:mb-0">
                  {/* Store Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                      {group.store.logo && (
                        <img
                          src={group.store.logo}
                          alt={group.store.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{group.store.name}</h4>
                        <p className="text-sm text-gray-500">
                          Order Status: <span className="font-medium capitalize">{group.status.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Store Contact</p>
                      <p className="font-medium text-gray-900">{group.store.email}</p>
                      <p className="text-sm text-gray-500">{group.store.phone}</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 overflow-hidden">
                            <img
                              src={item.image || '/placeholder-image.jpg'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                              <span>SKU: {item.sku}</span>
                              <span>Size: {item.size}</span>
                              <span className="capitalize">Status: {item.status.toLowerCase()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="font-medium text-gray-900 mt-1">${item.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Group Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>${group.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Shipping</span>
                      <span>${group.shippingFees.toFixed(2)}</span>
                    </div>
                    {group.coupon && (
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>Discount ({group.coupon.code})</span>
                        <span className="text-green-600">-${group.coupon.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold text-gray-900 mt-3 pt-3 border-t border-gray-200">
                      <span>Store Total</span>
                      <span>${group.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-medium">{order.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status</span>
                  <span className="font-medium capitalize px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {order.orderStatus.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-medium capitalize px-3 py-1 rounded-full text-sm ${
                    order.paymentStatus === 'Paid' 
                      ? 'bg-green-50 text-green-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${order.shippingFees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions</h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleDownloadInvoice}
                  disabled={downloading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {downloading ? 'Generating Invoice...' : 'Download Invoice'}
                </button>
                
                <Link
                  href="/shop"
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipping Address</h3>
              
              <div className="space-y-2">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-600">{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && (
                  <p className="text-gray-600">{order.shippingAddress.address2}</p>
                )}
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip_code}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country.name}</p>
                <p className="text-gray-600 mt-2">📞 {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Details */}
            {order.paymentDetails && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Details</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium capitalize">{order.paymentDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium capitalize ${
                      order.paymentDetails.status === 'Paid' 
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}>
                      {order.paymentDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">
                      {order.paymentDetails.amount} {order.paymentDetails.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid On</span>
                    <span className="font-medium">
                      {format(new Date(order.paymentDetails.createdAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Need Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">
              If you have any questions about your order, our customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@example.com"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Contact Support
              </a>
              <a
                href="/shop/faq"
                className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Visit FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}