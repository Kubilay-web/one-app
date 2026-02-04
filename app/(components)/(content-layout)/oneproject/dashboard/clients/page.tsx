import React from "react";
import { columns } from "./columns";
import { User } from "@prisma/client";

import DataTable from "../../components/DataTableComponents/DataTable";
import TableHeader from "../../components/dashboard/Tables/TableHeader";
import { getUserClients } from "../../actions/clients";
import { validateRequest } from "@/app/auth";

export default async function page() {
  const {user} = await validateRequest();
  const clients: User[] = (await getUserClients(user?.id)) || [];
  return (
    <div className="p-8">
      <TableHeader
        title="Clients"
        linkTitle="Add Client"
        href="/oneproject/dashboard/clients/new"
        data={clients}
        model="client"
      />
      <div className="py-8">
        <DataTable data={clients} columns={columns} />
      </div>
    </div>
  );
}
