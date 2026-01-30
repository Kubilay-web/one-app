"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { useGetAccounts } from "../../features/accounts/api/use-get-accounts";
import { useBulkDeleteAccounts } from "../../features/accounts/api/use-bulk-delete-accounts";

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
import { NewAccountSheet } from "../../features/accounts/components/new-account-sheet";
import { EditAccountSheet } from "../../features/accounts/components/edit-account-sheet";

const AccountsPage = () => {
  const accountsQuery = useGetAccounts();
  const deleteAccounts = useBulkDeleteAccounts();
  const accounts = accountsQuery.data || [];

  // ✅ LOCAL STATE
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const isDisabled =
    accountsQuery.isLoading ||
    deleteAccounts.isPending;

  if (accountsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* NEW */}
      <NewAccountSheet
        open={isNewOpen}
        onClose={() => setIsNewOpen(false)}
      />

      {/* EDIT */}
      <EditAccountSheet
        accountId={editId}
        open={!!editId}
        onClose={() => setEditId(null)}
      />

      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Accounts page
            </CardTitle>
            <Button onClick={() => setIsNewOpen(true)} size="sm">
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
          </CardHeader>

          <CardContent>
            <DataTable
              filterKey="name"
              columns={columns({
                onEdit: (id: string) => setEditId(id), // 👈 edit click
              })}
              data={accounts}
              onDelete={(rows) => {
                const ids = rows.map((r) => r.original.id);
                deleteAccounts.mutate({ ids });
              }}
              disabled={isDisabled}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AccountsPage;
