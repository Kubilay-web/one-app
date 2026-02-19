"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  appointmentId: string;  // Bu prop'u ekleyin
  onSuccess: () => void;
  onBack: () => void;
}

function PaymentFormContent({ clientSecret, amount, appointmentId, onSuccess, onBack }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // 1. Ödemeyi confirm et
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/medical/dashboard/user/appointments`,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        toast.error(confirmError.message || "Ödeme başarısız oldu");
        setIsLoading(false);
        return;
      }

      // 2. Ödeme başarılıysa backend'i güncelle
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log("Payment succeeded:", paymentIntent.id);
        console.log("Appointment ID:", appointmentId);
        
        // API'ye istek at
        const response = await fetch('/api/onemedical/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            appointmentId: appointmentId,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success("Ödeme başarılı! Randevunuz onaylandı.");
          onSuccess();
          router.push("/medical/dashboard/user/appointments");
          router.refresh(); // Sayfayı yenile
        } else {
          toast.error("Ödeme alındı ama randevu güncellenemedi. Destek ekibiyle iletişime geçin.");
          console.error("API error:", result.error);
        }
      } else {
        toast.success("Ödeme başarıyla tamamlandı!");
        onSuccess();
        router.push("/medical/dashboard/user/appointments");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Payment Details</h3>
        <p className="text-gray-600">Total: <span className="font-bold text-lg text-blue-600">${amount}</span></p>
        <p className="text-xs text-gray-500 mt-2">Test card: 4242 4242 4242 4242</p>
        <p className="text-xs text-gray-500">Appointment ID: {appointmentId}</p>
      </div>

      <PaymentElement />

      <div className="flex justify-between gap-4 mt-6">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button type="submit" disabled={!stripe || isLoading} className="bg-green-600 hover:bg-green-700">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `$${amount} Pay`
          )}
        </Button>
      </div>
    </form>
  );
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
      <PaymentFormContent {...props} />
    </Elements>
  );
}