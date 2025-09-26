'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface CheckoutPageProps {
  searchParams: { id?: string };
}

export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any[]>([]);
  const [payStatus, setPayStatus] = useState<any>({});

  const router = useRouter();
  const id = searchParams?.id;

  useEffect(() => {
    if (id) {
      fetchPlan();
      fetchPaymentSettings();
    }
  }, [id]);

  const fetchPlan = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/${id}`);
      const data = await res.json();
      if (!res.ok) toast.error(data.err || 'Plan fetch failed');
      else setPlan(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      toast.error('Plan fetch failed');
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/paymentsettings`);
      const data = await res.json();
      if (!res.ok) toast.error(data.err || 'Payment settings fetch failed');
      else setPayStatus(data.settings);
    } catch (err) {
      console.error(err);
      toast.error('Payment settings fetch failed');
    }
  };

  const handlePaypal = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/paypalpayment/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.approvalUrl) window.location.href = data.approvalUrl;
      else toast.error('Payment failed');
    } catch (err) {
      console.error(err);
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStripe = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/stripe/${id}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) toast.error(data.err || 'Payment failed');
      else window.location.href = data.id;
    } catch (err) {
      console.error(err);
      toast.error('Payment failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative w-full h-64 md:h-96 bg-cover bg-center"
        style={{ backgroundImage: 'url("/assets/images/jobportal/dee.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute left-4 top-4 text-white">
          <h6 className="text-sm md:text-base">Home &gt; Checkout</h6>
          <h2 className="text-2xl md:text-4xl font-bold mt-2">Payment</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Payment Gateways */}
        <div className="lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-6">Choose Payment Gateway</h3>
          <div className="flex flex-wrap gap-6">
            {payStatus?.paypalStatus === 'true' && (
              <button onClick={handlePaypal} className="border rounded-lg p-4 hover:shadow-lg transition">
                <Image src="/assets/images/jobportal/paypal.png" alt="PayPal" width={120} height={60} style={{ objectFit: 'contain' }} />
              </button>
            )}
            {payStatus?.stripeStatus === 'true' && (
              <button onClick={handleStripe} className="border rounded-lg p-4 hover:shadow-lg transition">
                <Image src="/assets/images/jobportal/stripe.png" alt="Stripe" width={120} height={60} style={{ objectFit: 'contain' }} />
              </button>
            )}
          </div>
        </div>

        {/* Plan Details */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          {plan.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="p-6 border-b">
                <h5 className="text-xl font-semibold mb-2">{item.leble}</h5>
                {item.recommended && <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs">Recommended</span>}
              </div>
              <div className="p-6 text-center bg-indigo-500 text-white">
                <span className="text-3xl font-bold">${item.price}</span>
              </div>
              <ul className="p-6 space-y-2 text-gray-700">
                <li>Job Limit: {item.joblimit}</li>
                <li>Featured Job Limit: {item.featuredjoblimit}</li>
                <li>Highlight Job Limit: {item.highlightjoblimit}</li>
                <li>
                  Recommended: {item.recommended ? <FaCheck className="inline text-blue-500 ml-2" /> : <FaTimes className="inline text-red-500 ml-2" />}
                </li>
                <li>
                  Company Verified: {item.profileverify ? <FaCheck className="inline text-blue-500 ml-2" /> : <FaTimes className="inline text-red-500 ml-2" />}
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
