// app/api/billing/payments/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";

// Enums based on schema
export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum SubscriptionPlan {
  FREE = "FREE",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  VIEWED = "VIEWED",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

// Response types
interface PaymentResponse {
  id: string;
  stripePaymentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string | null;
  plan: SubscriptionPlan;
  interval: string | null;
  paidAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
  receiptUrl: string | null;
  invoiceUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaymentsListResponse {
  payments: PaymentResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  summary: {
    totalPaid: number;
    totalPayments: number;
    statusBreakdown: Record<string, number>;
    monthlyTotal?: number;
    yearlyTotal?: number;
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// GET /api/billing/payments - List payments with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await db.user.findUnique({
      where: { email: user.email },
      include: {
        subscription: true,
      },
    });

    if (!userData) {
      return NextResponse.json<ErrorResponse>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get URL search params for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status") as PaymentStatus | null;
    const planType = searchParams.get("plan") as SubscriptionPlan | null;
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Validate page and limit
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {
      userId: userData.id,
    };

    // Status filter
    if (status && Object.values(PaymentStatus).includes(status)) {
      whereClause.status = status;
    }

    // Plan filter
    if (planType && Object.values(SubscriptionPlan).includes(planType)) {
      whereClause.plan = planType;
    }

    // Date range filter
    if (fromDate || toDate) {
      whereClause.createdAt = {};
      if (fromDate) {
        whereClause.createdAt.gte = new Date(fromDate);
      }
      if (toDate) {
        whereClause.createdAt.lte = new Date(toDate);
      }
    }

    // Validate sort field
    const validSortFields = ["createdAt", "amount", "paidAt", "status"];
    const actualSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const actualSortOrder = sortOrder === "asc" ? "asc" : "desc";

    // Get payments with pagination
    const [payments, totalCount] = await Promise.all([
      db.paymentInvoice.findMany({
        where: whereClause,
        orderBy: {
          [actualSortBy]: actualSortOrder,
        },
        skip: offset,
        take: limit,
        select: {
          id: true,
          stripePaymentId: true,
          amount: true,
          currency: true,
          status: true,
          description: true,
          plan: true,
          interval: true,
          paidAt: true,
          failedAt: true,
          refundedAt: true,
          receiptUrl: true,
          invoiceUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.paymentInvoice.count({
        where: whereClause,
      }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Calculate totals for summary
    const [paymentSummary, statusCounts, monthlySummary, yearlySummary] = await Promise.all([
      // Total paid amount
      db.paymentInvoice.aggregate({
        where: {
          userId: userData.id,
          status: PaymentStatus.SUCCEEDED,
        },
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      }),

      // Status breakdown
      db.paymentInvoice.groupBy({
        by: ["status"],
        where: {
          userId: userData.id,
        },
        _count: {
          id: true,
        },
      }),

      // Monthly total (current month)
      db.paymentInvoice.aggregate({
        where: {
          userId: userData.id,
          status: PaymentStatus.SUCCEEDED,
          paidAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Yearly total (current year)
      db.paymentInvoice.aggregate({
        where: {
          userId: userData.id,
          status: PaymentStatus.SUCCEEDED,
          paidAt: {
            gte: new Date(new Date().getFullYear(), 0, 1),
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Format payments for response
    const formattedPayments: PaymentResponse[] = payments.map((payment) => ({
      ...payment,
      amount: Number(payment.amount),
      paidAt: payment.paidAt?.toISOString() || null,
      failedAt: payment.failedAt?.toISOString() || null,
      refundedAt: payment.refundedAt?.toISOString() || null,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      status: payment.status as PaymentStatus,
      plan: payment.plan as SubscriptionPlan,
    }));

    // Build status breakdown object
    const statusBreakdown = statusCounts.reduce(
      (acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      },
      {} as Record<string, number>
    );

    const response: PaymentsListResponse = {
      payments: formattedPayments,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
      summary: {
        totalPaid: Number(paymentSummary._sum.amount || 0),
        totalPayments: paymentSummary._count.id || 0,
        statusBreakdown,
        monthlyTotal: Number(monthlySummary._sum.amount || 0),
        yearlyTotal: Number(yearlySummary._sum.amount || 0),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST /api/billing/payments - Get specific payment details or perform actions
export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await db.user.findUnique({
      where: { email: user.email },
    });

    if (!userData) {
      return NextResponse.json<ErrorResponse>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { action, paymentId, ...params } = body;

    // Handle different actions
    switch (action) {
      case "get_payment_details":
        return await handleGetPaymentDetails(userData.id, paymentId);
      
      case "get_payment_by_stripe_id":
        return await handleGetPaymentByStripeId(userData.id, params.stripePaymentId);
      
      case "get_payment_stats":
        return await handleGetPaymentStats(userData.id, params);
      
      case "download_receipt":
        return await handleDownloadReceipt(userData.id, paymentId);
      
      case "request_refund":
        return await handleRequestRefund(userData.id, paymentId, params.reason);
      
      default:
        return NextResponse.json<ErrorResponse>(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing payment request:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to get payment details by ID
async function handleGetPaymentDetails(userId: string, paymentId: string) {
  if (!paymentId) {
    return NextResponse.json<ErrorResponse>(
      { error: "Payment ID is required" },
      { status: 400 }
    );
  }

  const payment = await db.paymentInvoice.findFirst({
    where: {
      id: paymentId,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!payment) {
    return NextResponse.json<ErrorResponse>(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  // Format dates
  const formattedPayment = {
    ...payment,
    amount: Number(payment.amount),
    paidAt: payment.paidAt?.toISOString() || null,
    failedAt: payment.failedAt?.toISOString() || null,
    refundedAt: payment.refundedAt?.toISOString() || null,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
    status: payment.status as PaymentStatus,
    plan: payment.plan as SubscriptionPlan,
  };

  return NextResponse.json({ payment: formattedPayment });
}

// Helper function to get payment by Stripe payment ID
async function handleGetPaymentByStripeId(userId: string, stripePaymentId: string) {
  if (!stripePaymentId) {
    return NextResponse.json<ErrorResponse>(
      { error: "Stripe payment ID is required" },
      { status: 400 }
    );
  }

  const payment = await db.paymentInvoice.findFirst({
    where: {
      stripePaymentId,
      userId,
    },
  });

  if (!payment) {
    return NextResponse.json<ErrorResponse>(
      { error: "Payment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ payment });
}

// Helper function to get payment statistics
async function handleGetPaymentStats(userId: string, params: any) {
  const { period = "all", year, month } = params;

  let dateFilter = {};
  const now = new Date();

  if (period === "month" && month !== undefined) {
    // Specific month
    dateFilter = {
      paidAt: {
        gte: new Date(year || now.getFullYear(), month, 1),
        lt: new Date(year || now.getFullYear(), month + 1, 1),
      },
    };
  } else if (period === "year" && year) {
    // Specific year
    dateFilter = {
      paidAt: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      },
    };
  }

  const stats = await db.paymentInvoice.aggregate({
    where: {
      userId,
      status: PaymentStatus.SUCCEEDED,
      ...dateFilter,
    },
    _sum: {
      amount: true,
    },
    _count: {
      id: true,
    },
    _avg: {
      amount: true,
    },
  });

  // Get monthly breakdown
  const monthlyBreakdown = await db.paymentInvoice.groupBy({
    by: ["paidAt"],
    where: {
      userId,
      status: PaymentStatus.SUCCEEDED,
      paidAt: {
        gte: new Date(now.getFullYear(), 0, 1),
      },
    },
    _sum: {
      amount: true,
    },
    _count: {
      id: true,
    },
  });

  return NextResponse.json({
    total: Number(stats._sum.amount || 0),
    count: stats._count.id || 0,
    average: Number(stats._avg.amount || 0),
    monthlyBreakdown: monthlyBreakdown.map(item => ({
      month: item.paidAt?.getMonth(),
      amount: Number(item._sum.amount || 0),
      count: item._count.id,
    })),
  });
}

// Helper function to handle receipt download
async function handleDownloadReceipt(userId: string, paymentId: string) {
  if (!paymentId) {
    return NextResponse.json<ErrorResponse>(
      { error: "Payment ID is required" },
      { status: 400 }
    );
  }

  const payment = await db.paymentInvoice.findFirst({
    where: {
      id: paymentId,
      userId,
      status: PaymentStatus.SUCCEEDED,
    },
    select: {
      receiptUrl: true,
      invoiceUrl: true,
      stripePaymentId: true,
    },
  });

  if (!payment) {
    return NextResponse.json<ErrorResponse>(
      { error: "Payment not found or not succeeded" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    receiptUrl: payment.receiptUrl,
    invoiceUrl: payment.invoiceUrl,
    stripePaymentId: payment.stripePaymentId,
  });
}

// Helper function to handle refund requests
async function handleRequestRefund(userId: string, paymentId: string, reason?: string) {
  if (!paymentId) {
    return NextResponse.json<ErrorResponse>(
      { error: "Payment ID is required" },
      { status: 400 }
    );
  }

  const payment = await db.paymentInvoice.findFirst({
    where: {
      id: paymentId,
      userId,
      status: PaymentStatus.SUCCEEDED,
    },
  });

  if (!payment) {
    return NextResponse.json<ErrorResponse>(
      { error: "Payment not found or not eligible for refund" },
      { status: 404 }
    );
  }

  // Here you would integrate with Stripe to process the refund
  // This is a placeholder for the actual refund logic
  // await stripe.refunds.create({ payment_intent: payment.stripePaymentId });

  return NextResponse.json({
    message: "Refund request received and is being processed",
    paymentId,
    reason: reason || "No reason provided",
  });
}

// DELETE /api/billing/payments - Admin only: Delete a payment record
export async function DELETE(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userData = await db.user.findUnique({
      where: { email: user.email },
      select: { role: true },
    });

    if (userData?.role !== "ADMIN") {
      return NextResponse.json<ErrorResponse>(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json<ErrorResponse>(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Delete payment record
    await db.paymentInvoice.delete({
      where: { id: paymentId },
    });

    return NextResponse.json({
      message: "Payment record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}