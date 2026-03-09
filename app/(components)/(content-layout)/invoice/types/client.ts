
// Types based on schema
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  VIEWED = "VIEWED",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export interface ClientData {
  id: string;
  contactPerson: string;
  companyName: string;
  location: string | null;
  phone: string | null;
  email: string | null;
  customerID: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Stats
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

export interface ClientInvoiceData {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  isPastDue: boolean;
  remainingDays: number;
  preparedBy: string | null;
}

export interface CreateClientData {
  contactPerson: string;
  companyName: string;
  location?: string | null;
  phone?: string | null;
  email?: string | null;
  customerID?: string | null;
  notes?: string | null;
  isActive?: boolean;
}

export interface UpdateClientData {
  contactPerson?: string;
  companyName?: string;
  location?: string | null;
  phone?: string | null;
  email?: string | null;
  customerID?: string | null;
  notes?: string | null;
  isActive?: boolean;
}
