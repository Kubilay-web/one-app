"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { useGetCategories } from "../../features/categories/api/use-get-categories";
import { useBulkDeleteCategories } from "../../features/categories/api/use-bulk-delete-categories";

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
import { NewCategorySheet } from "../../features/categories/components/new-category-sheet";
import { EditCategorySheet } from "../../features/categories/components/edit-category-sheet"; // ✅ import eklendi
import { Actions } from "./actions";

const CategoriesPage = () => {
  const categoriesQuery = useGetCategories();
  const deleteCategories = useBulkDeleteCategories();
  const categories = categoriesQuery.data || [];

  // ✅ LOCAL STATE
  const [isNewOpen, setIsNewOpen] = useState(false);

  // ✅ Edit için local state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

  if (categoriesQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="flex h-[500px] items-center justify-center">
            <Loader2 className="size-6 text-slate-300 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* ✅ NEW CATEGORY SHEET */}
      <NewCategorySheet open={isNewOpen} onClose={() => setIsNewOpen(false)} />

      {/* ✅ EDIT CATEGORY SHEET */}
      <EditCategorySheet
        open={isEditOpen}
        categoryId={editId}
        onClose={() => {
          setIsEditOpen(false);
          setEditId(null);
        }}
      />

      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Categories page
            </CardTitle>
            <Button onClick={() => setIsNewOpen(true)} size="sm">
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              filterKey="name"
              columns={columns.map((col: any) => {
                if (col.id === "actions") {
                  return {
                    ...col,
                    cell: ({ row }: any) => (
                      <Actions
                        id={row.original.id}
                        onEdit={(id: string) => {
                          setEditId(id);
                          setIsEditOpen(true); // ✅ burası artık çalışacak
                        }}
                      />
                    ),
                  };
                }
                return col;
              })}
              data={categories}
              onDelete={(rows) => {
                const ids = rows.map((r) => r.original.id);
                deleteCategories.mutate({ ids });
              }}
              disabled={isDisabled}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CategoriesPage;
