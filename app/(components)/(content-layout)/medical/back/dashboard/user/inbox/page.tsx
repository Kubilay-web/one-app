





import NotAuthorized from "../../../../components/NotAuthorized";
import NewButton from "../../../../components/Dashboard/Doctor/NewButton";
import HomeDisplayCard from "../../../../components/Dashboard/Doctor/HomeDisplayCard";
import { getInboxMessages } from "../../../../actions/inbox";


import React from "react";
import { validateRequest } from "@/app/auth";

export default async function page() {
  const {user} = await validateRequest();
  if (user?.medicalrole !== "USER") {
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
