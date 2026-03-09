// // app/api/pro-users/route.ts
// import { NextResponse, type NextRequest } from "next/server";
// import { validateRequest } from "@/app/auth";
// import db from "@/app/lib/db";

// // Enums based on schema
// export enum SubscriptionPlan {
//   FREE = "FREE",
//   MONTHLY = "MONTHLY",
//   YEARLY = "YEARLY",
// }

// export enum SubscriptionStatus {
//   ACTIVE = "ACTIVE",
//   INACTIVE = "INACTIVE",
//   CANCELLED = "CANCELLED",
//   PAST_DUE = "PAST_DUE",
//   TRIALING = "TRIALING",
//   INCOMPLETE = "INCOMPLETE",
//   INCOMPLETE_EXPIRED = "INCOMPLETE_EXPIRED",
//   UNPAID = "UNPAID",
// }

// export enum UserRole {
//   USER = "USER",
//   ADMIN = "ADMIN",
//   SERVICE_PROVIDER = "SERVICE_PROVIDER",
// }

// // Types
// export interface ProUser {
//   id: string;
//   email: string;
//   name: string | null;
//   firstName: string | null;
//   lastName: string | null;
//   phone: string | null;
//   jobTitle: string | null;
//   image: string | null;
//   role: UserRole;
//   isVerified: boolean;
//   status: string;
//   totalInvoices: number;
//   totalClients: number;
//   totalRevenue: number;
//   subscription: {
//     plan: SubscriptionPlan;
//     status: SubscriptionStatus;
//     currentPeriodEnd: string | null;
//     priceAmount: number | null;
//     priceCurrency: string | null;
//     interval: string | null;
//     createdAt: string;
//   } | null;
//   createdAt: string;
//   lastActive: string | null;
// }

// export interface ProUsersResponse {
//   users: ProUser[];
//   pagination: {
//     currentPage: number;
//     totalPages: number;
//     totalCount: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//     limit: number;
//   };
//   summary: {
//     totalProUsers: number;
//     totalMonthlyRevenue: number;
//     totalYearlyRevenue: number;
//     activeSubscriptions: number;
//     plansBreakdown: Record<SubscriptionPlan, number>;
//   };
// }

// export interface ProUsersParams {
//   page?: number;
//   limit?: number;
//   search?: string;
//   plan?: SubscriptionPlan;
//   status?: SubscriptionStatus;
//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
//   fromDate?: string;
//   toDate?: string;
// }

// export interface ErrorResponse {
//   error: string;
//   details?: string;
// }

// // Helper function to check if user is admin
// async function isAdmin(userId: string): Promise<boolean> {
//   const user = await db.user.findUnique({
//     where: { id: userId },
//     select: { role: true },
//   });
//   return user?.role === UserRole.ADMIN;
// }

// // GET /api/pro-users - Get pro users (MONTHLY and YEARLY plans)
// export async function GET(request: NextRequest) {
//   try {
//     // Authenticate user
//     const { user } = await validateRequest();

//     if (!user?.email) {
//       return NextResponse.json<ErrorResponse>(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Check if user is admin
//     const userIsAdmin = await isAdmin(user.id);
//     if (!userIsAdmin) {
//       return NextResponse.json<ErrorResponse>(
//         { error: "Forbidden: Admin access required" },
//         { status: 403 }
//       );
//     }

//     // Get search parameters
//     const searchParams = request.nextUrl.searchParams;
    
//     const params: ProUsersParams = {
//       page: parseInt(searchParams.get("page") ?? "1"),
//       limit: parseInt(searchParams.get("limit") ?? "10"),
//       search: searchParams.get("search") ?? "",
//       plan: searchParams.get("plan") as SubscriptionPlan | undefined,
//       status: searchParams.get("status") as SubscriptionStatus | undefined,
//       sortBy: searchParams.get("sortBy") ?? "createdAt",
//       sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
//       fromDate: searchParams.get("fromDate") ?? undefined,
//       toDate: searchParams.get("toDate") ?? undefined,
//     };

