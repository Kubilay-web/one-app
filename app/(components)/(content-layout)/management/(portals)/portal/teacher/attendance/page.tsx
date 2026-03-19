import React from "react";

import { getServerSchool, SchoolUser } from "../../../../actions/auth";
import { getAllClasses } from "../../../../actions/classes";

import StudentListingByStream from "./components/StudentListingByStream";
import { getAllSubjects } from "../../../../actions/subjects";
import { validateRequest } from "@/app/auth";
export default async function page() {
  const { user } = await validateRequest();

  if (!user) return null;

  const school = await SchoolUser(user.id);

  const classes = (await getAllClasses(school?.id ?? "")) || [];
  const subjects = (await getAllSubjects(school?.id ?? "")) || [];

  return <StudentListingByStream subjects={subjects} classes={classes} />;
}
