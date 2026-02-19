// actions/stripe.ts
"use server";

import Stripe from "stripe";
import { updateAppointmentPaymentStatus } from "./appointments";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil"
});

export async function createPaymentIntent(amount: number, appointmentId: string, patientInfo?: any) {
  try {
    const amountInCents = Math.round(amount * 100);

    // Payment intent oluştur
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        appointmentId: appointmentId,
        patientName: patientInfo ? `${patientInfo.firstName} ${patientInfo.lastName}` : "",
        patientEmail: patientInfo?.email || "",
        patientPhone: patientInfo?.phone || "",
      },
      receipt_email: patientInfo?.email, // Makbuz e-postası
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Stripe payment intent error:", error);
    return { error: "Payment intent oluşturulamadı" };
  }
}

export async function confirmPaymentIntent(paymentIntentId: string, appointmentId: string) {
  try {
    // Payment intent'i Stripe'dan al
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Ödeme başarılı mı kontrol et
    if (paymentIntent.status === 'succeeded') {
      // Veritabanını güncelle
      const result = await updateAppointmentPaymentStatus(
        appointmentId, 
        paymentIntentId, 
        'paid'
      );
      
      if (result.error) {
        return { error: result.error };
      }
      
      return { 
        success: true, 
        paymentIntent,
        appointment: result.data 
      };
    } else {
      return { 
        success: false, 
        error: `Ödeme durumu: ${paymentIntent.status}` 
      };
    }
  } catch (error) {
    console.error("Stripe payment confirmation error:", error);
    return { error: "Ödeme onaylanamadı" };
  }
}

export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return { paymentIntent };
  } catch (error) {
    console.error("Stripe payment intent retrieve error:", error);
    return { error: "Payment intent bulunamadı" };
  }
}

// Webhook için - Stripe'dan otomatik bildirim
export async function handleStripeWebhook(event: any) {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const appointmentId = paymentIntent.metadata.appointmentId;
        
        if (appointmentId) {
          await updateAppointmentPaymentStatus(
            appointmentId,
            paymentIntent.id,
            'paid'
          );
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        break;
    }
    
    return { received: true };
  } catch (error) {
    console.error("Webhook error:", error);
    return { error };
  }
}