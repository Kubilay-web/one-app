import ProjectForm from "../../../../components/Forms/ProjectForm";
import CategoryForm from "../../../../components/Forms/CategoryForm";
import { getProjectById } from "../../../../actions/projects";
import { getUserClients } from "../../../../actions/clients";
import { getCategoryById } from "../../../../actions/categories";


import React from "react";
import { validateRequest } from "@/app/auth";

export default async function page({
  params: { id },
}: {
  params: { id: string };
}) {
  const project = await getProjectById(id);
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
      <ProjectForm
        clients={userClients}
        userId={userId}
        initialData={project}
        editingId={id}
      />
    </div>
  );
}
