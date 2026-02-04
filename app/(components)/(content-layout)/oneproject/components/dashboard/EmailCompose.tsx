"use client";
import { useForm } from "react-hook-form";
import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { useState } from "react";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import Link from "next/link";
import { File, Paperclip, X, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

// import { sendEmail } from "@/actions/mails";
import { FaFilePdf, FaImage } from "react-icons/fa";
import MultipleFileUpload, {
  FileProps,
  getFileIcon,
} from "../FormInputs/MultipleFileUploader";
import FormSelectInput from "../FormInputs/FormSelectInput";
import { Subscriber, User } from "@prisma/client";
import {
  GeneralMailProps,
  sendSingleEmail,
  sendToClients,
  sendToMailList,
} from "../../actions/emails";

const QuillEditor = dynamic(
  () => import("../../components/FormInputs/QuilEditor"),
  {
    ssr: false,
  }
);
export type MailProps = {
  to: string;
  subject: string;
  html: string;
  attachments: FileProps[];
};

export default function ComposeMailForm({
  clients,
  subscribers,
}: {
  clients: User[];
  subscribers: Subscriber[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const mailingSubs = subscribers.map((item) => {
    return {
      label: item.email,
      value: item.email,
    };
  });
  const mailingClients = clients.map((item) => {
    return {
      label: item.email,
      value: item.email,
    };
  });
  const allSubs = [
    {
      label: "All Subscribers",
      value: "all-subs",
    },
  ];
  const allClients = [
    {
      label: "All Clients",
      value: "all-clients",
    },
  ];
  const allEmails = [
    ...allSubs,
    ...allClients,
    ...mailingSubs,
    ...mailingClients,
  ];
  const [content, setContent] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<any>(allEmails[0]);
  const [bodyErr, setBodyErr] = useState("");
  const [files, setFiles] = useState<FileProps[]>([]);
  function handleImageRemove(fileIndex: any) {
    const updatedFiles = files.filter((file, index) => index !== fileIndex);
    setFiles(updatedFiles);
  }
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MailProps>();
  const router = useRouter();
  const type =
    selectedRecipient.value === "all-subs"
      ? "subs"
      : selectedRecipient.value === "all-clients"
      ? "clients"
      : "single";
  async function onSubmit(data: MailProps) {
    const actualRecipient = [
      ...subscribers.map((sub) => {
        return { name: sub.email.split("@")[0], email: sub.email };
      }),
      ...clients.map((item) => {
        return {
          name: item.name,
          email: item.email,
        };
      }),
    ].find((item) => item.email === selectedRecipient.value);
    setBodyErr("");
    if (!content || content === "<p><br></p>") {
      setBodyErr("Please Write something in the body");
      return;
    }
    data.html = content;
    data.attachments = files;
    console.log(data);
    let mailData: GeneralMailProps = {
      subject: data.subject,
      body: content,
      email: selectedRecipient.value,
      recipientName: actualRecipient?.name ?? "",
      files,
    };
    if (type === "subs") {
      mailData = {
        subject: data.subject,
        body: content,
        email: mailingSubs.map((item) => item.value),
        recipientName: actualRecipient?.name ?? "",
      };
    }
    if (type === "clients") {
      mailData = {
        subject: data.subject,
        body: content,
        email: mailingClients.map((item) => item.value),
        recipientName: actualRecipient?.name ?? "",
      };
    }
    try {
      setIsLoading(true);
      if (type === "single") {
        const res = await sendSingleEmail(mailData);
        if (res?.status === 200) {
          setIsLoading(false);
          toast.success("Email Sent Successfully");
          reset();
          setContent("");
          setFiles([]);
        }
      } else if (type === "subs") {
        const res = await sendToMailList(mailData);
        if (res?.status === 200) {
          setIsLoading(false);
          toast.success("Email Sent Successfully");
          reset();
          setContent("");
          setFiles([]);
        }
      } else if (type === "clients") {
        const res = await sendToClients(mailData);
        if (res?.status === 200) {
          setIsLoading(false);
          toast.success("Email Sent Successfully");
          reset();
          setContent("");
          setFiles([]);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  return (
    <div className="w-full max-w-2xl shadow-sm rounded-md m-3 border border-gray-200 mx-auto">
      <div className="text-center border-b border-gray-200 py-4 dark:border-slate-600">
        <div className="flex items-center justify-between px-6">
          <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight  ">
            New Message
          </h1>
          <Button type="button" asChild variant={"outline"}>
            <Link href="/dashboard">
              <X className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
      <form className=" py-4 px-4  mx-auto " onSubmit={handleSubmit(onSubmit)}>
        <div className="pt-2 space-y-2">
          <FormSelectInput
            label="Recipients"
            options={allEmails}
            option={selectedRecipient}
            setOption={setSelectedRecipient}
            toolTipText="Add New Client"
            href="/dashboard/clients/new"
          />
          <TextInput
            register={register}
            errors={errors}
            label="Subject"
            name="subject"
            placeholder="New Course Launch"
          />
          <QuillEditor
            className="w-full"
            label="Compose Mail"
            value={content}
            onChange={setContent}
          />
          {files.length > 0 && <h2 className="pb-2 ">Attachments</h2>}
          {files && files.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
              {files.map((file, i) => {
                const extension = file.title.split(".")[1];
                return (
                  <div key={i} className="relative mb-6">
                    <button
                      type="button"
                      onClick={() => handleImageRemove(i)}
                      className="absolute -top-4 -right-2 bg-slate-100 text-red-600 rounded-full "
                    >
                      <XCircle className="" />
                    </button>
                    <div className="py-2 rounded-md px-6 bg-white dark:bg-slate-800 text-slate-800 flex items-center dark:text-slate-200 border border-slate-200">
                      {getFileIcon(extension)}

                      <div className="flex flex-col">
                        <span className="line-clamp-1">{file.title}</span>
                        {file.size > 0 && (
                          <span className="text-xs">
                            {(file.size / 1000).toFixed(2)}kb
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-between gap-4 items-center">
          {type == "single" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant={"outline"}>
                  <Paperclip className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload your Files</DialogTitle>
                </DialogHeader>
                <MultipleFileUpload
                  label="Add attachments"
                  files={files}
                  setFiles={setFiles}
                  endpoint="mailAttachments"
                />
              </DialogContent>
            </Dialog>
          )}

          <SubmitButton
            title={"Send Mail"}
            loading={isLoading}
            loadingTitle={"Saving please wait..."}
          />
        </div>
      </form>
    </div>
  );
}
