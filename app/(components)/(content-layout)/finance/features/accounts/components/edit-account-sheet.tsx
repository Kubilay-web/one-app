"use client";

import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useGetAccount } from "../../../features/accounts/api/use-get-account";
import { AccountForm } from "../../../features/accounts/components/account-form";
import { useEditAccount } from "../../../features/accounts/api/use-edit-account";
import { useDeleteAccount } from "../../../features/accounts/api/use-delete-account";

import { useConfirm } from "../../../hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";

const formSchema = z.object({
  name: z.string().min(1, "Account name is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditAccountSheetProps {
  open: boolean;
  onClose: () => void;
  accountId: string | null;
}

export const EditAccountSheet = ({
  open,
  onClose,
  accountId,
}: EditAccountSheetProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account and all associated transactions."
  );

  const accountQuery = useGetAccount(accountId);
  const editMutation = useEditAccount(accountId);
  const deleteMutation = useDeleteAccount(accountId);

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending;

  const onSubmit = (values: FormValues) => {
    if (!accountId) return;

    editMutation.mutate(values, {
      onSuccess: () => onClose(),
    });
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok || !accountId) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => onClose(),
    });
  };

  const defaultValues = {
    name: accountQuery.data?.name ?? "",
  };

  return (
    <>
      <ConfirmDialog />

      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="space-y-4 bg-white text-black">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription className="text-black/70">
              Edit an existing account
            </SheetDescription>
          </SheetHeader>

          {accountQuery.isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={accountId ?? undefined}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
