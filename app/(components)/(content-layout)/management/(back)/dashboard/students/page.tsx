import React from "react";

import { getServerSchool, SchoolUser } from "../../../actions/auth";
import { getAllClasses } from "../../../actions/classes";
import StudentListingByClass from "../../../components/dashboard/StudentListingByClass";
import { validateRequest } from "@/app/auth";
export default async function page() {

  const { user } = await validateRequest();

  if (!user) return null;

  const school = await SchoolUser(user.id);


  const classes = (await getAllClasses(school?.id ?? "")) || [];

  return <StudentListingByClass schoolId={school?.id} classes={classes} />;
}
