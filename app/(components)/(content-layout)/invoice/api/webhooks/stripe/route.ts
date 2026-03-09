// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import { stripe } from "../../../config/stripe";
// import db from "@/app/lib/db";

// const webhookSecret = process.env.INVOICE_WEBHOOK_STRIPE_SECRET!;

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

// export enum PaymentStatus {
//   PENDING = "PENDING",
//   SUCCEEDED = "SUCCEEDED",
//   FAILED = "FAILED",
//   CANCELLED = "CANCELLED",
//   REFUNDED = "REFUNDED",
// }

// // Helper function to get user by Stripe customer ID or email
// async function getUserByStripeCustomerOrEmail(
//   stripeCustomerId: string,
//   email?: string
// ) {
//   let user = await db.user.findUnique({
//     where: { stripeCustomerId },
//     include: { subscription: true },
//   });

//   if (!user && email) {
//     user = await db.user.findUnique({
//       where: { email },
//       include: { subscription: true },
//     });

//     // Update user with Stripe customer ID if found by email
//     if (user) {
//       user = await db.user.update({
//         where: { id: user.id },
//         data: { stripeCustomerId },
//         include: { subscription: true },
//       });
//     }
//   }

//   return user;
// }

// // Helper function to determine subscription plan from Stripe price ID
// function getSubscriptionPlanFromPriceId(priceId: string): SubscriptionPlan {
//   const monthlyPriceId = process.env.INVOICE_STRIPE_MONTHLY_ID;
//   const yearlyPriceId = process.env.INVOICE_STRIPE_YEARLY_ID;

//   if (priceId === yearlyPriceId) return SubscriptionPlan.YEARLY;
//   if (priceId === monthlyPriceId) return SubscriptionPlan.MONTHLY;
  
//   // Default to MONTHLY if unknown
//   console.warn(`Unknown price ID: ${priceId}, defaulting to MONTHLY`);
//   return SubscriptionPlan.MONTHLY;
// }

// // Helper function to map Stripe subscription status to our enum
// function mapStripeStatus(stripeStatus: string): SubscriptionStatus {
//   switch (stripeStatus) {
//     case "active":
//       return SubscriptionStatus.ACTIVE;
//     case "canceled":
//       return SubscriptionStatus.CANCELLED;
//     case "past_due":
//       return SubscriptionStatus.PAST_DUE;
//     case "trialing":
//       return SubscriptionStatus.TRIALING;
//     case "incomplete":
//       return SubscriptionStatus.INCOMPLETE;
//     case "incomplete_expired":
//       return SubscriptionStatus.INCOMPLETE_EXPIRED;
//     case "unpaid":
//       return SubscriptionStatus.UNPAID;
//     default:
//       return SubscriptionStatus.INACTIVE;
//   }
// }

// // Helper function to ensure plan limits exist
// async function ensurePlanLimits(plan: SubscriptionPlan) {
//   const existingLimits = await db.planLimit.findUnique({
//     where: { plan },
//   });

//   if (!existingLimits) {
//     const defaultLimits = {
//       [SubscriptionPlan.FREE]: { maxDailyInvoices: 2, maxClients: 10 },
//       [SubscriptionPlan.MONTHLY]: { maxDailyInvoices: null, maxClients: null },
//       [SubscriptionPlan.YEARLY]: { maxDailyInvoices: null, maxClients: null },
//     };

//     await db.planLimit.create({
//       data: {
//         plan,
//         maxDailyInvoices: defaultLimits[plan].maxDailyInvoices,
//         maxClients: defaultLimits[plan].maxClients,
//         customBranding: plan !== SubscriptionPlan.FREE,
//         prioritySupport: plan === SubscriptionPlan.YEARLY,
//         teamAccess: plan === SubscriptionPlan.YEARLY,
//         exportFormats: ["PDF"],
//         canRemoveBranding: plan !== SubscriptionPlan.FREE,
//       },
//     });
//   }
// }

// export async function POST(request: NextRequest) {
//   const body = await request.text();
//   const signature = request.headers.get("stripe-signature") as string;

//   if (!signature) {
//     return NextResponse.json(
//       { error: "Missing stripe-signature header" },
//       { status: 400 }
//     );
//   }

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err);
//     return NextResponse.json(
//       {
//         error: `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
//       },
//       { status: 400 }
//     );
//   }