//     // Validate pagination parameters
//     if (params.page < 1 || params.limit < 1 || params.limit > 100) {
//       return NextResponse.json<ErrorResponse>(
//         { error: "Invalid pagination parameters" },
//         { status: 400 }
//       );
//     }

//     // Validate plan if provided
//     if (params.plan && !Object.values(SubscriptionPlan).includes(params.plan)) {
//       return NextResponse.json<ErrorResponse>(
//         { error: "Invalid plan parameter" },
//         { status: 400 }
//       );
//     }

//     // Validate status if provided
//     if (params.status && !Object.values(SubscriptionStatus).includes(params.status)) {
//       return NextResponse.json<ErrorResponse>(
//         { error: "Invalid status parameter" },
//         { status: 400 }
//       );
//     }

//     // Get pro users
//     const result = await getProUsers(params);

//     return NextResponse.json<ProUsersResponse>(result, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching pro users:", error);

//     if (error instanceof Error && error.message === "Unauthorized") {
//       return NextResponse.json<ErrorResponse>(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json<ErrorResponse>(
//       { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }

// // Main function to get pro users
// async function getProUsers(params: ProUsersParams): Promise<ProUsersResponse> {
//   const {
//     page = 1,
//     limit = 10,
//     search = "",
//     plan,
//     status,
//     sortBy = "createdAt",
//     sortOrder = "desc",
//     fromDate,
//     toDate,
//   } = params;

//   const skip = (page - 1) * limit;

//   // Build where clause for users with pro subscriptions
//   const where: any = {
//     subscription: {
//       plan: {
//         in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
//       },
//     },
//   };

//   // Add search filter
//   if (search) {
//     where.OR = [
//       { email: { contains: search, mode: "insensitive" } },
//       { firstName: { contains: search, mode: "insensitive" } },
//       { lastName: { contains: search, mode: "insensitive" } },
//       { name: { contains: search, mode: "insensitive" } },
//     ];
//   }

//   // Add plan filter
//   if (plan && [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY].includes(plan)) {
//     where.subscription.plan = plan;
//   }

//   // Add status filter
//   if (status) {
//     where.subscription.status = status;
//   }

//   // Add date range filter
//   if (fromDate || toDate) {
//     where.createdAt = {};
//     if (fromDate) {
//       where.createdAt.gte = new Date(fromDate);
//     }
//     if (toDate) {
//       where.createdAt.lte = new Date(toDate);
//     }
//   }

//   // Validate sort field
//   const validSortFields = ["createdAt", "email", "totalInvoices", "subscription.priceAmount"];
//   const actualSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

//   // Get users with their subscriptions
//   const [users, totalCount] = await Promise.all([
//     db.user.findMany({
//       where,
//       include: {
//         subscription: true,
//         _count: {
//           select: {
//             invoices: true,
//             clients: true,
//           },
//         },
//       },
//       orderBy: {
//         [actualSortBy]: sortOrder,
//       },
//       skip,
//       take: limit,
//     }),
//     db.user.count({ where }),
//   ]);

//   // Calculate revenue for each user
//   const usersWithStats = await Promise.all(
//     users.map(async (user) => {
//       const revenue = await db.paymentInvoice.aggregate({
//         where: {
//           userId: user.id,
//           status: "SUCCEEDED",
//         },
//         _sum: {
//           amount: true,
//         },
//       });

//       // Get last active date (last invoice or client creation)
//       const lastInvoice = await db.invoiceModel.findFirst({
//         where: { userId: user.id },
//         orderBy: { createdAt: "desc" },
//         select: { createdAt: true },
//       });

//       const lastClient = await db.client.findFirst({
//         where: { userId: user.id },
//         orderBy: { createdAt: "desc" },
//         select: { createdAt: true },
//       });

//       const lastActive = lastInvoice?.createdAt || lastClient?.createdAt || null;

