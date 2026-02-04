
import {

  Reply,

} from "lucide-react";



import { Avatar, AvatarFallback, AvatarImage } from "../../../../../../components/ui/avatar";
import { Button } from "../../../../../../components/ui/button";


import { Separator } from "../../../../../../components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../../../components/ui/tooltip";


import { getInboxMessageById } from "@/app/(components)/(content-layout)/medical/actions/inbox";
import { formatDate } from "date-fns";


import MessageBody from "@/app/(components)/(content-layout)/medical/components/MessageBody";

import Link from "next/link";


import DeleteMessageBtn from "@/app/(components)/(content-layout)/medical/components/DeleteMessageBtn";
import { validateRequest } from "@/app/auth";

export default async function MailDisplay({
  params: { id },
}: {
  params: { id: string };
}) {
  const mail = await getInboxMessageById(id);
  const today = new Date();

  const {user} = await validateRequest();
  const userEmail = user?.email;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        {userEmail === mail?.senderEmail && (
          <div className="flex items-center gap-2">
            <DeleteMessageBtn role={user?.medicalrole} id={mail?.id} />
            <Separator orientation="vertical" className="mx-1 h-6" />
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" asChild size="icon" disabled={!mail}>
                  <Link
                    href={
                      user?.medicalrole === "DOCTOR"
                        ? "/medical/dashboard/doctor/inbox/new"
                        : "/medical/dashboard/user/inbox/new"
                    }
                  >
                    <Reply className="h-4 w-4" />
                    <span className="sr-only">Reply</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.senderName} />
                <AvatarFallback>
                  {mail.senderName
                    .split(" ")
                    .map((chunk: any) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.senderName}</div>
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span>{" "}
                  {mail.senderEmail}
                </div>
              </div>
            </div>
            {mail.createdAt && (
              <div className="ml-auto text-xs text-muted-foreground">
                {formatDate(new Date(mail.createdAt), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {/* {mail.text} */}
            <MessageBody html={mail.body} />
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}
