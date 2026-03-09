"use server";




import { validateRequest } from "@/app/auth";
import db from "@/app/lib/db";
import { valid } from "joi";
import { notFound } from "next/navigation";

interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  logoUrl: string;
  contactInfo: string;
  paymentInfo: string;
  thankYouMessage: string;
  brandColor: string;

  billToContactPerson: string;
  billToCompanyName: string;
  billToLocation: string;
  billToPhone: string;

  invoiceNumber: string;
  invoiceDate: string;
  invoiceDueDate: string;
  customerID: string;
  preparedBy: string;

  items: Array<{
    quantity: number;
    description: string;
    unitPrice: number;
    amount: number;
  }>;

  subtotal: number;
  taxRate: number;
  salesTax: number;
  other: number;
  total: number;
}

export async function getInvoiceById(
  invoiceId: string
): Promise<InvoiceData> {
  try {
    const {user} = await validateRequest();

    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    const invoice = await db.invoiceModel.findFirst({
      where: {
        id: invoiceId,
        userId: user.id,
      },
      include: {
        client: true,
        items: {
          orderBy: {
            itemOrder: "asc",
          },
        },
        user: {
          include: {
            brand: true,
          },
        },
      },
    });

    if (!invoice) {
      notFound();
    }

    let brand = invoice.user.brand;

    if (!brand) {
      brand = await db.brand.create({
        data: {
          userId: user.id,
          name: invoice.user.name || "Your Company",
        },
      });
    }

    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    const calculatedTaxRate =
      invoice.subtotal > 0
        ? (invoice.taxAmount / invoice.subtotal) * 100
        : 0;

    const otherCharges =
      invoice.totalAmount - invoice.subtotal - invoice.taxAmount;

    return {
      companyName: brand.name || "Your Company",
      companyAddress: brand.address || "",
      brandColor: brand.brandColor || "#000000",
      companyPhone: brand.phone || "",
      companyEmail: brand.email || "",
      logoUrl: brand.logo || "",
      contactInfo: brand.contactInfo || "",
      paymentInfo: brand.paymentInfo || "",
      thankYouMessage: brand.thankYouMsg || "Thank you for your business!",

      billToContactPerson: invoice.client.contactPerson,
      billToCompanyName: invoice.client.companyName,
      billToLocation: invoice.client.location || "",
      billToPhone: invoice.client.phone || "",

      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: formatDate(invoice.invoiceDate),
      invoiceDueDate: formatDate(invoice.dueDate),
      customerID: invoice.client.customerID || "",
      preparedBy: invoice.preparedBy || "",

      items: invoice.items.map((item) => ({
        quantity: Number(item.quantity),
        description: item.description,
        unitPrice: Number(item.unitPrice),
        amount: Number(item.totalPrice),
      })),

      subtotal: Number(invoice.subtotal),
      taxRate: calculatedTaxRate,
      salesTax: Number(invoice.taxAmount),
      other: otherCharges,
      total: Number(invoice.totalAmount),
    };
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export async function getUserInvoiceById(
  invoiceId: string,
  userId: string
): Promise<InvoiceData> {
  const invoice = await db.invoiceModel.findFirst({
    where: {
      id: invoiceId,
      userId,
    },
    include: {
      client: true,
      items: {
        orderBy: {
          itemOrder: "asc",
        },
      },
      user: {
        include: {
          brand: true,
        },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  const brand = invoice.user.brand;

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const calculatedTaxRate =
    invoice.subtotal > 0
      ? (invoice.taxAmount / invoice.subtotal) * 100
      : 0;

  const otherCharges =
    invoice.totalAmount - invoice.subtotal - invoice.taxAmount;

  return {
    companyName: brand?.name || "Your Company",
    companyAddress: brand?.address || "",
    brandColor: brand?.brandColor || "#000000",
    companyPhone: brand?.phone || "",
    companyEmail: brand?.email || "",
    logoUrl: brand?.logo || "",
    contactInfo: brand?.contactInfo || "",
    paymentInfo: brand?.paymentInfo || "",
    thankYouMessage: brand?.thankYouMsg || "Thank you for your business!",

    billToContactPerson: invoice.client.contactPerson,
    billToCompanyName: invoice.client.companyName,
    billToLocation: invoice.client.location || "",
    billToPhone: invoice.client.phone || "",

    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: formatDate(invoice.invoiceDate),
    invoiceDueDate: formatDate(invoice.dueDate),
    customerID: invoice.client.customerID || "",
    preparedBy: invoice.preparedBy || "",

    items: invoice.items.map((item) => ({
      quantity: Number(item.quantity),
      description: item.description,
      unitPrice: Number(item.unitPrice),
      amount: Number(item.totalPrice),
    })),

    subtotal: Number(invoice.subtotal),
    taxRate: calculatedTaxRate,
    salesTax: Number(invoice.taxAmount),
    other: otherCharges,
    total: Number(invoice.totalAmount),
  };
}

export async function getInvoiceMetadata(invoiceId: string) {
  const {user} = await validateRequest();

  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const invoice = await db.invoiceModel.findFirst({
    where: {
      id: invoiceId,
      userId: user.id,
    },
    select: {
      invoiceNumber: true,
      totalAmount: true,
      status: true,
      client: {
        select: {
          companyName: true,
          contactPerson: true,
        },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  return {
    invoiceNumber: invoice.invoiceNumber,
    clientName:
      invoice.client.companyName || invoice.client.contactPerson,
    totalAmount: Number(invoice.totalAmount),
    status: invoice.status,
  };
}