"use server";

import db from "@/app/lib/db";
import { CategoryProps, InvoiceDetails, PaymentProps } from "../types/types";



import { revalidatePath } from "next/cache";

export async function createPayment(data: PaymentProps) {
  try {
    const payment = await db.payment.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/oneproject/dashboard/projects");
    return payment;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getInvoiceById(id: string) {
  try {
    const payment = await db.payment.findUnique({
      where: {
        id,
      },
    });
    if (!payment) {
      return null;
    }
    const client = await db.user.findUnique({
      where: {
        id: payment?.clientId,
        role: "CLIENT",
      },
      select: {
        name: true,
        phone: true,
        email: true,
        companyName: true,
        companyDescription: true,
      },
    });
    const user = await db.user.findFirst({
      where: {
        id: payment?.userId,
        OR: [{ role: "USER" }, { role: "ADMIN" }],
      },
      select: {
        name: true,
        phone: true,
        email: true,
        companyName: true,
        companyDescription: true,
        userLogo: true,
      },
    });
    return {
      invoice: payment,
      user,
      client,
    } as InvoiceDetails;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function updateCategoryById(id: string, data: CategoryProps) {
  try {
    const updatedCategory = await db.categoryProject.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/oneproject/dashboard/categories");
    return updatedCategory;
  } catch (error) {
    console.log(error);
  }
}
export async function getCategoryById(id: string) {
  try {
    const category = await db.categoryProject.findUnique({
      where: {
        id,
      },
    });
    return category;
  } catch (error) {
    console.log(error);
  }
}
export async function deletePayment(id: string) {
  try {
    const deletedPayment = await db.payment.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/project");
    return {
      ok: true,
      data: deletePayment,
    };
  } catch (error) {
    console.log(error);
  }
}
