import React from "react";

import { getServerSchool, getServerUser } from "../../../../actions/auth";
import { getClassesBySchoolId } from "../../../../actions/classes";
import StudentListingByClass from "../../../../components/dashboard/StudentListingByClass";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
export default async function page() {
  const school = await getServerSchool();
  const classes = (await getClassesBySchoolId(school?.id ?? "")) || [];
  const user = await getServerUser();
  const role = user?.role ?? "STUDENT";
  return (
    <>
      <div className="flex items-center justify-between pt-8 px-8 ">
        <h2 className="text-2xl font-bold">Students</h2>
        <Button asChild>
          <Link href={"/management/portal/secretary/students/new "}>
            <Plus className="h-5 w-5" />
            <span className="">Add new Student</span>
          </Link>
        </Button>
      </div>
      <StudentListingByClass role={role} classes={classes} />
    </>
  );
}