//   try {
//     console.log(`Processing webhook event: ${event.type}`);

//     switch (event.type) {
//       case "payment_intent.succeeded": {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;
//         console.log("Payment succeeded:", paymentIntent.id);

//         const { customer_email, customer_name, plan_type, userId } =
//           paymentIntent.metadata;
//         const customerId = paymentIntent.customer as string;

//         if (!customer_email || !plan_type || !customerId) {
//           console.error("Missing required metadata in payment intent");
//           break;
//         }

//         // Find user
//         const user = userId 
//           ? await db.user.findUnique({ where: { id: userId } })
//           : await getUserByStripeCustomerOrEmail(customerId, customer_email);

//         if (!user) {
//           console.error("User not found for payment intent:", paymentIntent.id);
//           break;
//         }

//         // Get receipt URL from the latest charge
//         let receiptUrl = null;
//         let invoiceUrl = null;
//         try {
//           if (paymentIntent.latest_charge) {
//             const charge = await stripe.charges.retrieve(
//               paymentIntent.latest_charge as string
//             );
//             receiptUrl = charge.receipt_url;

//             if (charge.invoice) {
//               const invoice = await stripe.invoices.retrieve(
//                 charge.invoice as string
//               );
//               invoiceUrl = invoice.hosted_invoice_url;
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching charge/invoice details:", error);
//         }

//         // Determine plan
//         const plan = plan_type === "yearly" ? SubscriptionPlan.YEARLY : SubscriptionPlan.MONTHLY;

//         // Create payment record
//         const payment = await db.paymentInvoice.create({
//           data: {
//             userId: user.id,
//             stripePaymentId: paymentIntent.id,
//             stripeCustomerId: customerId,
//             amount: paymentIntent.amount,
//             currency: paymentIntent.currency,
//             status: PaymentStatus.SUCCEEDED,
//             description: paymentIntent.description || `${plan_type} subscription payment`,
//             plan,
//             interval: plan_type === "yearly" ? "year" : "month",
//             paidAt: new Date(),
//             receiptUrl,
//             invoiceUrl,
//           },
//         });

//         console.log("Payment record created:", payment.id);

//         // Calculate subscription periods
//         const periodStart = new Date();
//         const periodEnd = new Date();

//         if (plan === SubscriptionPlan.YEARLY) {
//           periodEnd.setFullYear(periodEnd.getFullYear() + 1);
//         } else {
//           periodEnd.setMonth(periodEnd.getMonth() + 1);
//         }

//         // Create or update subscription
//         const subscription = await db.subscriptionInvoice.upsert({
//           where: { userId: user.id },
//           update: {
//             plan,
//             status: SubscriptionStatus.ACTIVE,
//             currentPeriodStart: periodStart,
//             currentPeriodEnd: periodEnd,
//             stripeCustomerId: customerId,
//             priceAmount: paymentIntent.amount,
//             priceCurrency: paymentIntent.currency,
//             interval: plan === SubscriptionPlan.YEARLY ? "year" : "month",
//             cancelAtPeriodEnd: false,
//             cancelAt: null,
//             canceledAt: null,
//           },
//           create: {
//             userId: user.id,
//             plan,
//             status: SubscriptionStatus.ACTIVE,
//             currentPeriodStart: periodStart,
//             currentPeriodEnd: periodEnd,
//             stripeCustomerId: customerId,
//             priceAmount: paymentIntent.amount,
//             priceCurrency: paymentIntent.currency,
//             interval: plan === SubscriptionPlan.YEARLY ? "year" : "month",
//           },
//         });

//         console.log(`Subscription updated for user ${user.id} to ${plan}`);

//         // Ensure plan limits exist
//         await ensurePlanLimits(plan);

//         // Reset user's daily invoice counter
//         await db.user.update({
//           where: { id: user.id },
//           data: {
//             dailyInvoicesCreated: 0,
//             lastInvoiceDate: new Date(),
//           },
//         });

//         break;
//       }

//       case "customer.subscription.created": {
//         const subscription = event.data.object as Stripe.Subscription;
//         console.log("Subscription created:", subscription.id);

//         const customerId = subscription.customer as string;
//         const user = await getUserByStripeCustomerOrEmail(customerId);
        
