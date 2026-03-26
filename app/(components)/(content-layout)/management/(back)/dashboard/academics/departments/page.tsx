

import { validateRequest } from "@/app/auth";
import { SchoolUser } from "../../../../actions/auth";
import { getAllDepartments } from "../../../../actions/departments";
import DepartmentListing from "../../../../components/dashboard/department-listing";
import React from "react";

export default async function page() {
  const { user } = await validateRequest();
  if (!user) return null;

  const schoolId = (await SchoolUser(user.id))?.id ?? "";
  const departments = (await getAllDepartments(schoolId)) || [];

  return (
    <DepartmentListing schoolId={schoolId} departments={departments} />
  );
}