// lib/actions/user-actions.ts
"use server";

import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import { revalidatePath } from "next/cache";
import { InvoiceStatus, InvoiceTemplate, SubscriptionPlan, SubscriptionStatus, UserDetailsResponse, UserMetrics, UserProfileUpdateData, UserRole } from "../types/user-details";



// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const { user } = await validateRequest();

  if (!user?.email) {
    throw new Error("Unauthorized");
  }

  const userData = await db.user.findUnique({
    where: { email: user.email },
    include: {
      subscription: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  return userData;
}

// Check if user is admin
async function isAdmin(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === UserRole.ADMIN;
}

// Get current user details
export async function getCurrentUserDetails(
  invoicePage: number = 1,
  clientPage: number = 1,
  invoiceLimit: number = 10,
  clientLimit: number = 10
): Promise<UserDetailsResponse | null> {
  try {
    const currentUser = await getAuthenticatedUser();
    return getUserDetails(
      currentUser.id,
      invoicePage,
      clientPage,
      invoiceLimit,
      clientLimit
    );
  } catch (error) {
    console.error("Error fetching current user details:", error);
    return null;
  }
}

// Get user details by ID (admin only or own user)
export async function getUserDetails(
  userId: string,
  invoicePage: number = 1,
  clientPage: number = 1,
  invoiceLimit: number = 10,
  clientLimit: number = 10
): Promise<UserDetailsResponse | null> {
  try {
    const currentUser = await getAuthenticatedUser();
    
    // Check if user has permission (admin or viewing themselves)
    const hasPermission = currentUser.id === userId || await isAdmin(currentUser.id);
    
    if (!hasPermission) {
      throw new Error("Unauthorized to view this user's details");
    }

    // Fetch user with subscription
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          select: {
            plan: true,
            status: true,
            currentPeriodEnd: true,
            stripeCustomerId: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // Fetch brand details
    const brand = await db.brand.findUnique({
      where: { userId },
    });

    // Get plan limits
    const planLimits = await db.planLimit.findUnique({
      where: { plan: user.subscription?.plan || SubscriptionPlan.FREE },
    });

    const dailyLimit = planLimits?.maxDailyInvoices || 2;

    // Calculate metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalInvoices,
      totalRevenue,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalClients,
      dailyInvoices,
    ] = await Promise.all([
      // Total invoices count
      db.invoiceModel.count({
        where: { userId },
      }),

      // Total revenue (sum of paid invoices)
      db.invoiceModel.aggregate({
        where: {
          userId,
          status: InvoiceStatus.PAID,
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Paid invoices count
      db.invoiceModel.count({
        where: {
          userId,
          status: InvoiceStatus.PAID,
        },
      }),

      // Pending invoices count (SENT, VIEWED, DRAFT)
      db.invoiceModel.count({
        where: {
          userId,
          status: {
            in: [InvoiceStatus.SENT, InvoiceStatus.VIEWED, InvoiceStatus.DRAFT],
          },
        },
      }),

      // Overdue invoices count
      db.invoiceModel.count({
        where: {
          userId,
          status: InvoiceStatus.OVERDUE,
        },
      }),

      // Total clients count
      db.client.count({
        where: { userId },
      }),

      // Daily invoices created
      db.invoiceModel.count({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
    ]);

    // Fetch invoices with pagination
    const [invoices, invoiceTotal] = await Promise.all([
      db.invoiceModel.findMany({
        where: { userId },
        include: {
          client: {
            select: {
              contactPerson: true,
              companyName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (invoicePage - 1) * invoiceLimit,
        take: invoiceLimit,
      }),
      db.invoiceModel.count({ where: { userId } }),
    ]);

    // Fetch clients with pagination
    const [clients, clientTotal] = await Promise.all([
      db.client.findMany({
        where: { userId },
        include: {
          _count: {
            select: { invoices: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (clientPage - 1) * clientLimit,
        take: clientLimit,
      }),
      db.client.count({ where: { userId } }),
    ]);

    const metrics: UserMetrics = {
      totalInvoices,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalClients,
      dailyInvoicesUsed: dailyInvoices,
      dailyInvoicesLimit: dailyLimit,
      remainingDailyInvoices: Math.max(0, dailyLimit - dailyInvoices),
    };

    // Format dates for serialization
    const formattedUser = {
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      jobTitle: user.jobTitle,
      role: user.role as UserRole,
      status: user.status || "ACTIVE",
      isVerified: user.isVerified || false,
      createdAt: user.createdAt.toISOString(),
      totalInvoicesCreated: user.totalInvoicesCreated || 0,
      dailyInvoicesCreated: user.dailyInvoicesCreated || 0,
      lastInvoiceDate: user.lastInvoiceDate?.toISOString() || null,
      subscription: user.subscription ? {
        plan: user.subscription.plan as SubscriptionPlan,
        status: user.subscription.status as SubscriptionStatus,
        currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString() || null,
        stripeCustomerId: user.subscription.stripeCustomerId,
      } : null,
    };

    const formattedBrand = brand ? {
      id: brand.id,
      name: brand.name,
      logo: brand.logo,
      currency: brand.currency,
      slogan: brand.slogan,
      phone: brand.phone,
      address: brand.address,
      email: brand.email,
      brandColor: brand.brandColor,
      template: brand.template as InvoiceTemplate,
      paymentInfo: brand.paymentInfo,
      thankYouMsg: brand.thankYouMsg,
      contactInfo: brand.contactInfo,
      taxRate: brand.taxRate,
      salesTax: brand.salesTax,
      otherCharges: brand.otherCharges,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString(),
    } : null;

    const formattedInvoices = {
      data: invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        status: invoice.status as InvoiceStatus,
        subtotal: Number(invoice.subtotal),
        taxAmount: Number(invoice.taxAmount),
        totalAmount: Number(invoice.totalAmount),
        client: {
          contactPerson: invoice.client.contactPerson,
          companyName: invoice.client.companyName,
        },
        createdAt: invoice.createdAt.toISOString(),
      })),
      total: invoiceTotal,
      page: invoicePage,
      limit: invoiceLimit,
      totalPages: Math.ceil(invoiceTotal / invoiceLimit),
    };

    const formattedClients = {
      data: clients.map(client => ({
        id: client.id,
        contactPerson: client.contactPerson,
        companyName: client.companyName,
        location: client.location,
        phone: client.phone,
        email: client.email,
        isActive: client.isActive,
        invoiceCount: client._count.invoices,
        createdAt: client.createdAt.toISOString(),
      })),
      total: clientTotal,
      page: clientPage,
      limit: clientLimit,
      totalPages: Math.ceil(clientTotal / clientLimit),
    };

    return {
      user: formattedUser,
      brand: formattedBrand,
      metrics,
      invoices: formattedInvoices,
      clients: formattedClients,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      throw new Error("Unauthorized");
    }
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  data: UserProfileUpdateData
): Promise<{
  success: boolean;
  error?: string;
  user?: any;
}> {
  try {
    const user = await getAuthenticatedUser();

    // Validate data
    if (data.name !== undefined && data.name.trim().length < 2) {
      return {
        success: false,
        error: "Name must be at least 2 characters",
      };
    }

    // Clean up data
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }
      if (value === "") {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: cleanedData,
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        jobTitle: true,
        updatedAt: true,
      },
    });

    revalidatePath("/dashboard/settings/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      user: {
        ...updatedUser,
        updatedAt: updatedUser.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

// Get user statistics for admin dashboard
export async function getUserStatistics(): Promise<{
  totalUsers: number;
  activeSubscriptions: number;
  totalInvoices: number;
  totalRevenue: number;
  usersByPlan: Record<SubscriptionPlan, number>;
  recentUsers: Array<{
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    plan: SubscriptionPlan;
  }>;
} | null> {
  try {
    const currentUser = await getAuthenticatedUser();
    
    // Check if user is admin
    const userIsAdmin = await isAdmin(currentUser.id);
    if (!userIsAdmin) {
      throw new Error("Unauthorized: Admin access required");
    }

    const [
      totalUsers,
      activeSubscriptions,
      totalInvoices,
      totalRevenue,
      usersByPlan,
      recentUsers,
    ] = await Promise.all([
      // Total users
      db.user.count(),

      // Active subscriptions
      db.subscriptionInvoice.count({
        where: {
          status: SubscriptionStatus.ACTIVE,
        },
      }),

      // Total invoices
      db.invoiceModel.count(),

      // Total revenue
      db.invoiceModel.aggregate({
        where: {
          status: InvoiceStatus.PAID,
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Users by plan
      db.subscriptionInvoice.groupBy({
        by: ["plan"],
        _count: {
          plan: true,
        },
      }),

      // Recent users
      db.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          subscription: {
            select: {
              plan: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
    ]);

    const planCounts: Record<SubscriptionPlan, number> = {
      [SubscriptionPlan.FREE]: 0,
      [SubscriptionPlan.MONTHLY]: 0,
      [SubscriptionPlan.YEARLY]: 0,
    };

    usersByPlan.forEach((item) => {
      planCounts[item.plan as SubscriptionPlan] = item._count.plan;
    });

    return {
      totalUsers,
      activeSubscriptions,
      totalInvoices,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      usersByPlan: planCounts,
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
        plan: user.subscription?.plan as SubscriptionPlan || SubscriptionPlan.FREE,
      })),
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return null;
  }
}

// Delete user account
export async function deleteUserAccount(userId?: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const currentUser = await getAuthenticatedUser();
    
    // If userId is provided, check if admin, otherwise delete own account
    const targetUserId = userId || currentUser.id;
    
    const hasPermission = targetUserId === currentUser.id || await isAdmin(currentUser.id);
    
    if (!hasPermission) {
      return {
        success: false,
        error: "Unauthorized to delete this user",
      };
    }

    // Start transaction to delete all user data
    await db.$transaction(async (tx) => {
      // Delete invoice items first (cascade should handle this, but being explicit)
      const invoices = await tx.invoiceModel.findMany({
        where: { userId: targetUserId },
        select: { id: true },
      });

      for (const invoice of invoices) {
        await tx.invoiceItem.deleteMany({
          where: { invoiceId: invoice.id },
        });
      }

      // Delete invoices
      await tx.invoiceModel.deleteMany({
        where: { userId: targetUserId },
      });

      // Delete clients
      await tx.client.deleteMany({
        where: { userId: targetUserId },
      });

      // Delete brand
      await tx.brand.deleteMany({
        where: { userId: targetUserId },
      });

      // Delete subscription
      await tx.subscriptionInvoice.deleteMany({
        where: { userId: targetUserId },
      });

      // Delete account records
      await tx.accountInvoice.deleteMany({
        where: { userId: targetUserId },
      });

      // Finally delete user
      await tx.user.delete({
        where: { id: targetUserId },
      });
    });

    revalidatePath("/admin/users");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete account",
    };
  }
}

// Get user activity log
export async function getUserActivityLog(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  activities: Array<{
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
  total: number;
} | null> {
  try {
    const currentUser = await getAuthenticatedUser();
    
    const hasPermission = currentUser.id === userId || await isAdmin(currentUser.id);
    
    if (!hasPermission) {
      throw new Error("Unauthorized");
    }

    // This would require an ActivityLog model
    // For now, return invoice activity
    const [invoices, total] = await Promise.all([
      db.invoiceModel.findMany({
        where: { userId },
        select: {
          id: true,
          invoiceNumber: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          sentAt: true,
          paidAt: true,
          viewedAt: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.invoiceModel.count({ where: { userId } }),
    ]);

    const activities = invoices.flatMap(invoice => {
      const acts = [];
      
      acts.push({
        id: `${invoice.id}-created`,
        type: "invoice_created",
        description: `Invoice ${invoice.invoiceNumber} was created`,
        createdAt: invoice.createdAt.toISOString(),
      });

      if (invoice.sentAt) {
        acts.push({
          id: `${invoice.id}-sent`,
          type: "invoice_sent",
          description: `Invoice ${invoice.invoiceNumber} was sent`,
          createdAt: invoice.sentAt.toISOString(),
        });
      }

      if (invoice.viewedAt) {
        acts.push({
          id: `${invoice.id}-viewed`,
          type: "invoice_viewed",
          description: `Invoice ${invoice.invoiceNumber} was viewed`,
          createdAt: invoice.viewedAt.toISOString(),
        });
      }

      if (invoice.paidAt) {
        acts.push({
          id: `${invoice.id}-paid`,
          type: "invoice_paid",
          description: `Invoice ${invoice.invoiceNumber} was paid`,
          createdAt: invoice.paidAt.toISOString(),
        });
      }

      return acts;
    });

    return {
      activities: activities.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, limit),
      total: activities.length,
    };
  } catch (error) {
    console.error("Error fetching user activity log:", error);
    return null;
  }
}