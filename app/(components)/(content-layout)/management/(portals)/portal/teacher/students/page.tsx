import React from "react";

import { getServerSchool, getServerUser } from "../../../../actions/auth";
import { getClassesBySchoolId } from "../../../../actions/classes";
import StudentListingByClass from "../../../../components/dashboard/StudentListingByClass";
export default async function page() {
  const school = await getServerSchool();
  const classes = (await getClassesBySchoolId(school?.id ?? "")) || [];
  const user = await getServerUser();
  const role = user?.role ?? "STUDENT";
  return <StudentListingByClass role={role} classes={classes} />;
}
