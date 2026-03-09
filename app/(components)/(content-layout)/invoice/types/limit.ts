
export enum SubscriptionPlan {
  FREE = "FREE",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELLED = "CANCELLED",
  PAST_DUE = "PAST_DUE",
  TRIALING = "TRIALING",
  INCOMPLETE = "INCOMPLETE",
  INCOMPLETE_EXPIRED = "INCOMPLETE_EXPIRED",
  UNPAID = "UNPAID",
}

// Types
export type InvoiceQuotaResponse = {
  remaining: number;
  dailyLimit: number;
  totalUsedToday: number;
  hasUnlimited: boolean;
  resetTime: Date;
  plan: SubscriptionPlan;
  isActive: boolean;
};

export type PlanLimitsResponse = {
  maxDailyInvoices: number | null;
  maxClients: number | null;
  customBranding: boolean;
  prioritySupport: boolean;
  teamAccess: boolean;
  exportFormats: string[];
  canRemoveBranding: boolean;
  plan: SubscriptionPlan;
};