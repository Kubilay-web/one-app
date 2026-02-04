import { validateRequest } from "@/app/auth";
import CategoryForm from "../../../components/Forms/CategoryForm";
import ClientForm from "../../../components/Forms/ClientForm";


import React from "react";

export default async function page() {
  const {user} = await validateRequest();
  const userId = user?.id;
  return (
    <div className="p-8">
      <ClientForm userId={userId} />
    </div>
  );
}
