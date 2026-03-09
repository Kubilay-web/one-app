// Enums based on schema
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SERVICE_PROVIDER = "SERVICE_PROVIDER",
}

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

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  VIEWED = "VIEWED",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export enum InvoiceTemplate {
  PROFESSIONAL = "PROFESSIONAL",
  MODERN = "MODERN",
  CLASSIC = "CLASSIC",
  MINIMAL = "MINIMAL",
}

// Types
export interface UserDetailsResponse {
  user: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    jobTitle: string | null;
    role: UserRole;
    status: string;
    isVerified: boolean;
    createdAt: string;
    totalInvoicesCreated: number;
    dailyInvoicesCreated: number;
    lastInvoiceDate: string | null;
    subscription: {
      plan: SubscriptionPlan;
      status: SubscriptionStatus;
      currentPeriodEnd: string | null;
      stripeCustomerId: string | null;
    } | null;
  };
  brand: {
    id: string;
    name: string;
    logo: string | null;
    currency: string | null;
    slogan: string | null;
    phone: string | null;
    address: string | null;
    email: string | null;
    brandColor: string | null;
    template: InvoiceTemplate;
    paymentInfo: string | null;
    thankYouMsg: string | null;
    contactInfo: string | null;
    taxRate: number | null;
    salesTax: number | null;
    otherCharges: number | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  metrics: UserMetrics;
  invoices: {
    data: Array<{
      id: string;
      invoiceNumber: string;
      invoiceDate: string;
      dueDate: string;
      status: InvoiceStatus;
      subtotal: number;
      taxAmount: number;
      totalAmount: number;
      client: {
        contactPerson: string;
        companyName: string;
      };
      createdAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  clients: {
    data: Array<{
      id: string;
      contactPerson: string;
      companyName: string;
      location: string | null;
      phone: string | null;
      email: string | null;
      isActive: boolean;
      invoiceCount: number;
      createdAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserMetrics {
  totalInvoices: number;
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalClients: number;
  dailyInvoicesUsed: number;
  dailyInvoicesLimit: number;
  remainingDailyInvoices: number;
}

export interface UserProfileUpdateData {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  jobTitle?: string;
}