//       return {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         phone: user.phone,
//         jobTitle: user.jobTitle,
//         image: user.image,
//         role: user.role as UserRole,
//         isVerified: user.isVerified || false,
//         status: user.status || "ACTIVE",
//         totalInvoices: user._count.invoices,
//         totalClients: user._count.clients,
//         totalRevenue: Number(revenue._sum.amount || 0) / 100, // Convert cents to dollars
//         subscription: user.subscription ? {
//           plan: user.subscription.plan as SubscriptionPlan,
//           status: user.subscription.status as SubscriptionStatus,
//           currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString() || null,
//           priceAmount: user.subscription.priceAmount ? user.subscription.priceAmount / 100 : null, // Convert cents to dollars
//           priceCurrency: user.subscription.priceCurrency || "usd",
//           interval: user.subscription.interval,
//           createdAt: user.subscription.createdAt.toISOString(),
//         } : null,
//         createdAt: user.createdAt.toISOString(),
//         lastActive: lastActive?.toISOString() || null,
//       };
//     })
//   );

//   // Calculate summary statistics
//   const summary = await getProUsersSummary();

//   return {
//     users: usersWithStats,
//     pagination: {
//       currentPage: page,
//       totalPages: Math.ceil(totalCount / limit),
//       totalCount,
//       hasNextPage: page < Math.ceil(totalCount / limit),
//       hasPrevPage: page > 1,
//       limit,
//     },
//     summary,
//   };
// }

// // Helper function to get pro users summary statistics
// async function getProUsersSummary() {
//   const [totalProUsers, monthlyRevenue, yearlyRevenue, activeSubscriptions, plansBreakdown] =
//     await Promise.all([
//       // Total pro users
//       db.user.count({
//         where: {
//           subscription: {
//             plan: {
//               in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
//             },
//           },
//         },
//       }),

//       // Monthly revenue
//       db.paymentInvoice.aggregate({
//         where: {
//           plan: SubscriptionPlan.MONTHLY,
//           status: "SUCCEEDED",
//         },
//         _sum: {
//           amount: true,
//         },
//       }),

//       // Yearly revenue
//       db.paymentInvoice.aggregate({
//         where: {
//           plan: SubscriptionPlan.YEARLY,
//           status: "SUCCEEDED",
//         },
//         _sum: {
//           amount: true,
//         },
//       }),

//       // Active subscriptions
//       db.subscriptionInvoice.count({
//         where: {
//           plan: {
//             in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
//           },
//           status: SubscriptionStatus.ACTIVE,
//         },
//       }),

//       // Plans breakdown
//       db.subscriptionInvoice.groupBy({
//         by: ["plan"],
//         where: {
//           plan: {
//             in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
//           },
//         },
//         _count: {
//           plan: true,
//         },
//       }),
//     ]);

//   const breakdown: Record<SubscriptionPlan, number> = {
//     [SubscriptionPlan.FREE]: 0,
//     [SubscriptionPlan.MONTHLY]: 0,
//     [SubscriptionPlan.YEARLY]: 0,
//   };

//   plansBreakdown.forEach((item) => {
//     breakdown[item.plan as SubscriptionPlan] = item._count.plan;
//   });

//   return {
//     totalProUsers,
//     totalMonthlyRevenue: Number(monthlyRevenue._sum.amount || 0) / 100, // Convert cents to dollars
//     totalYearlyRevenue: Number(yearlyRevenue._sum.amount || 0) / 100, // Convert cents to dollars
//     activeSubscriptions,
//     plansBreakdown: breakdown,
//   };
// }

// // GET /api/pro-users/stats - Get pro users statistics (admin only)
// export async function getProUsersStats() {
//   try {
//     const { user } = await validateRequest();

//     if (!user?.email) {
//       return NextResponse.json<ErrorResponse>(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const userIsAdmin = await isAdmin(user.id);
//     if (!userIsAdmin) {
//       return NextResponse.json<ErrorResponse>(
//         { error: "Forbidden: Admin access required" },
//         { status: 403 }
//       );
//     }

