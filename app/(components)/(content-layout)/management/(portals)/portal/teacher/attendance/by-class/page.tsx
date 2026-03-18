import React from "react";

import { getServerSchool } from "../../../../../actions/auth";
import { getClassesBySchoolId } from "../../../../../actions/classes";

import { getAllSubjects } from "../../../../../actions/subjects";
import ClassAttendanceListing from "./components/ClassAttendanceListing";
export default async function page() {
  const school = await getServerSchool();
  const classes = (await getClassesBySchoolId(school?.id ?? "")) || [];
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Daily Attendance Overview</h1>
      <p className="text-muted-foreground mb-6">
        View attendance across all subjects for a specific day and class.
      </p>
      <ClassAttendanceListing classes={classes} />
    </div>
  );
}
