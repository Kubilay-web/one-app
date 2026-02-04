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
import { MessageSquare, Pen, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { CommentProps, PaymentProps } from "../../types/types";
import { createPayment } from "../../actions/payments";
import toast from "react-hot-toast";
import { generateInvoiceNumber } from "../../lib/generateInvoiceNumber";
import TextInput from "../FormInputs/TextInput";
import FormFooter from "./FormFooter";
import SubmitButton from "../FormInputs/SubmitButton";
import { getNormalDate } from "../../lib/getNormalDate";
import { convertIsoToDateString } from "../../lib/convertISODateToNorma";
import { convertDateToIso } from "../../lib/convertDateToIso";
import dynamic from "next/dynamic";
import { Role } from "@prisma/client";
import { createComment, updateCommentById } from "../../actions/comments";

const QuillEditor = dynamic(
  () => import("../../components/FormInputs/QuilEditor"),
  {
    ssr: false,
  }
);
export default function CommentForm({
  projectId,
  userId,
  userName,
  userRole,
  initialContent,
  editingId,
}: {
  projectId: string;
  userId: string;
  initialContent?: string;
  userName: string;
  userRole: Role;
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
  } = useForm<CommentProps>();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(initialContent);
  async function saveComment(data: CommentProps) {
    if (!content) {
      toast.error("Please write something");
    }
    data.content = content ?? "";
    (data.userName = userName), (data.projectId = projectId);
    data.userRole = userRole;
    data.userId = userId;
    try {
      setLoading(true);
      if (editingId) {
        await updateCommentById(editingId, data);
        setLoading(false);
        // Toast
        toast.success("Updated Successfully!");
      } else {
        await createComment(data);
        setLoading(false);
        // Toast
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
                <Pen className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" /> Add Comment
              </Button>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Comment" : "Add New Comment"}
              </DialogTitle>
              <DialogDescription>
                Please Write your Comment here, with respect
              </DialogDescription>
            </DialogHeader>
            <form className="" onSubmit={handleSubmit(saveComment)}>
              <div className="">
                <div className="space-y-3">
                  <QuillEditor
                    label=""
                    className=""
                    value={content}
                    onChange={setContent}
                  />
                </div>
                <div className="py-3">
                  <SubmitButton
                    title={editingId ? "Update Comment" : "Add Comment"}
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
