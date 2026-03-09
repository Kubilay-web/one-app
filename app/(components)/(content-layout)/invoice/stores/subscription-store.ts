// stores/subscription-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PricingTier = "free" | "monthly" | "yearly";

export interface PricingOption {
  id: PricingTier;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  stripePriceId?: string;
}

export const MONTHLY_PRICE = 20;
export const YEARLY_PRICE = 200;

export const pricingOptions: Record<PricingTier, PricingOption> = {
  free: {
    id: "free",
    name: "Free Plan",
    price: 0,
    interval: "forever",
    description: "Get started with basic features",
    features: [
      "2 free invoices per day",
      "All invoice templates",
      "Custom branding",
      "No watermarks",
      "Email sending",
      "Client auto-creation",
      "Basic support",
    ],
  },
  // monthly: {
  //   id: "monthly",
  //   name: "Monthly Plan",
  //   price: MONTHLY_PRICE,
  //   interval: "month",
  //   description: "Perfect for individuals and small businesses",
  //   stripePriceId: process.env.INVOICE_STRIPE_MONTHLY_ID,
  //   features: [
  //     "Unlimited invoices",
  //     "All invoice templates",
  //     "Client management",
  //     "Export to PDF/CSV",
  //     "Email support",
  //     "Priority features",
  //   ],
  // },
  // yearly: {
  //   id: "yearly",
  //   name: "Yearly Plan",
  //   price: YEARLY_PRICE,
  //   interval: "year",
  //   description: "Best value for businesses",
  //   stripePriceId: process.env.INVOICE_STRIPE_YEARLY_ID,
  //   features: [
  //     "Unlimited invoices",
  //     "All invoice templates",
  //     "Client management",
  //     "Export to PDF/CSV",
  //     "Priority support",
  //     "Custom branding",
  //     "Team access",
  //     "Advanced analytics",
  //   ],
  // },

  monthly: {
    id: "monthly",
    name: "Monthly Plan",
    price: MONTHLY_PRICE,
    interval: "month",
    description: "Perfect for individuals and small businesses",
    stripePriceId: process.env.NEXT_PUBLIC_INVOICE_STRIPE_MONTHLY_ID,
    features: [
      "Unlimited invoices",
      "All invoice templates",
      "Client management",
      "Export to PDF/CSV",
      "Email support",
      "Priority features",
    ],
  },
  yearly: {
    id: "yearly",
    name: "Yearly Plan",
    price: YEARLY_PRICE,
    interval: "year",
    description: "Best value for businesses",
    stripePriceId: process.env.NEXT_PUBLIC_INVOICE_STRIPE_YEARLY_ID,
    features: [
      "Unlimited invoices",
      "All invoice templates",
      "Client management",
      "Export to PDF/CSV",
      "Priority support",
      "Custom branding",
      "Team access",
      "Advanced analytics",
    ],
  },
};

interface SubscriptionState {
  // Selected plan
  selectedPlan: PricingTier | null;
  selectedPlanDetails: PricingOption | null;

  // User subscription status
  currentSubscription: {
    plan: "FREE" | "MONTHLY" | "YEARLY";
    status: string;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  } | null;

  // Invoice usage (for free plan limits)
  invoiceCount: number;
  maxInvoices: number;

  // Loading states
  isLoading: boolean;

  // Actions
  setSelectedPlan: (plan: PricingTier) => void;
  clearSelectedPlan: () => void;
  setCurrentSubscription: (subscription: any) => void;
  setInvoiceCount: (count: number) => void;
  incrementInvoiceCount: () => void;
  setLoading: (loading: boolean) => void;

  // Computed properties
  canCreateInvoice: () => boolean;
  getRemainingInvoices: () => number;
  // isSubscribed: () => boolean;
  // isPremium: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedPlan: null,
      selectedPlanDetails: null,
      currentSubscription: null,
      invoiceCount: 0,
      maxInvoices: 2, // Free plan limit
      isLoading: false,

      // Actions
      setSelectedPlan: (plan: PricingTier) => {
        const planDetails = pricingOptions[plan];
        set({
          selectedPlan: plan,
          selectedPlanDetails: planDetails,
        });
      },

      clearSelectedPlan: () => {
        set({
          selectedPlan: null,
          selectedPlanDetails: null,
        });
      },

      setCurrentSubscription: (subscription) => {
        set({ currentSubscription: subscription });
      },

      setInvoiceCount: (count: number) => {
        set({ invoiceCount: count });
      },

      incrementInvoiceCount: () => {
        const { invoiceCount } = get();
        set({ invoiceCount: invoiceCount + 1 });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Computed properties
      canCreateInvoice: () => {
        const { currentSubscription, invoiceCount, maxInvoices } = get();

        // If user has active subscription, they can create unlimited invoices
        if (
          currentSubscription &&
          (currentSubscription.plan === "MONTHLY" ||
            currentSubscription.plan === "YEARLY") &&
          currentSubscription.status === "ACTIVE"
        ) {
          return true;
        }

        // For free plan, check if they haven't exceeded the limit
        return invoiceCount < maxInvoices;
      },

      getRemainingInvoices: () => {
        const { currentSubscription, invoiceCount, maxInvoices } = get();

        // If user has active subscription, return unlimited (-1)
        if (
          currentSubscription &&
          (currentSubscription.plan === "MONTHLY" ||
            currentSubscription.plan === "YEARLY") &&
          currentSubscription.status === "ACTIVE"
        ) {
          return -1; // Unlimited
        }

        // For free plan, return remaining invoices
        return Math.max(0, maxInvoices - invoiceCount);
      },
    }),
    {
      name: "subscription-storage",
      // Only persist essential data, not loading states
      partialize: (state) => ({
        selectedPlan: state.selectedPlan,
        selectedPlanDetails: state.selectedPlanDetails,
        currentSubscription: state.currentSubscription,
        invoiceCount: state.invoiceCount,
        maxInvoices: state.maxInvoices,
      }),
    },
  ),
);

// Hook for easier usage
export const useSubscription = () => {
  const store = useSubscriptionStore();

  return {
    ...store,
    // Additional helper methods
    selectPlanAndRedirect: (plan: PricingTier, router: any) => {
      store.setSelectedPlan(plan);
      router.push("/invoice/checkout");
    },

    // Get plan features
    getCurrentPlanFeatures: () => {
      const { currentSubscription } = store;
      if (!currentSubscription || currentSubscription.plan === "FREE") {
        return [
          "Up to 5 invoices",
          "Basic templates",
          "PDF export",
          "Email support",
        ];
      }

      if (currentSubscription.plan === "MONTHLY") {
        return pricingOptions.monthly.features;
      }

      return pricingOptions.yearly.features;
    },

    // Format subscription status for display
    getSubscriptionStatusDisplay: () => {
      const { currentSubscription } = store;
      if (!currentSubscription) return "Free Plan";

      const planName =
        currentSubscription.plan === "MONTHLY"
          ? "Monthly"
          : currentSubscription.plan === "YEARLY"
            ? "Yearly"
            : "Free";

      return `${planName} Plan - ${currentSubscription.status}`;
    },
  };
};