//     const [monthlyGrowth, yearlyGrowth, churnRate, averageRevenue] = await Promise.all([
//       // Monthly growth (new pro users this month)
//       db.user.count({
//         where: {
//           subscription: {
//             plan: {
//               in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
//             },
//           },
//           createdAt: {
//             gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
//           },
//         },
//       }),

//       // Yearly growth
//       db.user.count({
//         where: {
//           subscription: {
//             plan: {
//               in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
//             },
//           },
//           createdAt: {
//             gte: new Date(new Date().getFullYear(), 0, 1),
//           },
//         },
//       }),

//       // Churn rate (cancelled this month)
//       db.subscriptionInvoice.count({
//         where: {
//           plan: {
//             in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
//           },
//           status: SubscriptionStatus.CANCELLED,
//           canceledAt: {
//             gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
//           },
//         },
//       }),

//       // Average revenue per user
//       db.paymentInvoice.aggregate({
//         where: {
//           status: "SUCCEEDED",
//         },
//         _avg: {
//           amount: true,
//         },
//       }),
//     ]);

//     return NextResponse.json({
//       monthlyGrowth,
//       yearlyGrowth,
//       churnRate,
//       averageRevenue: Number(averageRevenue._avg.amount || 0) / 100,
//     });
//   } catch (error) {
//     console.error("Error fetching pro users stats:", error);
//     return NextResponse.json<ErrorResponse>(
//       { error: "Failed to fetch pro users statistics" },
//       { status: 500 }
//     );
//   }
// }

// // Export pro users data as CSV
// export async function exportProUsersCSV() {
//   try {
//     const { user } = await validateRequest();

//     if (!user?.email) {
//       return NextResponse.json<ErrorResponse>(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const userIsAdmin = await isAdmin(user.id);
//     if (!userIsAdmin) {
//       return NextResponse.json<ErrorResponse>(
//         { error: "Forbidden: Admin access required" },
//         { status: 403 }
//       );
//     }

//     const users = await db.user.findMany({
//       where: {
//         subscription: {
//           plan: {
//             in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
//           },
//         },
//       },
//       include: {
//         subscription: true,
//         _count: {
//           select: {
//             invoices: true,
//             clients: true,
//           },
//         },
//       },
//     });

//     // Create CSV header
//     const csvHeader = [
//       "Email",
//       "Name",
//       "Plan",
//       "Status",
//       "Joined Date",
//       "Total Invoices",
//       "Total Clients",
//       "Subscription Amount",
//       "Subscription Interval",
//     ].join(",");

//     // Create CSV rows
//     const csvRows = users.map((user) =>
//       [
//         user.email,
//         user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A",
//         user.subscription?.plan || "FREE",
//         user.subscription?.status || "INACTIVE",
//         user.createdAt.toISOString().split("T")[0],
//         user._count.invoices,
//         user._count.clients,
//         user.subscription?.priceAmount ? user.subscription.priceAmount / 100 : 0,
//         user.subscription?.interval || "N/A",
//       ].join(",")
//     );

//     const csv = [csvHeader, ...csvRows].join("\n");

//     return new NextResponse(csv, {
//       status: 200,
//       headers: {
//         "Content-Type": "text/csv",
//         "Content-Disposition": `attachment; filename=pro-users-${new Date().toISOString().split("T")[0]}.csv`,
//       },
//     });
//   } catch (error) {
//     console.error("Error exporting pro users:", error);
//     return NextResponse.json<ErrorResponse>(
//       { error: "Failed to export pro users" },
//       { status: 500 }
//     );
//   }
// }















// app/api/pro-users/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { validateRequest } from "@/app/auth";
import db from "@/app/lib/db";

// Enums based on schema
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

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SERVICE_PROVIDER = "SERVICE_PROVIDER",
}

// Types
export interface ProUser {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  jobTitle: string | null;
  image: string | null;
  role: UserRole;
  isVerified: boolean;
  status: string;
  totalInvoices: number;
  totalClients: number;
  totalRevenue: number;
  subscription: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    currentPeriodEnd: string | null;
    priceAmount: number | null;
    priceCurrency: string | null;
    interval: string | null;
    createdAt: string;
  } | null;
  createdAt: string;
  lastActive: string | null;
}

