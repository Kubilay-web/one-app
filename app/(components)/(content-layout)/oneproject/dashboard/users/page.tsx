import { columns } from "./columns";
import DataTable from "../../components/DataTableComponents/DataTable";



import TableHeader from "../../components/dashboard/Tables/TableHeader";
import { getAllUsers } from "../../actions/users";
import { notFound, redirect } from "next/navigation";
import { validateRequest } from "@/app/auth";

export default async function ReviewPage() {
  const {user} = await validateRequest();
  const role = user?.roleproject;
  if (role !== "ADMIN") {
    return notFound();
  }
  const users = (await getAllUsers()) || [];
  const actualUsers = users;
  return (
    <div className="p-8">
      <TableHeader
        title="Users"
        linkTitle="Add User"
        href={`/oneproject/projects/${user?.id}`}
        data={actualUsers}
        model="user"
      />
      <div className="py-8">
        {actualUsers && actualUsers.length > 0 ? (
          <DataTable data={actualUsers} columns={columns} />
        ) : (
          <p>No Reviews</p>
        )}
      </div>
    </div>
  );
}
