"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../ui/button";
import { Pencil, FolderPlus, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { FolderProps } from "../../types/types";
import toast from "react-hot-toast";

import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { createFolder, updateFolderById } from "../../actions/fileManager";

export default function FolderForm({
  userId,
  initialContent,
  editingId,
}: {
  userId: string;
  initialContent?: string;
  editingId?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FolderProps>({
    defaultValues: {
      name: initialContent || "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function saveFolder(data: FolderProps) {
    data.userId = userId;
    try {
      setLoading(true);
      if (editingId) {
        await updateFolderById(editingId, data);
        toast.success("Updated Successfully!");
      } else {
        await createFolder(data);
        toast.success("Successfully Created!");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="py-1">
        <Dialog>
          <DialogTrigger asChild>
            {editingId ? (
              <button
                title="Edit Folder"
                className="bg-gray-400 text-black p-2 rounded hover:bg-slate-600"
              >
                 <Pencil className="w-4 h-4" /> 
              </button>
            ) : (
              <Button
                title="Create Folder"
                variant={"outline"}
                size={"icon"}
                className="bg-gray-400 text-black hover:bg-slate-600"
              >
                <FolderPlus className="w-4 h-4" />
              </Button>
            )}
          </DialogTrigger>

          <DialogContent className="bg-gray-400 text-black">
            <DialogHeader>
              <DialogTitle className="text-black">
                {editingId ? "Edit Folder" : "Add New Folder"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(saveFolder)}>
              <div className="space-y-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="Folder Name"
                  name="name"
                  // icon={Check}
                  className="text-black bg-slate-100"
                />

                <div className="pt-2">
                  <SubmitButton
                    title={editingId ? "Update" : "Add"}
                    loading={loading}
                    className="bg-gray-400 text-black hover:bg-slate-600 w-full"
                  />
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