export interface ProUsersResponse {
  users: ProUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  summary: {
    totalProUsers: number;
    totalMonthlyRevenue: number;
    totalYearlyRevenue: number;
    activeSubscriptions: number;
    plansBreakdown: Record<SubscriptionPlan, number>;
  };
}

export interface ProUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  fromDate?: string;
  toDate?: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// Helper function to check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === UserRole.ADMIN;
}

// GET /api/pro-users - Get pro users (MONTHLY and YEARLY plans)
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json<ErrorResponse>(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Get search parameters
    const searchParams = request.nextUrl.searchParams;
    
    const params: ProUsersParams = {
      page: parseInt(searchParams.get("page") ?? "1"),
      limit: parseInt(searchParams.get("limit") ?? "10"),
      search: searchParams.get("search") ?? "",
      plan: searchParams.get("plan") as SubscriptionPlan | undefined,
      status: searchParams.get("status") as SubscriptionStatus | undefined,
      sortBy: searchParams.get("sortBy") ?? "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") ?? "desc",
      fromDate: searchParams.get("fromDate") ?? undefined,
      toDate: searchParams.get("toDate") ?? undefined,
    };

    // Validate pagination parameters
    if (params.page < 1 || params.limit < 1 || params.limit > 100) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Validate plan if provided
    if (params.plan && !Object.values(SubscriptionPlan).includes(params.plan)) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid plan parameter" },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (params.status && !Object.values(SubscriptionStatus).includes(params.status)) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid status parameter" },
        { status: 400 }
      );
    }

    // Get pro users
    const result = await getProUsers(params);

    return NextResponse.json<ProUsersResponse>(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching pro users:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json<ErrorResponse>(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Main function to get pro users
async function getProUsers(params: ProUsersParams): Promise<ProUsersResponse> {
  const {
    page = 1,
    limit = 10,
    search = "",
    plan,
    status,
    sortBy = "createdAt",
    sortOrder = "desc",
    fromDate,
    toDate,
  } = params;

  const skip = (page - 1) * limit;

  // Build where clause for users with pro subscriptions
  const where: any = {
    subscription: {
      plan: {
        in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
      },
    },
  };

  // Add search filter
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
    ];
  }

  // Add plan filter
  if (plan && [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY].includes(plan)) {
    where.subscription.plan = plan;
  }

  // Add status filter
  if (status) {
    where.subscription.status = status;
  }

  // Add date range filter
  if (fromDate || toDate) {
    where.createdAt = {};
    if (fromDate) {
      where.createdAt.gte = new Date(fromDate);
    }
    if (toDate) {
      where.createdAt.lte = new Date(toDate);
    }
  }

  // Validate sort field
  const validSortFields = ["createdAt", "email", "totalInvoices", "subscription.priceAmount"];
  const actualSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";

  // Get users with their subscriptions
  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      where,
      include: {
        subscription: true,
        _count: {
          select: {
            invoices: true,
            clients: true,
          },
        },
      },
      orderBy: {
        [actualSortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),
    db.user.count({ where }),
  ]);

  // Calculate revenue for each user
  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      // Güvenli revenue hesaplama
      let totalRevenue = 0;
      try {
        const revenue = await db.paymentInvoice.aggregate({
          where: {
            userId: user.id,
            status: "SUCCEEDED",
          },
          _sum: {
            amount: true,
          },
        });
        totalRevenue = revenue._sum.amount ? Number(revenue._sum.amount) / 100 : 0;
      } catch (error) {
        console.error(`Error calculating revenue for user ${user.id}:`, error);
        totalRevenue = 0;
      }

      // Get last active date (last invoice or client creation)
      let lastActive = null;
      try {
        const [lastInvoice, lastClient] = await Promise.all([
          db.invoiceModel.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
          db.client.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);

        const lastInvoiceDate = lastInvoice?.createdAt;
        const lastClientDate = lastClient?.createdAt;
        
        if (lastInvoiceDate && lastClientDate) {
          lastActive = lastInvoiceDate > lastClientDate ? lastInvoiceDate : lastClientDate;
        } else if (lastInvoiceDate) {
          lastActive = lastInvoiceDate;
        } else if (lastClientDate) {
          lastActive = lastClientDate;
        }
      } catch (error) {
        console.error(`Error getting last active for user ${user.id}:`, error);
      }

      // Güvenli subscription verisi oluşturma
      let subscriptionData = null;
      if (user.subscription) {
        subscriptionData = {
          plan: user.subscription.plan as SubscriptionPlan,
          status: user.subscription.status as SubscriptionStatus,
          currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString() || null,
          priceAmount: user.subscription.priceAmount ? user.subscription.priceAmount / 100 : null,
          priceCurrency: user.subscription.priceCurrency || "usd",
          interval: user.subscription.interval || null,
          createdAt: user.subscription.createdAt?.toISOString() || new Date().toISOString(),
        };
      }

      return {
        id: user.id,
        email: user.email || "",
        name: user.name || null,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        phone: user.phone || null,
        jobTitle: user.jobTitle || null,
        image: user.image || null,
        role: (user.role as UserRole) || UserRole.USER,
        isVerified: user.isVerified || false,
        status: user.status || "ACTIVE",
        totalInvoices: user._count?.invoices || 0,
        totalClients: user._count?.clients || 0,
        totalRevenue: isNaN(totalRevenue) ? 0 : totalRevenue, // NaN kontrolü
        subscription: subscriptionData,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        lastActive: lastActive?.toISOString() || null,
      };
    })
  );

  // Calculate summary statistics
  const summary = await getProUsersSummary();

  return {
    users: usersWithStats,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1,
      limit,
    },
    summary,
  };
}

