"use client";
import React, { useState, FormEvent, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";




import { PricingTier,useSubscription } from "../../stores/subscription-store";
import { useSession } from "@/app/SessionProvider";


interface PaymentFormProps {
  subtotal: number;
  discount?: number;
  total: number;
  selectedTier: PricingTier;
  onSubmit: () => void;
}
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const PaymentForm: React.FC<PaymentFormProps> = ({
  subtotal,
  discount = 0,
  total,
  selectedTier,
  onSubmit,
}) => {

  const {user}=useSession();

  
  const { selectedPlanDetails, clearSelectedPlan } = useSubscription();
  const userMail = user.email || "";
  const [email, setEmail] = useState(userMail);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!selectedPlanDetails || !user) {
        return;
      }
      try {
        const response = await fetch(`${baseUrl}/invoice/api/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: selectedPlanDetails.stripePriceId,
            email: user.email,
            name: user.username,
            planType: selectedPlanDetails.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.client_secret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        setPaymentError(
          error instanceof Error ? error.message : "Payment failed"
        );
      }
    };

    if (email) {
      createPaymentIntent();
    }
  }, [selectedTier, email]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        throw new Error(submitError.message || "Payment submission failed");
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.origin + "/invoice/success",
          payment_method_data: {
            billing_details: {
              email: email,
            },
          },
        },
      });

      if (error) {
        throw new Error(error.message || "Payment failed");
      }
      clearSelectedPlan();

      // If we get here, the payment UI automatically closes with a success animation
      // and the customer is redirected to the return_url
      onSubmit();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error instanceof Error ? error.message : "Payment failed"
      );
      setIsProcessing(false);
    }
  };
  console.log(clientSecret);
  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">Your details</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        <div className="font-medium">Payment</div>
        <button type="button" className="text-blue-600 hover:text-blue-800">
          Back
        </button>
      </div>

      <div className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Payment Element */}
        {clientSecret ? (
          <div className="space-y-4">
            <PaymentElement />

            {paymentError && (
              <div className="text-red-500 text-sm mt-2">{paymentError}</div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Discount offer</span>
              <span className="font-medium text-green-600">- ${discount}</span>
            </div>
          )}
          <div className="flex justify-between mt-4">
            <span className="text-lg font-medium">Total Amount</span>
            <span className="text-lg font-bold">${total}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || !elements || !clientSecret || isProcessing}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
            isProcessing || !clientSecret ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isProcessing ? "Processing..." : `Pay $${total}`}
        </button>
      </div>
    </form>
  );
};
