



import { getPatientAppointments } from "@/app/(components)/(content-layout)/medical/actions/appointments";
import InboxForm from "@/app/(components)/(content-layout)/medical/components/Dashboard/InboxForm";
import NotAuthorized from "@/app/(components)/(content-layout)/medical/components/NotAuthorized";

import React from "react";
import { DoctorProps, PatientProps } from "../../../doctor/patients/layout";
import { validateRequest } from "@/app/auth";

export default async function page() {


  const {user}=await validateRequest();
  if (user?.rolemedical !== "USER") {
    return <NotAuthorized />;
  }
  const appointments = (await getPatientAppointments(user?.id)).data || [];

  const uniquePatientsMap = new Map();

  appointments.forEach((app) => {
    if (!uniquePatientsMap.has(app.doctorId)) {
      uniquePatientsMap.set(app.doctorId, {
        doctorId: app.doctorId,
        doctorName: app.doctorName ?? "Name Not Provided",
      });
    }
  });
  const doctors = Array.from(uniquePatientsMap.values()) as DoctorProps[];
  console.log(doctors);
  const users = doctors.map((doctor) => {
    return {
      label: doctor.doctorName,
      value: doctor.doctorId,
    };
  });
  return <InboxForm users={users} user={user} title="New Message" />;
}
