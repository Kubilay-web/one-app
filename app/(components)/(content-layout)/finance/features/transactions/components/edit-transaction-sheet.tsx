
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useGetTransaction } from "../../../features/transactions/api/use-get-transaction";
import { useOpenTransaction } from "../../../features/transactions/hooks/use-open-transaction";
import { useEditTransaction } from "../../../features/transactions/api/use-edit-transaction";
import { useDeleteTransaction } from "../../../features/transactions/api/use-delete-transaction";
import { TransactionForm } from "../../../features/transactions/components/transaction-form";

import { useGetCategories } from "../../../features/categories/api/use-get-categories";
import { useCreateCategory } from "../../../features/categories/api/use-create-category";

import { useGetAccounts } from "../../../features/accounts/api/use-get-accounts";
import { useCreateAccount } from "../../../features/accounts/api/use-create-account";

import { useConfirm } from "../../../hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";

// Prisma Transaction modeline uygun form şeması
const transactionSchema = z.object({
  amount: z.coerce.number().int("Amount must be an integer"),
  payee: z.string().min(1, "Payee is required"),
  notes: z.string().optional(),
  date: z.coerce.date(),
  accountId: z.string().min(1, "Account is required"),
  categoryId: z.string().optional().nullable(),
});

// Insert için schema (id hariç)
const insertTransactionSchema = transactionSchema;

// Update için schema
const updateTransactionSchema = transactionSchema.partial();

// Form için schema
const formSchema = insertTransactionSchema;

type FormValues = z.infer<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction."
  );

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Failed to update transaction:", error);
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          console.error("Failed to delete transaction:", error);
        },
      });
    }
  };

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId || "",
        amount: transactionQuery.data.amount, // Already in miliunits
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes || "",
      }
    : {
        accountId: "",
        categoryId: "",
        amount: 0,
        date: new Date(),
        payee: "",
        notes: "",
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4 bg-white text-black">
          <SheetHeader>
            <SheetTitle>{id ? "Edit Transaction" : "New Transaction"}</SheetTitle>
            <SheetDescription>
              {id ? "Edit an existing transaction" : "Create a new transaction"}
            </SheetDescription>
          </SheetHeader>

          {isLoading && id ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              onDelete={id ? onDelete : undefined}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