//         if (!user) {
//           console.error("User not found for subscription:", subscription.id);
//           break;
//         }

//         const priceId = subscription.items.data[0]?.price.id;
//         if (!priceId) {
//           console.error("No price ID found in subscription");
//           break;
//         }

//         const plan = getSubscriptionPlanFromPriceId(priceId);
//         const status = mapStripeStatus(subscription.status);

//         // Create subscription record
//         await db.subscriptionInvoice.upsert({
//           where: { userId: user.id },
//           update: {
//             stripeSubscriptionId: subscription.id,
//             stripePriceId: priceId,
//             stripeCustomerId: customerId,
//             plan,
//             status,
//             currentPeriodStart: new Date(
//               subscription.current_period_start * 1000
//             ),
//             currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//             cancelAtPeriodEnd: subscription.cancel_at_period_end,
//             cancelAt: subscription.cancel_at
//               ? new Date(subscription.cancel_at * 1000)
//               : null,
//             trialStart: subscription.trial_start
//               ? new Date(subscription.trial_start * 1000)
//               : null,
//             trialEnd: subscription.trial_end
//               ? new Date(subscription.trial_end * 1000)
//               : null,
//             priceAmount: subscription.items.data[0]?.price.unit_amount || 0,
//             priceCurrency: subscription.items.data[0]?.price.currency || "usd",
//             interval: subscription.items.data[0]?.price.recurring?.interval || "month",
//           },
//           create: {
//             userId: user.id,
//             stripeSubscriptionId: subscription.id,
//             stripePriceId: priceId,
//             stripeCustomerId: customerId,
//             plan,
//             status,
//             currentPeriodStart: new Date(
//               subscription.current_period_start * 1000
//             ),
//             currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//             cancelAtPeriodEnd: subscription.cancel_at_period_end,
//             cancelAt: subscription.cancel_at
//               ? new Date(subscription.cancel_at * 1000)
//               : null,
//             trialStart: subscription.trial_start
//               ? new Date(subscription.trial_start * 1000)
//               : null,
//             trialEnd: subscription.trial_end
//               ? new Date(subscription.trial_end * 1000)
//               : null,
//             priceAmount: subscription.items.data[0]?.price.unit_amount || 0,
//             priceCurrency: subscription.items.data[0]?.price.currency || "usd",
//             interval: subscription.items.data[0]?.price.recurring?.interval || "month",
//           },
//         });

//         // Ensure plan limits exist
//         await ensurePlanLimits(plan);

//         // Reset user's daily invoice counter for new subscription
//         if (status === SubscriptionStatus.ACTIVE || status === SubscriptionStatus.TRIALING) {
//           await db.user.update({
//             where: { id: user.id },
//             data: {
//               dailyInvoicesCreated: 0,
//               lastInvoiceDate: new Date(),
//             },
//           });
//         }

//         break;
//       }

//       case "customer.subscription.updated": {
//         const subscription = event.data.object as Stripe.Subscription;
//         console.log("Subscription updated:", subscription.id);

//         const customerId = subscription.customer as string;
//         const user = await getUserByStripeCustomerOrEmail(customerId);
        
//         if (!user) {
//           console.error("User not found for subscription:", subscription.id);
//           break;
//         }

//         const priceId = subscription.items.data[0]?.price.id;
//         if (!priceId) break;

//         const plan = getSubscriptionPlanFromPriceId(priceId);
//         const status = mapStripeStatus(subscription.status);

//         // Get current subscription to check for status change
//         const currentSubscription = await db.subscriptionInvoice.findUnique({
//           where: { userId: user.id },
//         });

//         await db.subscriptionInvoice.update({
//           where: { userId: user.id },
//           data: {
//             stripePriceId: priceId,
//             plan,
//             status,
//             currentPeriodStart: new Date(
//               subscription.current_period_start * 1000
//             ),
//             currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//             cancelAtPeriodEnd: subscription.cancel_at_period_end,
//             cancelAt: subscription.cancel_at
//               ? new Date(subscription.cancel_at * 1000)
//               : null,
//             canceledAt: subscription.canceled_at
//               ? new Date(subscription.canceled_at * 1000)
//               : null,
//             priceAmount: subscription.items.data[0]?.price.unit_amount || 0,
//             interval: subscription.items.data[0]?.price.recurring?.interval || "month",
//           },
//         });

