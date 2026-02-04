"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../ui/button";
import { Check, MessageSquare, Pen, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { CommentProps, ModuleProps, PaymentProps } from "../../types/types";
import { createPayment } from "../../actions/payments";
import toast from "react-hot-toast";

import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";

import { createModule, updateModuleById } from "../../actions/modules";

export default function ModuleForm({
  projectId,
  userId,
  userName,
  initialContent,
  editingId,
}: {
  projectId: string;
  userId: string;
  initialContent?: string;
  userName: string;
  editingId?: string;
}) {
  // invoiceNumber: string;
  // projectId: string;
  // userId: string;
  // clientId: string;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModuleProps>({
    defaultValues: {
      name: initialContent || "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function saveModule(data: ModuleProps) {
    (data.userName = userName), (data.projectId = projectId);
    data.userId = userId;
    try {
      setLoading(true);
      if (editingId) {
        await updateModuleById(editingId, data);
        setLoading(false);
        // Toast
        toast.success("Updated Successfully!");
      } else {
        await createModule(data);
        setLoading(false);
        toast.success("Successfully Created!");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <div>
      <div className="py-1">
        <Dialog>
          <DialogTrigger asChild>
            {editingId ? (
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Pen className="w-4 h-4 ml-2 text-green-500" />
              </button>
            ) : (
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Module
              </Button>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Module" : "Add New Module"}
              </DialogTitle>
              {/* <DialogDescription>
                Please Write your Comment here, with respect
              </DialogDescription> */}
            </DialogHeader>
            <form className="" onSubmit={handleSubmit(saveModule)}>
              <div className="">
                <div className="space-y-3">
                  <div className="grid gap-3">
                    <TextInput
                      register={register}
                      errors={errors}
                      label=""
                      name="name"
                      icon={Check}
                    />
                    {/* <IconInput
                      onIconSelect={setSelectedIcon}
                      selectedIcon={selectedIcon}
                    /> */}
                  </div>
                </div>
                <div className="py-3">
                  <SubmitButton
                    title={editingId ? "Update" : "Add"}
                    loading={loading}
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
