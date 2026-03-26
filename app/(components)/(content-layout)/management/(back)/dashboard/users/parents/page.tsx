import React from "react";
import { columns } from "./columns";
import DataTable from "../../../../components/DataTableComponents/DataTable";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getAllParents } from "../../../../actions/parents";
import { getServerSchool, SchoolUser } from "../../../../actions/auth";
import { validateRequest } from "@/app/auth";
import ResponsiveTable from "../../admin/contacts/ResponsiveTable";

export default async function Page() {
  // const school = await getServerSchool();


 const { user } = await validateRequest();

  if (!user) return null;

  const school = await SchoolUser(user.id);

  const parents = await getAllParents(school?.id ?? "");

  console.log("parents array:", parents);

  return (
    <div>
      <TableHeader
        title="Parents"
        linkTitle="Add Parent"
        href="/management/dashboard/users/parents/new"
        data={parents}
        model="parent"
      />

      <div className="py-2">
        {/* <DataTable columns={columns} data={parents} /> */}
         <ResponsiveTable columns={columns} data={parents} /> 
      </div>
    </div>
  );
}