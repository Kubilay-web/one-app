"use client";

import { StoreShippingSchema } from "@/app/lib/validation";
import { StoreType } from "@/app/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AnimatedContainer from "../../animated-container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/projects/components/ui/form";
import Input from "@/app/projects/components/store/ui/input";
import { Textarea } from "@/app/projects/components/store/ui/textarea";
import toast from "react-hot-toast";

export default function Step3({
  step,
  setStep,
  formData,
  setFormData,
}: {
  formData: StoreType;
  setFormData: Dispatch<SetStateAction<StoreType>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  const form = useForm<z.infer<typeof StoreShippingSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreShippingSchema),
    defaultValues: {
      defaultShippingService: formData.defaultShippingService,
      defaultShippingFeePerItem: formData.defaultShippingFeePerItem,
      defaultShippingFeePerKg: formData.defaultShippingFeePerKg,
      defaultShippingFeeForAdditionalItem: formData.defaultShippingFeeForAdditionalItem,
      defaultShippingFeeFixed: formData.defaultShippingFeeFixed,
      defaultDeliveryTimeMin: formData.defaultDeliveryTimeMin,
      defaultDeliveryTimeMax: formData.defaultDeliveryTimeMax,
      returnPolicy: formData.returnPolicy,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? (value ? Number(value) : 0) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    form.setValue(name as keyof typeof formData, parsedValue);
  };

  const handleSubmit = async (values: z.infer<typeof StoreShippingSchema>) => {
    try {
      // Direkt fetch atıyoruz
      const response = await fetch("/api/oneshop/seller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          defaultShippingService: values.defaultShippingService,
          defaultShippingFeePerItem: values.defaultShippingFeePerItem,
          defaultShippingFeeForAdditionalItem: values.defaultShippingFeeForAdditionalItem,
          defaultShippingFeePerKg: values.defaultShippingFeePerKg,
          defaultShippingFeeFixed: values.defaultShippingFeeFixed,
          defaultDeliveryTimeMin: values.defaultDeliveryTimeMin,
          defaultDeliveryTimeMax: values.defaultDeliveryTimeMax,
          returnPolicy: values.returnPolicy,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to submit");

      toast.success("Application submitted!");
      setStep(step + 1); // Step4'e geç
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <div className="h-full">
      <AnimatedContainer>
        <div className="mb-4 mt-2 pl-1 text-gray-600">
          <p className="font-medium">
            Fill out your store&apos;s default shipping details (optional)
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="defaultShippingService"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Shipping Service"
                        value={field.value}
                        name="defaultShippingService"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultShippingFeePerItem"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Shipping Fee per Item"
                        value={field.value}
                        type="number"
                        name="defaultShippingFeePerItem"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultShippingFeePerKg"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Shipping Fee per Kg"
                        value={field.value}
                        type="number"
                        name="defaultShippingFeePerKg"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultShippingFeeForAdditionalItem"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Shipping Fee for Additional Item"
                        value={field.value}
                        type="number"
                        name="defaultShippingFeeForAdditionalItem"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultShippingFeeFixed"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Fixed Shipping Fee"
                        value={field.value}
                        type="number"
                        name="defaultShippingFeeFixed"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultDeliveryTimeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Min Delivery Time"
                        value={field.value}
                        type="number"
                        name="defaultDeliveryTimeMin"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultDeliveryTimeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Max Delivery Time"
                        value={field.value}
                        type="number"
                        name="defaultDeliveryTimeMax"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returnPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Return Policy"
                        value={field.value}
                        name="returnPolicy"
                        onChange={(e) => {
                          field.onChange(e);
                          setFormData({ ...formData, returnPolicy: e.target.value });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex h-[100px] justify-between px-2 pt-4">
              <button
                type="button"
                onClick={() => step > 1 && setStep(step - 1)}
                className="h-10 rounded-lg border bg-white px-4 py-2 font-medium text-gray-600 shadow-sm hover:bg-gray-100"
              >
                Previous
              </button>
              <button
                type="submit"
                className="h-10 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </Form>
      </AnimatedContainer>
    </div>
  );
}
