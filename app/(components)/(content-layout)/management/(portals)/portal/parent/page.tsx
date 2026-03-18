import { validateRequest } from "@/app/auth";
import { getServerUser } from "../../../actions/auth";
import { getStudentsByParentId } from "../../../actions/parents";
import { getProfileId } from "../../../actions/users";
import { StudentList } from "../../../components/portal/parents/StudentList";
import React from "react";

export default async function page() {

  
  const {user} = await validateRequest();

  
  // if (!user) {
  //   return;
  // }


  // get parent profile
  
  const profileId = await getProfileId(user?.id, user?.roleschool);
  const students = (await getStudentsByParentId(profileId ?? "")) || [];

  
  return (
    <div className="p-8">
      {students.length > 0 ? (
        <StudentList students={students} />
      ) : (
        <div className="">
          <h2>You dont have any Children-{user?.id}</h2>
        </div>
      )}
    </div>
  );
}
