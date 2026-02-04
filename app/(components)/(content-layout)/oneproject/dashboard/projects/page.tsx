import React from "react";
import { columns } from "./columns";
import { Category, Project } from "@prisma/client";




import DataTable from "../../components/DataTableComponents/DataTable";
import TableHeader from "../../components/dashboard/Tables/TableHeader";
import { getUserProjects } from "../../actions/projects";
import { ProjectWithPayment } from "../../types/types";
import { validateRequest } from "@/app/auth";

export default async function page() {
  const {user} = await validateRequest();
  const userId = user?.id;
  const projects: ProjectWithPayment[] = (await getUserProjects(userId)) || [];
  return (
    <div className="p-8">
      <TableHeader
        title="Projects"
        linkTitle="Add Project"
        href="/oneproject/dashboard/projects/new"
        data={projects}
        model="project"
      />
      <div className="pb-8 pt-4">
        <DataTable model="project" data={projects} columns={columns} />
      </div>
    </div>
  );
}
