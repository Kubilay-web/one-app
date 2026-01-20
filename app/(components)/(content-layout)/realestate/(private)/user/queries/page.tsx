import PageTitle from "../../../components/page-title";
import db from "@/app/lib/db";
import React from "react";
import UserQueriesTable from "./_components/user-queries-table";
import { validateRequest } from "@/app/auth";

async function QueriesPage() {
  const {user} = await validateRequest();
  const queries = await db.query.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      property: true,
    },
  });
  return (
    <div>
      <PageTitle title="Queries" />
      <UserQueriesTable queries={queries} />
    </div>
  );
}

export default QueriesPage;
