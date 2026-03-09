"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, AlertTriangle } from "lucide-react";




import { useSubscription } from "../../stores/subscription-store";

import { cancelSubscription, createCustomerPortalSession } from "../../actions/billing-actions";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "REFUNDED";
  description: string | null;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  interval: string | null;
  paidAt?: string;
  failedAt?: string;
  refundedAt?: string;
  receiptUrl?: string | null;
  invoiceUrl?: string | null;
  createdAt: string;
}

interface Subscription {
  id: string;
  plan: "FREE" | "MONTHLY" | "YEARLY";
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  cancelAt?: string;
  priceAmount?: number;
  priceCurrency: string;
  interval?: string;
}

interface BillingClientProps {
  initialSubscription: Subscription | null;
  initialPayments: Payment[];
  invoiceCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  userEmail: string;
}

const BillingClient: React.FC<BillingClientProps> = ({
  initialSubscription,
  initialPayments,
  pagination,
  userEmail,
  invoiceCount,
}) => {
  const router = useRouter();
  const { setSelectedPlan } = useSubscription();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCancelSubscription = () => {
    startTransition(async () => {
      try {
        const result = await cancelSubscription(false);

        if (result.success) {
          setShowCancelConfirm(false);
          router.refresh(); // Refresh server component data
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError("Failed to cancel subscription");
        console.error("Error cancelling subscription:", error);
      }
    });
  };

  const handleChangePlan = (newPlan: "monthly" | "yearly") => {
    setSelectedPlan(newPlan);
    router.push("/invoice/checkout");
  };

  const handleManageSubscription = () => {
    startTransition(async () => {
      try {
        const result = await createCustomerPortalSession();

        if (result.success && result.url) {
          window.location.href = result.url;
        } else {
          setError(result.message || "Failed to create portal session");
        }
      } catch (error) {
        setError("Failed to create portal session");
        console.error("Error creating portal session:", error);
      }
    });
  };
  const plan = initialSubscription ? initialSubscription.plan : "FREE";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Current Plan Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {plan === "FREE" ? "Free Plan" : "Pro plan"}
                </h2>
                <div className="flex gap-4 items-center">
                  <p className="text-gray-600">
                    {plan === "FREE"
                      ? "Free"
                      : initialSubscription?.plan === "MONTHLY"
                        ? "Monthly"
                        : "Yearly"}
                  </p>
                  {/* <p className="text-gray-600 text-sm">
                    You have{" "}
                    <span className="font-bold"> {5 - invoiceCount}</span>{" "}
                    invoices remaining
                  </p> */}
                </div>
                {initialSubscription?.currentPeriodEnd && (
                  <p className="text-sm text-gray-500">
                    Your subscription will auto renew on{" "}
                    {formatDate(initialSubscription.currentPeriodEnd)}.
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowChangePlan(true)}
              disabled={isPending}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isPending ? "Loading..." : "Change plan"}
            </button>
          </div>
        </div>

        {/* Payment Method Card */}
        {initialSubscription && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Payment
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">link</span>
                </div>
                <span className="text-gray-900">Link by Stripe</span>
              </div>
              <button
                onClick={handleManageSubscription}
                disabled={isPending}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isPending ? "Loading..." : "Update"}
              </button>
            </div>
          </div>
        )}

        {/* Invoices Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Payment Invoices
          </h2>

          {initialPayments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">
                        Total
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {initialPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="py-4 text-gray-900">
                          {payment.paidAt
                            ? formatDate(payment.paidAt)
                            : formatDate(payment.createdAt)}
                        </td>
                        <td className="py-4 text-gray-900 font-medium">
                          {formatPrice(payment.amount, payment.currency)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === "SUCCEEDED"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "FAILED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {payment.status === "SUCCEEDED"
                              ? "Paid"
                              : payment.status}
                          </span>
                        </td>
                        <td className="py-4">
                          {payment.invoiceUrl ? (
                            <a
                              href={payment.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
                            >
                              View
                            </a>
                          ) : payment.receiptUrl ? (
                            <a
                              href={payment.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
                            >
                              View
                            </a>
                          ) : (
                            <span className="px-3 py-1 text-gray-400 text-sm">
                              View
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {initialPayments.length} of {pagination.totalCount}{" "}
                    invoices
                  </div>
                  <div className="flex space-x-2">
                    {pagination.hasPrevPage && (
                      <button
                        onClick={() =>
                          router.push(
                            `/billing?page=${pagination.currentPage - 1}`
                          )
                        }
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
                      >
                        Previous
                      </button>
                    )}
                    {pagination.hasNextPage && (
                      <button
                        onClick={() =>
                          router.push(
                            `/billing?page=${pagination.currentPage + 1}`
                          )
                        }
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No invoices found</p>
            </div>
          )}
        </div>

        {/* Cancellation Card */}
        {initialSubscription && initialSubscription.plan !== "FREE" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Cancellation
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Cancel plan</span>
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isPending ? "Loading..." : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {/* Change Plan Modal */}
        {showChangePlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change Your Plan
              </h3>
              <p className="text-gray-600 mb-6">
                Choose a new plan that better fits your needs.
              </p>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => {
                    setShowChangePlan(false);
                    handleChangePlan("monthly");
                  }}
                  className="w-full p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Monthly Plan
                      </h4>
                      <p className="text-sm text-gray-600">
                        $20/month • Billed monthly
                      </p>
                    </div>
                    {initialSubscription?.plan === "MONTHLY" && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowChangePlan(false);
                    handleChangePlan("yearly");
                  }}
                  className="w-full p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Yearly Plan</h4>
                      <p className="text-sm text-gray-600">
                        $200/year • Save $40
                      </p>
                    </div>
                    {initialSubscription?.plan === "YEARLY" && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowChangePlan(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancel Subscription
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your subscription? You'll still
                have access until the end of your current billing period.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Keep Plan
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Cancelling..." : "Cancel Plan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingClient;
