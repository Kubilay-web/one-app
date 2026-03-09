"use server";

import { revalidatePath } from "next/cache";
import  db  from "@/app/lib/db";

import { InvoiceStatus } from "@prisma/client";
import type {
  InvoiceDashboardData,
  InvoiceListItem,
  RecentActivity,
  MonthlyRevenue,
  StatusDistribution,
} from "../types/invoice";
import { validateRequest } from "@/app/auth";



// Fetch dashboard invoices and stats
export async function getInvoiceDashboardData(): Promise<InvoiceDashboardData> {
  const {user} = await validateRequest();
  if (!user?.id) throw new Error("Unauthorized");

  const userId = user.id;
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

  const invoices = await db.invoiceModel.findMany({
    where: {
      userId,
      invoiceDate: { gte: startOfYear, lte: endOfYear },
    },
    include: {
      client: { select: { companyName: true, contactPerson: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
  const totalRevenuePaid = invoices
    .filter((inv) => inv.status === InvoiceStatus.PAID)
    .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
  const totalRevenueUnpaid = totalRevenue - totalRevenuePaid;

  const today = new Date();
  const invoiceList: InvoiceListItem[] = invoices.map((inv) => {
    const dueDate = new Date(inv.dueDate);
    const remainingDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return {
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.client.companyName || inv.client.contactPerson,
      totalAmount: Number(inv.totalAmount),
      dueDate,
      remainingDays,
      status: inv.status,
      isPastDue: remainingDays < 0 && inv.status !== InvoiceStatus.PAID,
    };
  });

  return {
    stats: { totalInvoices, totalRevenue, totalRevenuePaid, totalRevenueUnpaid },
    invoices: invoiceList,
  };
}

// Monthly revenue chart
export async function getMonthlyRevenueData(): Promise<MonthlyRevenue[] | null> {
  const {user} = await validateRequest();
  if (!user?.id) throw new Error("Unauthorized");

  const userId = user.id;
  const currentYear = new Date().getFullYear();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const monthlyRevenue: MonthlyRevenue[] = await Promise.all(
    months.map(async (month, index) => {
      const startOfMonth = new Date(currentYear, index, 1);
      const endOfMonth = new Date(currentYear, index + 1, 0, 23, 59, 59);

      const monthInvoices = await db.invoiceModel.findMany({
        where: { userId, invoiceDate: { gte: startOfMonth, lte: endOfMonth } },
      });

      const revenue = monthInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
      const paid = monthInvoices
        .filter((inv) => inv.status === InvoiceStatus.PAID)
        .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

      return { month, revenue, paid, unpaid: revenue - paid };
    })
  );

  return monthlyRevenue;
}

// Recent activity
export async function getRecentInvoiceActivity(): Promise<RecentActivity[] | null> {
  const {user} = await validateRequest();
  if (!user?.id) throw new Error("Unauthorized");

  const userId = user.id;
  const recentInvoices = await db.invoiceModel.findMany({
    where: { userId, updatedAt: { gte: new Date(Date.now() - 30*24*60*60*1000) } },
    include: { client: { select: { companyName: true, contactPerson: true } } },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return recentInvoices.map((inv) => {
    let type: RecentActivity["type"] = "created";
    let date = inv.createdAt;

    if (inv.status === InvoiceStatus.PAID && inv.paidAt) { type = "paid"; date = inv.paidAt; }
    else if (inv.status === InvoiceStatus.OVERDUE) { type = "overdue"; date = inv.dueDate; }
    else if (inv.status === InvoiceStatus.VIEWED && inv.viewedAt) { type = "viewed"; date = inv.viewedAt; }
    else if (inv.status === InvoiceStatus.SENT && inv.sentAt) { type = "sent"; date = inv.sentAt; }

    return {
      id: inv.id,
      type,
      invoiceNumber: inv.invoiceNumber,
      clientName: inv.client.companyName || inv.client.contactPerson,
      amount: Number(inv.totalAmount),
      date,
    };
  });
}

// Status distribution
export async function getInvoiceStatusDistribution(): Promise<StatusDistribution[] | null> {
  const {user} = await validateRequest();
  if (!user?.id) throw new Error("Unauthorized");

  const userId = user.id;
  const currentYear = new Date().getFullYear();

  const grouped = await db.invoiceModel.groupBy({
    by: ["status"],
    where: { userId, invoiceDate: { gte: new Date(currentYear,0,1), lte: new Date(currentYear,11,31) } },
    _count: { status: true },
    _sum: { totalAmount: true },
  });

  const totalAmount = grouped.reduce((sum, item) => sum + Number(item._sum.totalAmount ?? 0), 0);

  return grouped.map(item => ({
    status: item.status,
    count: item._count.status,
    amount: Number(item._sum.totalAmount ?? 0),
  }));
}

// Update invoice
export async function updateInvoiceStatus(invoiceId: string, newStatus: InvoiceStatus) {
  await db.invoiceModel.update({ where: { id: invoiceId }, data: { status: newStatus } });
  revalidatePath(`/dashboard/invoices`);
  return { success: true };
}

// Delete invoice
export async function deleteInvoice(invoiceId: string) {
  await db.invoiceModel.delete({ where: { id: invoiceId } });
  revalidatePath(`/dashboard/invoices`);
  return { success: true };
}