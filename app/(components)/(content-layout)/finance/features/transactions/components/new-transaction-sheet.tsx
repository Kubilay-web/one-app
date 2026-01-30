import { z } from "zod";
import { Loader2 } from "lucide-react";

import { TransactionForm } from "../../../features/transactions/components/transaction-form";
import { useCreateTransaction } from "../../../features/transactions/api/use-create-transaction";

import { useGetCategories } from "../../../features/categories/api/use-get-categories";
import { useCreateCategory } from "../../../features/categories/api/use-create-category";

import { useGetAccounts } from "../../../features/accounts/api/use-get-accounts";
import { useCreateAccount } from "../../../features/accounts/api/use-create-account";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";

const transactionSchema = z.object({
  amount: z.coerce.number().int("Amount must be an integer"),
  payee: z.string().min(1, "Payee is required"),
  notes: z.string().optional(),
  date: z.coerce.date(),
  accountId: z.string().min(1, "Account is required"),
  categoryId: z.string().optional().nullable(),
});

const insertTransactionSchema = transactionSchema;
const formSchema = insertTransactionSchema;

type FormValues = z.infer<typeof formSchema>;

type NewTransactionSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const NewTransactionSheet = ({ isOpen, onClose }: NewTransactionSheetProps) => {
  const createMutation = useCreateTransaction();

  // Kategoriler
  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  // Hesaplar
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => onClose(),
      onError: (error) => console.error("Failed to create transaction:", error),
    });
  };

  const defaultValues = {
    accountId: "",
    categoryId: "",
    amount: 0,
    date: new Date(),
    payee: "",
    notes: "",
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4 bg-white text-black">
        <SheetHeader className="text-black">
          <SheetTitle className="text-black">New Transaction</SheetTitle>
          <SheetDescription className="text-black">
            Add a new transaction to track your finances
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-black animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
            defaultValues={defaultValues}
            className="bg-white text-black" // form içi
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
