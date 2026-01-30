import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Select } from "../../../components/select";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { DatePicker } from "../../../components/date-picker";
import { convertAmountToMiliunits } from "../../../utils";
import { AmountInput } from "../../../components/amount-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";

// Prisma Transaction modeline uygun form şeması
// Frontend'de amount string olarak alınır (kullanıcı input'u için)
const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string().min(1, "Account is required"),
  categoryId: z.string().optional().nullable(),
  payee: z.string().min(1, "Payee is required"),
  amount: z.string().min(1, "Amount is required"),
  notes: z.string().optional().nullable(),
});

// API için şema (backend'e gönderilecek)
const apiSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  payee: z.string().min(1),
  amount: z.number().int(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type ApiFormValues = z.infer<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string; }[];
  categoryOptions: { label: string; value: string; }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    try {
      const amount = parseFloat(values.amount);
      
      if (isNaN(amount)) {
        form.setError("amount", { message: "Invalid amount" });
        return;
      }

      const amountInMiliunits = convertAmountToMiliunits(amount);

      const apiValues: ApiFormValues = {
        date: values.date,
        accountId: values.accountId,
        categoryId: values.categoryId || undefined,
        payee: values.payee,
        amount: amountInMiliunits,
        notes: values.notes || undefined,
      };

      onSubmit(apiValues);
    } catch (error) {
      console.error("Error submitting form:", error);
      form.setError("root", { message: "Failed to submit form" });
    }
  };

  const handleDelete = () => {
    onDelete?.();
  };
  
  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-4 pt-4"
      >
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category (Optional)</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select a category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  allowClear
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Add a payee"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  {...field}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="Optional notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create transaction"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Delete transaction
          </Button>
        )}
      </form>
    </Form>
  );
};