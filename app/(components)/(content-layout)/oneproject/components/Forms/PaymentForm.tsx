"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../components/ui/dialog";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { PaymentProps } from "../../types/types";
import { createPayment } from "../../actions/payments";
import toast from "react-hot-toast";
import { generateInvoiceNumber } from "../../lib/generateInvoiceNumber";
import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { convertIsoToDateString } from "../../lib/convertISODateToNorma";
import { convertDateToIso } from "../../lib/convertDateToIso";
import useCurrencySettings from "../../hooks/useCurrencySettings";
import { formatCurrency } from "../../lib/formatCurrency";

export default function PaymentForm({
  projectId,
  userId,
  clientId,
  remainingAmount,
}: {
  projectId: string;
  userId: string;
  clientId: string;
  remainingAmount: number;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentProps>({
    defaultValues: {
      date: convertIsoToDateString(new Date().toISOString()),
    },
  });

  const [loading, setLoading] = useState(false);
  const { localCurrency, exchangeRate, defaultCurrency } =
    useCurrencySettings();

  async function savePayment(data: PaymentProps) {
    data.invoiceNumber = generateInvoiceNumber();
    data.userId = userId;
    data.clientId = clientId;
    data.projectId = projectId;

    const localAmount = Number(data.amount);
    const convertedAmount = (localAmount / exchangeRate).toFixed(2);
    data.tax = Number(data.tax);
    data.amount = Number(convertedAmount) + data.tax;
    data.date = convertDateToIso(data.date);

    try {
      setLoading(true);
      await createPayment(data);
      toast.success("Payment Created Successfully!");
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-black border-gray-300 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Payment
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-white text-black rounded-lg p-6 shadow-lg max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Add Payment</DialogTitle>
            <DialogDescription className="text-sm text-black mt-1">
              The Project Remaining Amount is{" "}
              <span className="font-semibold">
                {formatCurrency(remainingAmount, defaultCurrency, exchangeRate)}
              </span>
              <p className="text-sm text-red-500 font-semibold py-1">
                Note: 1 USD = {exchangeRate} {localCurrency}
              </p>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(savePayment)} className="space-y-4 mt-4">
            <Card className="bg-white text-black border border-gray-300 shadow-sm">
              <CardContent>
                <div className="grid gap-6">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Payment Title"
                    name="title"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      register={register}
                      errors={errors}
                      label={`Paid Amount (${defaultCurrency})`}
                      name="amount"
                      type="number"
                    />
                    <TextInput
                      register={register}
                      errors={errors}
                      label="Payment Date"
                      type="date"
                      name="date"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <TextInput
                      register={register}
                      errors={errors}
                      label="Tax"
                      name="tax"
                      type="number"
                    />
                    <TextInput
                      register={register}
                      errors={errors}
                      label="Payment Method"
                      name="method"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <SubmitButton
                title="Create Payment"
                loading={loading}
                className="bg-black text-white hover:bg-gray-800"
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
