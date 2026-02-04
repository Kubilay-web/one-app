"use client";
import { useForm } from "react-hook-form";
import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { useState } from "react";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import Link from "next/link";
import { File, Loader2, Paperclip, Upload, X, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

import { FaFilePdf, FaImage } from "react-icons/fa";
import MultipleFileUpload, {
  FileProps,
} from "../FormInputs/MultipleFileUploader";
import { createFile, createMultipleFiles } from "../../actions/fileManager";
import { FileProps as CreateFileProps } from "../../types/types";

export default function FileUploadForm({ folderId }: { folderId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileProps[]>([]);
  function handleImageRemove(fileIndex: any) {
    const updatedFiles = files.filter((file, index) => index !== fileIndex);
    setFiles(updatedFiles);
  }
  const router = useRouter();
  async function onSubmit() {
    const data: CreateFileProps[] = files.map((file) => {
      return {
        name: file.title,
        type: file.type,
        url: file.url,
        size: file.size,
        folderId,
      };
    });
    try {
      setIsLoading(true);
      const res = await createMultipleFiles(data);
      console.log(res);
      toast.success("Files uploaded Successfully!");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2" /> Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload your Files</DialogTitle>
        </DialogHeader>
        <MultipleFileUpload
          label="Add Files"
          files={files}
          setFiles={setFiles}
          endpoint="fileUploads"
        />
        {isLoading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading Please wait...
          </Button>
        ) : (
          <Button onClick={onSubmit}>Save Files</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
