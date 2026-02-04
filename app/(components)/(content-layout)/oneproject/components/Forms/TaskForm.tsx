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

import { Button } from "../ui/button";
import { Check, Edit, Pen, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { TaskProps } from "../../types/types";
import toast from "react-hot-toast";

import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";

import { TaskStatus } from "@prisma/client";
import { createTask, updateTaskById } from "../../actions/tasks";

export default function TaskForm({
  moduleId,
  initialTitle,
  initialStatus,
  isDefault = false,
  editingId,
}: {
  moduleId: string;
  initialTitle?: string;
  initialStatus: TaskStatus;
  editingId?: string;
  isDefault?: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskProps>({
    defaultValues: {
      title: initialTitle || "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function saveModule(data: TaskProps) {
    data.moduleId = moduleId;
    data.status = initialStatus;
    try {
      setLoading(true);
      if (editingId) {
        await updateTaskById(editingId, data);
        setLoading(false);
        // Toast
        toast.success("Updated Successfully!");
      } else {
        await createTask(data);
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
              <Button variant={"ghost"} className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            ) : (
              <Button variant={isDefault ? "default" : "ghost"} className="">
                <Plus className="mr-2 h-4 w-4" />
                {isDefault && <span>Add New Task</span>}
              </Button>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Task" : "Add New Task"}
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
                      name="title"
                      icon={Check}
                    />
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
