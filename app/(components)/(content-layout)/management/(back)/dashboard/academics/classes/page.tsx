import { validateRequest } from "@/app/auth";
import { getServerSchool, SchoolUser } from "../../../../actions/auth";
import { getAllClasses } from "../../../../actions/classes";
import { getBriefDepartments } from "../../../../actions/communications";
import { getTeachersWithBriefInfo } from "../../../../actions/teachers";
import ClassListing from "../../../../components/dashboard/class-listing";
import React from "react";



export default async function page() {
  const { user } = await validateRequest();
  if (!user) return null;

  const school = await SchoolUser(user.id);

  const schoolId = school?.id ?? "";




  const [classes, allTeachers, departments] = await Promise.all([
    getAllClasses(schoolId),
    getTeachersWithBriefInfo(schoolId),
    getBriefDepartments(schoolId),
  ]);

  return (
    <div>
      <ClassListing
        departments={departments || []}
        teachers={allTeachers || []}
        classes={classes || []}
        schoolId={schoolId}
      />
    </div>
  );
}