"use server";

import db from "@/app/lib/db";
import { validateRequest } from "@/app/auth";
import { InvoiceQuotaResponse, PlanLimitsResponse, SubscriptionPlan, SubscriptionStatus } from "../types/limit";



// -------------------------
// Helper functions
// -------------------------
async function getAuthenticatedUser() {
  const { user } = await validateRequest();

  if (!user?.email) throw new Error("Unauthorized");

  const userData = await db.user.findUnique({
    where: { email: user.email },
    include: { subscription: true },
  });

  if (!userData) throw new Error("User not found");

  return userData;
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getTomorrowStart(): Date {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  t.setHours(0, 0, 0, 0);
  return t;
}

// -------------------------
// Invoice Quota
// -------------------------
export async function getCurrentUserInvoiceQuota(): Promise<InvoiceQuotaResponse | null> {
  try {
    const user = await getAuthenticatedUser();
    return getInvoiceQuota(user.id);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getInvoiceQuota(userId: string): Promise<InvoiceQuotaResponse | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });
    if (!user) return null;

    let subscription = await db.subscriptionInvoice.findFirst({ where: { userId } });
    if (!subscription) {
      subscription = await db.subscriptionInvoice.create({
        data: { userId, plan: SubscriptionPlan.FREE, status: SubscriptionStatus.ACTIVE },
      });
    }

    let planLimits = await db.planLimit.findUnique({ where: { plan: subscription.plan } });
    if (!planLimits) {
      planLimits = await db.planLimit.create({
        data: {
          plan: subscription.plan,
          maxDailyInvoices: subscription.plan === SubscriptionPlan.FREE ? 2 : null,
          maxClients: subscription.plan === SubscriptionPlan.FREE ? 10 : null,
          customBranding: subscription.plan !== SubscriptionPlan.FREE,
          prioritySupport: subscription.plan === SubscriptionPlan.YEARLY,
          teamAccess: subscription.plan === SubscriptionPlan.YEARLY,
          exportFormats: ["PDF"],
          canRemoveBranding: subscription.plan !== SubscriptionPlan.FREE,
        },
      });
    }

    const dailyLimit = planLimits.maxDailyInvoices || 2;
    const hasUnlimited = subscription.plan !== SubscriptionPlan.FREE;

    const now = new Date();
    const lastInvoiceDate = user.lastInvoiceDate || new Date(0);
    let remaining = 0;
    let totalUsedToday = user.dailyInvoicesCreated || 0;
    let resetTime = getTomorrowStart();

    if (!isSameDay(now, lastInvoiceDate)) {
      remaining = dailyLimit;
      totalUsedToday = 0;
      await db.user.update({
        where: { id: userId },
        data: { dailyInvoicesCreated: 0, lastInvoiceDate: now },
      });
    } else {
      remaining = Math.max(0, dailyLimit - (user.dailyInvoicesCreated || 0));
    }

    return {
      remaining: hasUnlimited ? Infinity : remaining,
      dailyLimit,
      totalUsedToday,
      hasUnlimited,
      resetTime,
      plan: subscription.plan,
      isActive: subscription.status === SubscriptionStatus.ACTIVE,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// -------------------------
// Plan Limits
// -------------------------
export async function getCurrentUserPlanLimits(): Promise<PlanLimitsResponse | null> {
  try {
    const user = await getAuthenticatedUser();
    return getPlanLimits(user.id);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPlanLimits(userId: string): Promise<PlanLimitsResponse | null> {
  try {
    const subscription = await db.subscriptionInvoice.findUnique({ where: { userId } });
    if (!subscription) {
      return {
        maxDailyInvoices: 2,
        maxClients: 10,
        customBranding: false,
        prioritySupport: false,
        teamAccess: false,
        exportFormats: ["PDF"],
        canRemoveBranding: false,
        plan: SubscriptionPlan.FREE,
      };
    }

    const planLimits = await db.planLimit.findUnique({ where: { plan: subscription.plan } });
    if (!planLimits) {
      const isFree = subscription.plan === SubscriptionPlan.FREE;
      return {
        maxDailyInvoices: isFree ? 2 : null,
        maxClients: isFree ? 10 : null,
        customBranding: !isFree,
        prioritySupport: subscription.plan === SubscriptionPlan.YEARLY,
        teamAccess: subscription.plan === SubscriptionPlan.YEARLY,
        exportFormats: ["PDF"],
        canRemoveBranding: !isFree,
        plan: subscription.plan,
      };
    }

    return {
      maxDailyInvoices: planLimits.maxDailyInvoices,
      maxClients: planLimits.maxClients,
      customBranding: planLimits.customBranding,
      prioritySupport: planLimits.prioritySupport,
      teamAccess: planLimits.teamAccess,
      exportFormats: planLimits.exportFormats,
      canRemoveBranding: planLimits.canRemoveBranding,
      plan: subscription.plan,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// -------------------------
// Invoice/Client Permissions
// -------------------------
export async function canCreateInvoice(userId: string) {
  try {
    const quota = await getInvoiceQuota(userId);
    if (!quota) return { canCreate: false, message: "Unable to verify invoice quota" };
    if (!quota.isActive) return { canCreate: false, message: "Subscription not active", quota };
    if (!quota.hasUnlimited && quota.remaining <= 0)
      return {
        canCreate: false,
        message: `Daily invoice limit reached (${quota.dailyLimit}). Reset at ${quota.resetTime.toLocaleTimeString()}.`,
        quota,
      };
    return { canCreate: true, quota };
  } catch (error) {
    console.error(error);
    return { canCreate: false, message: "Error checking invoice permissions" };
  }
}

export async function canCreateClient(userId: string) {
  try {
    const limits = await getPlanLimits(userId);
    if (!limits) return { canCreate: false, message: "Unable to verify client limits" };

    if (limits.maxClients === null) return { canCreate: true, maxClients: null };

    const clientCount = await db.client.count({ where: { userId } });
    if (clientCount >= limits.maxClients)
      return {
        canCreate: false,
        message: `Max clients reached (${limits.maxClients}). Upgrade plan to add more.`,
        currentCount: clientCount,
        maxClients: limits.maxClients,
      };

    return { canCreate: true, currentCount: clientCount, maxClients: limits.maxClients };
  } catch (error) {
    console.error(error);
    return { canCreate: false, message: "Error checking client permissions" };
  }
}

// -------------------------
// Increment Usage
// -------------------------
export async function incrementInvoiceUsage(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { dailyInvoicesCreated: true, totalInvoicesCreated: true, lastInvoiceDate: true },
    });
    if (!user) return false;

    const now = new Date();
    const last = user.lastInvoiceDate || new Date(0);

    if (!isSameDay(now, last)) {
      await db.user.update({
        where: { id: userId },
        data: { dailyInvoicesCreated: 1, totalInvoicesCreated: (user.totalInvoicesCreated || 0) + 1, lastInvoiceDate: now },
      });
    } else {
      await db.user.update({
        where: { id: userId },
        data: { dailyInvoicesCreated: (user.dailyInvoicesCreated || 0) + 1, totalInvoicesCreated: (user.totalInvoicesCreated || 0) + 1, lastInvoiceDate: now },
      });
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// -------------------------
// Additional Utilities
// -------------------------
export async function getBrandCurrencyByUserId(userId: string): Promise<string> {
  try {
    const brand = await db.brand.findUnique({ where: { userId }, select: { currency: true } });
    return brand?.currency || "$";
  } catch (error) {
    console.error(error);
    return "$";
  }
}