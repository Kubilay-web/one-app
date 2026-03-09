// types/invoice.ts
import { InvoiceStatus } from "@prisma/client";

export interface InvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  totalRevenuePaid: number;
  totalRevenueUnpaid: number;
}

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  dueDate: Date;
  remainingDays: number;
  status: InvoiceStatus;
  isPastDue: boolean;
}

export interface InvoiceDashboardData {
  stats: InvoiceStats;
  invoices: InvoiceListItem[];
}

export interface RecentActivity {
  id: string;
  type: "created" | "sent" | "viewed" | "paid" | "overdue";
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: Date;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  paid: number;
  unpaid: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  amount: number;
}