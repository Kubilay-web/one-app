"use client";

import { z } from "zod";

import { CategoryForm } from "../../../features/categories/components/category-form";
import { useCreateCategory } from "../../../features/categories/api/use-create-category";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface NewCategorySheetProps {
  open: boolean;
  onClose: () => void;
}

export const NewCategorySheet = ({
  open,
  onClose,
}: NewCategorySheetProps) => {
  const mutation = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Failed to create category:", error);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="space-y-4 bg-white text-black">
        <SheetHeader>
          <SheetTitle className="text-black">
            New Category
          </SheetTitle>
          <SheetDescription className="text-black/70">
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>

        <CategoryForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
};