// Helper function to get pro users summary statistics
async function getProUsersSummary() {
  try {
    const [totalProUsers, monthlyRevenue, yearlyRevenue, activeSubscriptions, plansBreakdown] =
      await Promise.all([
        // Total pro users
        db.user.count({
          where: {
            subscription: {
              plan: {
                in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
              },
            },
          },
        }),

        // Monthly revenue
        db.paymentInvoice.aggregate({
          where: {
            plan: SubscriptionPlan.MONTHLY,
            status: "SUCCEEDED",
          },
          _sum: {
            amount: true,
          },
        }),

        // Yearly revenue
        db.paymentInvoice.aggregate({
          where: {
            plan: SubscriptionPlan.YEARLY,
            status: "SUCCEEDED",
          },
          _sum: {
            amount: true,
          },
        }),

        // Active subscriptions
        db.subscriptionInvoice.count({
          where: {
            plan: {
              in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
            },
            status: SubscriptionStatus.ACTIVE,
          },
        }),

        // Plans breakdown
        db.subscriptionInvoice.groupBy({
          by: ["plan"],
          where: {
            plan: {
              in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
            },
          },
          _count: {
            plan: true,
          },
        }),
      ]);

    const breakdown: Record<SubscriptionPlan, number> = {
      [SubscriptionPlan.FREE]: 0,
      [SubscriptionPlan.MONTHLY]: 0,
      [SubscriptionPlan.YEARLY]: 0,
    };

    if (plansBreakdown && Array.isArray(plansBreakdown)) {
      plansBreakdown.forEach((item) => {
        if (item && item.plan) {
          breakdown[item.plan as SubscriptionPlan] = item._count?.plan || 0;
        }
      });
    }

    // NaN kontrolü ve güvenli dönüşüm
    const monthlyRev = monthlyRevenue?._sum?.amount ? Number(monthlyRevenue._sum.amount) / 100 : 0;
    const yearlyRev = yearlyRevenue?._sum?.amount ? Number(yearlyRevenue._sum.amount) / 100 : 0;

    return {
      totalProUsers: totalProUsers || 0,
      totalMonthlyRevenue: isNaN(monthlyRev) ? 0 : monthlyRev,
      totalYearlyRevenue: isNaN(yearlyRev) ? 0 : yearlyRev,
      activeSubscriptions: activeSubscriptions || 0,
      plansBreakdown: breakdown,
    };
  } catch (error) {
    console.error("Error calculating summary:", error);
    return {
      totalProUsers: 0,
      totalMonthlyRevenue: 0,
      totalYearlyRevenue: 0,
      activeSubscriptions: 0,
      plansBreakdown: {
        [SubscriptionPlan.FREE]: 0,
        [SubscriptionPlan.MONTHLY]: 0,
        [SubscriptionPlan.YEARLY]: 0,
      },
    };
  }
}

