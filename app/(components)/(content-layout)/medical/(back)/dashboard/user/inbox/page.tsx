



import { validateRequest } from "@/app/auth";
import { getInboxMessages } from "../../../../actions/inbox";
import HomeDisplayCard from "../../../../components/Dashboard/Doctor/HomeDisplayCard";
import NewButton from "../../../../components/Dashboard/Doctor/NewButton";
import NotAuthorized from "../../../../components/NotAuthorized";


import React from "react";

export default async function page() {

  const {user}=await validateRequest();

  if (user?.rolemedical !== "USER") {
    return <NotAuthorized />;
  }
  const messages = (await getInboxMessages(user?.id)).data || [];
  return (
    <div>
      <div className="py-2  border-b border-gray-200 flex items-center justify-end px-4">
        <div className="flex items-center gap-4">
          <NewButton title="New Message" href="/medical/dashboard/user/inbox/new" />
        </div>
      </div>
      <HomeDisplayCard
        title="Inbox Message"
        newAppointmentLink="/medical/dashboard/user/inbox/new"
        count={messages.length}
      />
    </div>
  );
}
