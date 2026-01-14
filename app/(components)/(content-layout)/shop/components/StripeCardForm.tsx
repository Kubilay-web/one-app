// app/projects/components/checkout/StripeCardForm.tsx - GÜNCELLENMİŞ
"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useToast } from "@/app/projects/components/ui/use-toast";
import { CheckCircle, X, Loader2, ShieldCheck } from "lucide-react";

interface StripeCardFormProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCardForm = ({ amount, orderId, onSuccess, onCancel }: StripeCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe is not initialized");
      return;
    }

    if (!cardholderName.trim()) {
      setError("Please enter cardholder name");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create payment intent
      const paymentResponse = await fetch("/api/oneshop/checkout/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
          orderId: orderId,
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const { clientSecret, paymentIntentId } = await paymentResponse.json();

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
              address: {
                postal_code: postalCode,
              },
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed");
      }

      if (paymentIntent?.status === "succeeded") {
        // 3. Update order in database
        const orderResponse = await fetch("/api/oneshop/checkout/complete-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId: orderId,
            amount: amount,
            status: "succeeded",
          }),
        });

        if (!orderResponse.ok) {
          throw new Error("Failed to update order");
        }

        toast({
          title: "Payment Successful! 🎉",
          description: "Your payment has been processed successfully.",
        });

        onSuccess();
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "An error occurred during payment");
      toast({
        title: "Payment Failed",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "10px 12px",
      },
      invalid: {
        color: "#dc2626",
        iconColor: "#dc2626",
      },
      complete: {
        color: "#16a34a",
        iconColor: "#16a34a",
      },
    },
    hidePostalCode: false,
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Cardholder Name *
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
            disabled={isProcessing}
          />
        </div>

        {/* Card Details */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Card Details *
          </label>
          <div className={`p-4 border ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-900 transition-colors`}>
            <CardElement 
              options={cardElementOptions}
              onChange={(event) => {
                if (event.error) {
                  setError(event.error.message);
                } else {
                  setError(null);
                }
              }}
            />
          </div>
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Postal Code
          </label>
          <input
            type="text"
            placeholder="90210"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Card Icons */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-blue-700">VISA</span>
          </div>
          <div className="w-12 h-8 bg-red-100 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-red-700">MC</span>
          </div>
          <div className="w-12 h-8 bg-green-100 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-green-700">AMEX</span>
          </div>
          <div className="w-12 h-8 bg-yellow-100 rounded flex items-center justify-center">
            <span className="text-xs font-bold text-yellow-700">DISC</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
            disabled={isProcessing}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>

        {/* Security Info */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <ShieldCheck className="w-4 h-4" />
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>
          <p className="text-xs text-gray-400">
            We don't store your card details. Payments are processed securely by Stripe.
          </p>
        </div>
      </form>
    </div>
  );
};

export default StripeCardForm;