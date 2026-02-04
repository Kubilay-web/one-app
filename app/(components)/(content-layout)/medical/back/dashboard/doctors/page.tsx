




import NotAuthorized from "../../../components/NotAuthorized";
import NewButton from "../../../components/Dashboard/Doctor/NewButton";
import HomeDisplayCard from "../../../components/Dashboard/Doctor/HomeDisplayCard";



import React from "react";
import { PatientProps } from "./layout";

import { getDoctors } from "../../../actions/users";
import { validateRequest } from "@/app/auth";



export default async function page() {
  const {user} = await validateRequest();
  if (user?.medicalrole !== "ADMIN") {
    return <NotAuthorized />;
  }
  const doctors = (await getDoctors()) || [];
  // console.log(patients);
  //doctors/doctor-asuman-jb
  return (
    <div>
      <div className="py-2  border-b border-gray-200 flex items-center justify-end px-4">
        <div className="flex items-center gap-4">
          <NewButton title="New Doctor" href={`#`} />
        </div>
      </div>
      <HomeDisplayCard
        title="Doctors"
        newAppointmentLink={`#`}
        count={doctors.length}
      />
    </div>
  );
}
