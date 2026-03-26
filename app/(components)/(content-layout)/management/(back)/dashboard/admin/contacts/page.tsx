// import React from "react";
// import { columns } from "./columns";
// import DataTable from "../../../../components/DataTableComponents/DataTable";

// import { getAllContacts } from "../../../../actions/admin";
// import TableHeader from "../../../../components/dashboard/Tables/TableHeader";

// export default async function page() {
//   const contacts = (await getAllContacts()) || [];


//   return (
//     <div className="p-8">
//       <TableHeader
//         title="Contacts"
//         linkTitle="Add Contact"
//         href="/management/contact-us"
//         data={contacts}
//         model="contact"
//       />
//       <div className="py-8">
//         <DataTable data={contacts} columns={columns} />
//       </div>
//     </div>
//   );
// }








"use client";

import React, { useEffect, useState } from "react";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getAllContacts } from "../../../../actions/admin";
import ResponsiveDataTable from "../../../../components/DataTableComponents/DataTable";
import { columns } from "./columns";
import ResponsiveTable from "./ResponsiveTable";

export default function Page() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const data = (await getAllContacts()) || [];
        setContacts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  return (
    <div>
      <TableHeader
        title="Contacts"
        linkTitle="Add Contact"
        href="/management/contact-us"
        data={contacts}
        model="contact"
      />

      {loading ? (
        <div className="text-center py-10">Loading contacts...</div>
      ) : (
        <ResponsiveTable data={contacts} columns={columns} />
      )}
    </div>
  );
}