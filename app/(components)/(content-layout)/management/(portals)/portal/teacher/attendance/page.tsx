import React from "react";

import { getServerSchool } from "../../../../actions/auth";
import { getClassesBySchoolId } from "../../../../actions/classes";

import StudentListingByStream from "./components/StudentListingByStream";
import { getAllSubjects } from "../../../../actions/subjects";
export default async function page() {
  const school = await getServerSchool();
  const classes = (await getClassesBySchoolId(school?.id ?? "")) || [];
  const subjects = (await getAllSubjects(school?.id ?? "")) || [];

  return <StudentListingByStream subjects={subjects} classes={classes} />;
}
