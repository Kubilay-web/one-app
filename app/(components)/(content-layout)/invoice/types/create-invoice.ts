

// Enums based on schema
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

export enum SubscriptionPlan {
  FREE = "FREE",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

// Interfaces
export interface InvoiceItemData {
  quantity: number;
  description: string;
  unitPrice: number;
  amount: number;
  itemOrder?: number;
}

export interface CreateInvoiceData {
  // Brand/Company Info (optional - will use existing brand if available)
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  logoUrl?: string;
  contactInfo?: string;
  paymentInfo?: string;
  thankYouMessage?: string;

  // Client Info
  billToContactPerson: string;
  billToCompanyName: string;
  billToLocation: string;
  billToPhone: string;
  billToEmail?: string;
  customerID?: string;

  // Invoice Details
  invoiceNumber?: string;
  invoiceDate: string;
  invoiceDueDate: string;
  preparedBy: string;

  // Financial Data
  items: InvoiceItemData[];
  subtotal: number;
  taxRate?: number;
  salesTax?: number;
  other?: number;
  total: number;
  notes?: string;
  terms?: string;
}

export interface UpdateInvoiceData {
  clientId?: string;
  dueDate?: string;
  preparedBy?: string;
  notes?: string;
  terms?: string;
  status?: InvoiceStatus;
  items?: InvoiceItemData[];
  subtotal?: number;
  taxAmount?: number;
  totalAmount?: number;
}

export interface InvoiceWithRelations {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  preparedBy: string | null;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes: string | null;
  terms: string | null;
  sentAt: string | null;
  viewedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    contactPerson: string;
    companyName: string;
    location: string | null;
    phone: string | null;
    email: string | null;
    customerID: string | null;
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemOrder: number | null;
  }>;
  brand?: {
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
  } | null;
}