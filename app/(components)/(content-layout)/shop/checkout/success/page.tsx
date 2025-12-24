"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Home } from 'lucide-react';
import { useToast } from '@/app/projects/components/ui/use-toast';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;

      try {
        const response = await fetch(`/api/oneshop/checkout/verify?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error('Payment verification failed');
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Clear cart
          localStorage.removeItem('cart');
          toast({
            title: "Payment Successful!",
            description: "Your payment has been processed successfully.",
          });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, toast]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
        
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
          We've sent a confirmation email with your order details.
        </p>

        {sessionId && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Transaction ID:
            </p>
            <p className="font-mono text-sm break-all">{sessionId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/shop/orders"
            className="block w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              View Your Orders
            </div>
          </Link>
          
          <Link
            href="/shop"
            className="block w-full py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}