//         // If subscription was reactivated (from cancelled/inactive to active)
//         if (status === SubscriptionStatus.ACTIVE && 
//             currentSubscription?.status !== SubscriptionStatus.ACTIVE) {
//           await db.user.update({
//             where: { id: user.id },
//             data: {
//               dailyInvoicesCreated: 0,
//               lastInvoiceDate: new Date(),
//             },
//           });
//         }

//         break;
//       }

//       case "customer.subscription.deleted": {
//         const subscription = event.data.object as Stripe.Subscription;
//         console.log("Subscription cancelled:", subscription.id);

//         const customerId = subscription.customer as string;
//         const user = await getUserByStripeCustomerOrEmail(customerId);
        
//         if (!user) {
//           console.error("User not found for cancelled subscription:", subscription.id);
//           break;
//         }

//         await db.subscriptionInvoice.update({
//           where: { userId: user.id },
//           data: {
//             status: SubscriptionStatus.CANCELLED,
//             canceledAt: new Date(subscription.canceled_at! * 1000),
//             cancelAtPeriodEnd: false,
//           },
//         });

//         // Reset user to FREE plan limits
//         const freePlanLimits = await db.planLimit.findUnique({
//           where: { plan: SubscriptionPlan.FREE },
//         });

//         // Optionally notify user
//         console.log(`User ${user.id} subscription cancelled`);

//         break;
//       }

//       case "invoice.payment_succeeded": {
//         const invoice = event.data.object as Stripe.Invoice;
//         console.log("Invoice payment succeeded:", invoice.id);

//         const customerId = invoice.customer as string;
//         const user = await getUserByStripeCustomerOrEmail(customerId);
        
//         if (!user) {
//           console.error("User not found for invoice:", invoice.id);
//           break;
//         }

//         // Get user's current subscription
//         const subscription = await db.subscriptionInvoice.findUnique({
//           where: { userId: user.id },
//         });

//         if (!subscription) {
//           console.error("No subscription found for user:", user.id);
//           break;
//         }

//         // Create payment record for recurring payment
//         await db.paymentInvoice.create({
//           data: {
//             userId: user.id,
//             stripePaymentId: invoice.payment_intent as string,
//             stripeCustomerId: customerId,
//             stripeInvoiceId: invoice.id,
//             amount: invoice.amount_paid,
//             currency: invoice.currency,
//             status: PaymentStatus.SUCCEEDED,
//             description: invoice.description || "Subscription renewal",
//             plan: subscription.plan,
//             interval: subscription.interval || "month",
//             paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
//             receiptUrl: invoice.receipt_number
//               ? `https://pay.stripe.com/receipts/${invoice.receipt_number}`
//               : null,
//             invoiceUrl: invoice.hosted_invoice_url,
//           },
//         });

//         // Update subscription status to active
//         await db.subscriptionInvoice.update({
//           where: { userId: user.id },
//           data: { 
//             status: SubscriptionStatus.ACTIVE,
//             // Optionally update period end if needed
//           },
//         });

//         break;
//       }

//       case "invoice.payment_failed": {
//         const invoice = event.data.object as Stripe.Invoice;
//         console.log("Invoice payment failed:", invoice.id);

//         const customerId = invoice.customer as string;
//         const user = await getUserByStripeCustomerOrEmail(customerId);
        
//         if (!user || !user.subscription) break;

//         // Update subscription status to past_due
//         await db.subscriptionInvoice.update({
//           where: { userId: user.id },
//           data: {
//             status: SubscriptionStatus.PAST_DUE,
//           },
//         });

//         // Create failed payment record
//         await db.paymentInvoice.create({
//           data: {
//             userId: user.id,
//             stripePaymentId: invoice.payment_intent as string,
//             stripeCustomerId: customerId,
//             stripeInvoiceId: invoice.id,
//             amount: invoice.amount_due,
//             currency: invoice.currency,
//             status: PaymentStatus.FAILED,
//             description: "Subscription payment failed",
//             plan: user.subscription.plan,
//             interval: user.subscription.interval || "month",
//             failedAt: new Date(),
//           },
//         });

//         break;
//       }

//       case "customer.subscription.trial_will_end": {
//         const subscription = event.data.object as Stripe.Subscription;
//         console.log("Trial will end for subscription:", subscription.id);

