// app/api/billing/reactivate-subscription/route.ts
import { NextRequest, NextResponse } from "next/server";



import db from "@/app/lib/db";
import { stripe } from "../../config/stripe";
import { validateRequest } from "@/app/auth";

export async function POST(request: NextRequest) {
  try {
    const {user} = await validateRequest();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await db.user.findUnique({
      where: { email: user.email },
      include: { subscription: true },
    });

    if (!users || !users.subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const subscription = users.subscription;

    // If it's a Stripe subscription, reactivate it
    if (subscription.stripeSubscriptionId && subscription.cancelAtPeriodEnd) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });
    }

    // Update our database
    const updatedSubscription = await db.subscriptionInvoice.update({
      where: { userId: user.id },
      data: {
        cancelAtPeriodEnd: false,
        cancelAt: null,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      message: "Subscription reactivated successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return NextResponse.json(
      { error: "Failed to reactivate subscription" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
