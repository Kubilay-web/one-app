import { NextRequest, NextResponse } from "next/server";

import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";



// Adjust import path as needed

export async function GET(request: NextRequest) {
  try {
    const {user} = await validateRequest();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await db.user.findUnique({
      where: { email: user.email },
      include: { subscription: true },
    });

    if (!users) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get plan limits
    const planLimits = await db.planLimit.findUnique({
      where: {
        plan: users.subscription?.plan || "FREE",
      },
    });

    return NextResponse.json({
      invoiceCount: users.invoiceCount,
      maxInvoices: planLimits?.maxDailyInvoices || 5,
      maxClients: planLimits?.maxClients,
      customBranding: planLimits?.customBranding || false,
      prioritySupport: planLimits?.prioritySupport || false,
      teamAccess: planLimits?.teamAccess || false,
      exportFormats: planLimits?.exportFormats || ["PDF"],
    });
  } catch (error) {
    console.error("Error fetching usage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const {user} = await validateRequest();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();

    if (action !== "increment_invoice") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const users = await db.user.findUnique({
      where: { email: user.email },
      include: { subscription: true },
    });

    if (!users) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user can create more invoices
    const planLimits = await db.planLimit.findUnique({
      where: {
        plan: users.subscription?.plan || "FREE",
      },
    });

    const maxInvoices = planLimits?.maxDailyInvoices || 5;

    // If user has a paid plan, they can create unlimited invoices (maxInvoices will be null)
    if (maxInvoices && users.invoiceCount >= maxInvoices) {
      return NextResponse.json(
        { error: "Invoice limit reached. Please upgrade your plan." },
        { status: 403 }
      );
    }

    // Increment invoice count
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { invoiceCount: { increment: 1 } },
    });

    return NextResponse.json({
      invoiceCount: updatedUser.invoiceCount,
      maxInvoices,
    });
  } catch (error) {
    console.error("Error updating usage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