// GET /api/pro-users/stats - Get pro users statistics (admin only)
export async function getProUsersStats() {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json<ErrorResponse>(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

    const [monthlyGrowth, yearlyGrowth, churnRate, averageRevenue] = await Promise.all([
      // Monthly growth (new pro users this month)
      db.user.count({
        where: {
          subscription: {
            plan: {
              in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
            },
          },
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      }),

      // Yearly growth
      db.user.count({
        where: {
          subscription: {
            plan: {
              in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
            },
          },
          createdAt: {
            gte: firstDayOfYear,
          },
        },
      }),

      // Churn rate (cancelled this month)
      db.subscriptionInvoice.count({
        where: {
          plan: {
            in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
          },
          status: SubscriptionStatus.CANCELLED,
          canceledAt: {
            gte: firstDayOfMonth,
          },
        },
      }),

      // Average revenue per user
      db.paymentInvoice.aggregate({
        where: {
          status: "SUCCEEDED",
        },
        _avg: {
          amount: true,
        },
      }),
    ]);

    const avgRevenue = averageRevenue?._avg?.amount ? Number(averageRevenue._avg.amount) / 100 : 0;

    return NextResponse.json({
      monthlyGrowth: monthlyGrowth || 0,
      yearlyGrowth: yearlyGrowth || 0,
      churnRate: churnRate || 0,
      averageRevenue: isNaN(avgRevenue) ? 0 : avgRevenue,
    });
  } catch (error) {
    console.error("Error fetching pro users stats:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to fetch pro users statistics" },
      { status: 500 }
    );
  }
}

// Export pro users data as CSV
export async function exportProUsersCSV() {
  try {
    const { user } = await validateRequest();

    if (!user?.email) {
      return NextResponse.json<ErrorResponse>(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json<ErrorResponse>(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const users = await db.user.findMany({
      where: {
        subscription: {
          plan: {
            in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY],
          },
        },
      },
      include: {
        subscription: true,
        _count: {
          select: {
            invoices: true,
            clients: true,
          },
        },
      },
    });

    // Create CSV header
    const csvHeader = [
      "Email",
      "Name",
      "Plan",
      "Status",
      "Joined Date",
      "Total Invoices",
      "Total Clients",
      "Subscription Amount ($)",
      "Subscription Interval",
    ].join(",");

    // Create CSV rows
    const csvRows = users.map((user) => {
      const name = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A";
      const plan = user.subscription?.plan || "FREE";
      const subStatus = user.subscription?.status || "INACTIVE";
      const joinedDate = user.createdAt ? user.createdAt.toISOString().split("T")[0] : "N/A";
      const totalInvoices = user._count?.invoices || 0;
      const totalClients = user._count?.clients || 0;
      const amount = user.subscription?.priceAmount ? (user.subscription.priceAmount / 100).toFixed(2) : "0.00";
      const interval = user.subscription?.interval || "N/A";

      return [
        user.email || "",
        name,
        plan,
        subStatus,
        joinedDate,
        totalInvoices,
        totalClients,
        amount,
        interval,
      ].join(",");
    });

    const csv = [csvHeader, ...csvRows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=pro-users-${new Date().toISOString().split("T")[0]}.csv`,
      },
    });
  } catch (error) {
    console.error("Error exporting pro users:", error);
    return NextResponse.json<ErrorResponse>(
      { error: "Failed to export pro users" },
      { status: 500 }
    );
  }
}