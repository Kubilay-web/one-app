"use client";
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";


import { PaymentForm } from "../../components/checkout/PaymentForm";
import { stripePromise } from "../../lib/stripe";

import { PricingPanel } from "../../components/checkout/PricingPanel";


import {
  pricingOptions,
  PricingTier,
  useSubscription,
} from "../../stores/subscription-store";
import { useRouter } from "next/navigation";

function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}
export default function CheckoutPage() {
  const { selectedPlan, setSelectedPlan } = useSubscription();
  const defaultPlan = selectedPlan ?? "monthly";
  const [selectedTier, setSelectedTier] = useState<PricingTier>(defaultPlan);

  const handleChangePlan = () => {
    setSelectedTier(selectedTier === "monthly" ? "yearly" : "monthly");
    setSelectedPlan(selectedTier === "monthly" ? "yearly" : "monthly");
  };

  const handleSubmit = async () => {
    // Payment processing is handled in the PaymentForm component
    // This function is called after successful payment
    window.location.href = "/invoice/success";
  };

  const currentPlan = pricingOptions[selectedTier];
  const discount = selectedTier === "yearly" ? 50 : 0; // Example discount for yearly plan
  const total = currentPlan.price - discount;
  // Redirect if no plan selected
  const router = useRouter();
  useEffect(() => {
    if (!selectedPlan) {
      router.push("/invoice/pricing");
    }
  }, [selectedPlan, router]);
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel - Pricing Information */}
        <div className="w-full md:w-2/5">
          <PricingPanel
            selectedTier={selectedTier}
            pricingOption={currentPlan}
            onChangePlan={handleChangePlan}
          />
        </div>

        {/* Right Panel - Payment Form */}
        <div className="w-full md:w-3/5">
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(total),
              currency: "usd",
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#1d4ed8",
                  colorBackground: "#ffffff",
                  colorText: "#1f2937",
                  colorDanger: "#ef4444",
                  fontFamily: "system-ui, sans-serif",
                  spacingUnit: "4px",
                  borderRadius: "8px",
                },
              },
            }}
          >
            <PaymentForm
              subtotal={currentPlan.price}
              discount={discount}
              total={total}
              selectedTier={selectedTier}
              onSubmit={handleSubmit}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}
