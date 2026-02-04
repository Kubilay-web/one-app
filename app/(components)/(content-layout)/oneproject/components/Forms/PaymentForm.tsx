import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { PaymentProps } from "../../types/types";
import { createPayment } from "../../actions/payments";
import toast from "react-hot-toast";
import { generateInvoiceNumber } from "../../lib/generateInvoiceNumber";
import TextInput from "../FormInputs/TextInput";
import FormFooter from "./FormFooter";
import SubmitButton from "../FormInputs/SubmitButton";
import { getNormalDate } from "../../lib/getNormalDate";
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
  // invoiceNumber: string;
  // projectId: string;
  // userId: string;
  // clientId: string;
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

  async function saveCategory(data: PaymentProps) {
    data.invoiceNumber = generateInvoiceNumber();
    data.userId = userId;
    data.clientId = clientId;
    data.projectId = projectId;
    const localAmount = Number(data.amount);
    const convertedAmount = (localAmount / exchangeRate).toFixed(2);
    const subTotal = Number(convertedAmount);
    data.tax = Number(data.tax);
    data.amount = subTotal + data.tax;
    data.date = convertDateToIso(data.date);
    try {
      setLoading(true);
      await createPayment(data);
      setLoading(false);
      // Toast
      toast.success("Successfully Created!");
      //reset
      reset();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  const { localCurrency, exchangeRate, defaultCurrency } =
    useCurrencySettings();
  return (
    <div>
      <div className="py-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size={"sm"}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment</DialogTitle>
              <DialogDescription>
                The Project Remaining Amount is{" "}
                <span>
                  {formatCurrency(
                    remainingAmount,
                    defaultCurrency,
                    exchangeRate
                  )}
                </span>
                {/* <span>${remainingAmount.toLocaleString()}</span> */}
                <p className="text-sm text-red-500 font-semibold py-1 ">
                  Note : 1 USD = {exchangeRate} {localCurrency}
                </p>
              </DialogDescription>
            </DialogHeader>
            <form className="" onSubmit={handleSubmit(saveCategory)}>
              <div className="pt-2">
                <div className="space-y-3">
                  <Card>
                    <CardContent>
                      <div className="grid gap-6 mt-4">
                        <div className="grid gap-3">
                          <TextInput
                            register={register}
                            errors={errors}
                            label="Payment title"
                            name="title"
                          />
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
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
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
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
                </div>
                <div className="py-3">
                  <SubmitButton title="Create Payment" loading={loading} />
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
