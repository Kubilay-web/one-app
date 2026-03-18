import { validateRequest } from "@/app/auth";
import { getServerSchool, getServerUser, SchoolUser } from "../../../../actions/auth";
import { getStudentsByParentId } from "../../../../actions/parents";
import { getAllPeriods } from "../../../../actions/periods";
import { getProfileId } from "../../../../actions/users";
import PaymentListing from "../../../../components/dashboard/forms/finance/payment-listing";

import React from "react";

export default async function page() {
 


      const { user } = await validateRequest();
    
      if (!user) return null;
    
      const school = await SchoolUser(user.id);




  
  // if (!user) {
  //   return;
  // }





  // get parent profile
  const profileId = await getProfileId(user?.id, user?.roleschool);

  const students = (await getStudentsByParentId(profileId ?? "")) || [];
  
  const terms = (await getAllPeriods(school?.id ?? "")) || [];

  
  const currentYear = new Date().getFullYear();
  const parentData = {
    parentProfileId: profileId ?? "",
    parentUserId: user?.id ?? "",
    parentName: user?.username ?? "",
  };
  return (
    <div className="">
      <PaymentListing
        terms={terms.filter((item) => item.year === currentYear)}
        students={students}
        parentData={parentData}
      />
    </div>
  );
}
