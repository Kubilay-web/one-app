"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Plus, Edit2 } from "lucide-react";

import { useGetTransactions } from "../../features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "../../features/transactions/api/use-bulk-delete-transactions";
import { useSelectAccount } from "../../features/accounts/hooks/use-select-account";

import { Button } from "../../components/ui/button";
import { DataTable } from "../../components/data-table";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { columns } from "./columns";
import { ImportCard } from "./import-card";
import { UploadButton } from "./upload-button";

import { Transaction } from "@prisma/client";

// Sheets
import { NewTransactionSheet } from "../../features/transactions/components/new-transaction-sheet";
import { EditTransactionSheet } from "../../features/transactions/components/edit-transaction-sheet";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

type ImportTransaction = Omit<Transaction, "id"> & { id?: string };

const INITIAL_IMPORT_RESULTS = {
  data: [] as ImportTransaction[],
  errors: [] as any[],
  meta: {} as any,
};

import { z } from "zod";

const transactionImportSchema = z.object({
  date: z.coerce.date(),
  amount: z.number().int(),
  payee: z.string().min(1, "Payee is required"),
  notes: z.string().optional(),
  accountId: z.string().optional(),
  categoryId: z.string().optional().nullable(),
});

type TransactionImport = z.infer<typeof transactionImportSchema>;

export const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  // Local state for sheets
  const [isNewSheetOpen, setIsNewSheetOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);

  const transactionsQuery = useGetTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactions = transactionsQuery.data || [];

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  // Import handlers
  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const onSubmitImport = async (values: TransactionImport[]) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      date: value.date,
      amount: value.amount,
      payee: value.payee,
      notes: value.notes || undefined,
      accountId: accountId as string,
      categoryId: value.categoryId || undefined,
    }));

    // Mock: Replace with actual bulk create mutation
    toast.success("Transactions imported successfully!");
    onCancelImport();
  };

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border border-gray-200 bg-white text-black drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48 bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-gray-400 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
          className="bg-white text-black"
        />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border border-gray-200 bg-white text-black drop-shadow-sm">
        <CardHeader className="flex flex-col lg:flex-row gap-y-2 lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1 text-black">
            Transaction History
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button
              size="sm"
              className="w-full lg:w-auto bg-white text-black border border-gray-300 hover:bg-gray-100"
              onClick={() => setIsNewSheetOpen(true)}
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="payee"
            columns={columns.map((col) => ({
              ...col,
              Cell: (props: any) => {
                if (col.id === "actions") {
                  return (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setEditingTransactionId(props.row.original.id)
                        }
                      >
                        <Edit2 className="size-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          deleteTransactions.mutate({
                            ids: [props.row.original.id],
                          })
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  );
                }
                return col.Cell ? col.Cell(props) : props.value;
              },
            }))}
            data={transactions}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
            className="bg-white text-black"
          />
        </CardContent>
      </Card>

      {/* New Transaction Sheet */}
      <NewTransactionSheet
        isOpen={isNewSheetOpen}
        onClose={() => setIsNewSheetOpen(false)}
      />

      {/* Edit Transaction Sheet */}
      <EditTransactionSheet
        id={editingTransactionId || undefined}
        isOpen={!!editingTransactionId}
        onClose={() => setEditingTransactionId(null)}
      />
    </div>
  );
};

export default TransactionsPage;
