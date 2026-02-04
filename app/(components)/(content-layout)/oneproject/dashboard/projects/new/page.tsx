import { validateRequest } from "@/app/auth";
import { getUserClients } from "../../../actions/clients";
import { getCurrentExchangeRate } from "../../../actions/exchange";
import { getUserById } from "../../../actions/users";
import ProjectForm from "../../../components/Forms/ProjectForm";

import React from "react";

export default async function page() {
  const {user} = await validateRequest();
  const userId = user?.id ?? "";
  const clients = await getUserClients(userId);
  const userClients =
    clients?.map((user) => {
      return {
        label: user.name,
        value: user.id,
      };
    }) || [];

  return (
    <div className="p-8">
      <ProjectForm clients={userClients} userId={userId} />
    </div>
  );
}
