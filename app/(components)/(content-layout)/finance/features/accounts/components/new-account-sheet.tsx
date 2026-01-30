"use client";

import { z } from "zod";
import { AccountForm } from "../../../features/accounts/components/account-form";
import { useCreateAccount } from "../../../features/accounts/api/use-create-account";

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

interface NewAccountSheetProps {
  open: boolean;
  onClose: () => void;
}

export const NewAccountSheet = ({
  open,
  onClose,
}: NewAccountSheetProps) => {
  const mutation = useCreateAccount();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Failed to create account:", error);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="space-y-4 bg-white text-black">
        <SheetHeader>
          <SheetTitle className="text-black">
            New Account
          </SheetTitle>
          <SheetDescription className="text-black/70">
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>

        <div className="text-black">
          <AccountForm
            onSubmit={onSubmit}
            disabled={mutation.isPending}
            defaultValues={{ name: "" }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
