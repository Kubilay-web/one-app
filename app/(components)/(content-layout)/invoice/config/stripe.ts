// import "server-only";
// import Stripe from "stripe";

// export const stripe = new Stripe(process.env.NEXT_PUBLIC_INVOICE_STRIPE_SECRET_KEY ?? "");



import "server-only";
import Stripe from "stripe";

if (!process.env.INVOICE_STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.INVOICE_STRIPE_SECRET_KEY, {
apiVersion:"2025-08-27.basil"

});