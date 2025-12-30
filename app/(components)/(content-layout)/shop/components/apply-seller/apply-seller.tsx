// app/components/multi-step-form/apply-seller-multi-form.tsx
"use client";
import { StoreType } from "@/app/lib/types";
import { useState } from "react";
import Instructions from "./instructions";
import ProgressBar from "./progress-bar";
import Step1 from "./steps/step-1/step-1";
import Step2 from "./steps/setp-2/step-2";
import Step3 from "./steps/setp-3/step-3";
import Step4 from "./steps/step-4/step-4";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/SessionProvider";

export default function ApplySellerMultiForm() {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<StoreType>({
    name: "",
    description: "",
    email: "",
    phone: "",
    url: "",
    logo: "",
    cover: "",
    defaultShippingService: "",
    defaultShippingFeePerItem: undefined,
    defaultShippingFeeForAdditionalItem: undefined,
    defaultShippingFeePerKg: undefined,
    defaultShippingFeeFixed: undefined,
    defaultDeliveryTimeMin: undefined,
    defaultDeliveryTimeMax: undefined,
    returnPolicy: "",
  });

  // Form gönderim işlemi
  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to apply as a seller");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/oneshop/seller/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      // Başarılı oldu, 4. adıma geç
      setStep(4);


    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step3'ten gelen verileri alıp gönderim yap
  const handleStep3Complete = () => {
    handleSubmit();
  };

  return (
    <div className="grid lg:grid-cols-[400px_1fr]">
      <Instructions />
      <div className="relative w-full p-5">
        <ProgressBar step={step} />
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Steps */}
        {step === 1 ? (
          <Step1 step={step} setStep={setStep} />
        ) : step === 2 ? (
          <Step2
            formData={formData}
            setFormData={setFormData}
            step={step}
            setStep={setStep}
          />
        ) : step === 3 ? (
          <Step3
            formData={formData}
            setFormData={setFormData}
            step={step}
            setStep={setStep}
            onComplete={handleStep3Complete}
            isSubmitting={isSubmitting}
          />
        ) : step === 4 ? (
          <Step4 />
        ) : null}
      </div>
    </div>
  );
}
