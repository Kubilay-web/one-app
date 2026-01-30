"use client";

import { z } from "zod";
import { Loader2 } from "lucide-react";

import { CategoryForm } from "../../../features/categories/components/category-form";
import { useGetCategory } from "../../../features/categories/api/use-get-category";
import { useEditCategory } from "../../../features/categories/api/use-edit-category";
import { useDeleteCategory } from "../../../features/categories/api/use-delete-category";

import { useConfirm } from "../../../hooks/use-confirm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../../components/ui/sheet";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCategorySheetProps {
  open: boolean;
  categoryId: string | null;
  onClose: () => void;
}

export const EditCategorySheet = ({ open, categoryId, onClose }: EditCategorySheetProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category. Transactions using this category will have their category removed."
  );

  const categoryQuery = useGetCategory(categoryId);
  const editMutation = useEditCategory(categoryId);
  const deleteMutation = useDeleteCategory(categoryId);

  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = categoryQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    if (!categoryId) return;
    editMutation.mutate(values, {
      onSuccess: () => onClose(),
    });
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (ok && categoryId) {
      deleteMutation.mutate(undefined, { onSuccess: () => onClose() });
    }
  };

  const defaultValues = categoryQuery.data
    ? { name: categoryQuery.data.name }
    : { name: "" };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="bg-white text-black space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category</SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-black" />
            </div>
          ) : (
            <CategoryForm
              id={categoryId ?? undefined}
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