//         const customerId = subscription.customer as string;
//         const user = await getUserByStripeCustomerOrEmail(customerId);
        
//         if (!user) break;

//         // Here you could send a notification to the user
//         console.log(`Trial will end for user ${user.id} on ${new Date(subscription.trial_end! * 1000)}`);

//         break;
//       }

//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }

//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error("Error handling webhook:", error);
//     return NextResponse.json(
//       { error: "Webhook handler failed", details: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }









import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "../../../config/stripe";
import db from "@/app/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const webhookSecret = process.env.INVOICE_WEBHOOK_STRIPE_SECRET!;

enum SubscriptionPlan {
  FREE = "FREE",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELLED = "CANCELLED",
  PAST_DUE = "PAST_DUE",
  TRIALING = "TRIALING",
}

enum PaymentStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature error:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    console.log("Stripe event:", event.type);

    switch (event.type) {

      /**
       * PAYMENT SUCCESS
       */

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const {
          userId,
          userEmail,
          userName,
          planType,
          stripePriceId,
        } = paymentIntent.metadata;

        const customerId = paymentIntent.customer as string;

        if (!userId) {
          console.error("Missing userId metadata");
          break;
        }

        const user = await db.user.findUnique({
          where: { id: userId },
          include: { subscription: true },
        });

        if (!user) {
          console.error("User not found:", userId);
          break;
        }

        const plan =
          planType === "yearly"
            ? SubscriptionPlan.YEARLY
            : SubscriptionPlan.MONTHLY;

        /**
         * UPDATE PAYMENT RECORD
         */

        await db.paymentInvoice.update({
          where: {
            stripePaymentId: paymentIntent.id,
          },
          data: {
            status: PaymentStatus.SUCCEEDED,
            paidAt: new Date(),
          },
        });

        /**
         * CALCULATE SUBSCRIPTION PERIOD
         */

        const start = new Date();
        const end = new Date();

        if (plan === SubscriptionPlan.YEARLY) {
          end.setFullYear(end.getFullYear() + 1);
        } else {
          end.setMonth(end.getMonth() + 1);
        }

        /**
         * CREATE OR UPDATE SUBSCRIPTION
         */

        await db.subscriptionInvoice.upsert({
          where: {
            userId: user.id,
          },
          update: {
            plan,
            status: SubscriptionStatus.ACTIVE,
            stripeCustomerId: customerId,
            stripePriceId,
            currentPeriodStart: start,
            currentPeriodEnd: end,
            priceAmount: paymentIntent.amount,
            priceCurrency: paymentIntent.currency,
            interval: plan === SubscriptionPlan.YEARLY ? "year" : "month",
          },
          create: {
            userId: user.id,
            plan,
            status: SubscriptionStatus.ACTIVE,
            stripeCustomerId: customerId,
            stripePriceId,
            currentPeriodStart: start,
            currentPeriodEnd: end,
            priceAmount: paymentIntent.amount,
            priceCurrency: paymentIntent.currency,
            interval: plan === SubscriptionPlan.YEARLY ? "year" : "month",
          },
        });

        /**
         * RESET DAILY INVOICE LIMIT
         */

        await db.user.update({
          where: { id: user.id },
          data: {
            dailyInvoicesCreated: 0,
            lastInvoiceDate: new Date(),
          },
        });

        console.log(`User ${user.id} upgraded to ${plan}`);

        break;
      }

      /**
       * PAYMENT FAILED
       */

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await db.paymentInvoice.update({
          where: {
            stripePaymentId: paymentIntent.id,
          },
          data: {
            status: PaymentStatus.FAILED,
            failedAt: new Date(),
          },
        });

        console.log("Payment failed:", paymentIntent.id);

        break;
      }

      /**
       * PAYMENT REFUND
       */

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        await db.paymentInvoice.updateMany({
          where: {
            stripePaymentId: charge.payment_intent as string,
          },
          data: {
            status: PaymentStatus.REFUNDED,
            refundedAt: new Date(),
          },
        });

        console.log("Payment refunded:", charge.payment_intent);

        break;
      }

      default:
        console.log("Unhandled event:", event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        error: "Webhook handler failed",
      },
      { status: 500 }
    );
  }
}