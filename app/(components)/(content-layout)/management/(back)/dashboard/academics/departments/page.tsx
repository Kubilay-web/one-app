import { validateRequest } from "@/app/auth";
import { getServerSchool, SchoolUser } from "../../../../actions/auth";
import { getAllDepartments } from "../../../../actions/departments";
import DepartmentListing from "../../../../components/dashboard/department-listing";
import React from "react";

export default async function page() {
  const { user } = await validateRequest();

  if (!user) return null;

  const school = await SchoolUser(user.id);

  const departments = (await getAllDepartments(school?.id ?? "")) || [];

  
  return (
    <div>
      <DepartmentListing schoolId={school?.id} departments={departments} />
    </div>
  );
}
