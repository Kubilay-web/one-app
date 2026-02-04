import { validateRequest } from "@/app/auth";
import { getUserClients } from "../../actions/clients";
import { getUserSubscribers } from "../../actions/subscribe";
import EmailCompose from "../../components/dashboard/EmailCompose";

import React from "react";


export default async function page() {
  const {user} = await validateRequest();
  // clients and Subs
  const clients = (await getUserClients(user?.id ?? "")) || [];
  const subscribers = (await getUserSubscribers(user?.id ?? "")) || [];
  return (
    <div>
      <EmailCompose clients={clients} subscribers={subscribers} />
    </div>
  );
}
