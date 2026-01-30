"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import { useDeleteAccount } from "../../features/accounts/api/use-delete-account";
import { useConfirm } from "../../hooks/use-confirm";

import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

type Props = {
  id: string;
  onEdit: (id: string) => void; // ✅ parent callback
};

export const Actions = ({ id, onEdit }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account."
  );

  const deleteMutation = useDeleteAccount(id);

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onEdit(id)} // ✅ LOCAL STATE
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
