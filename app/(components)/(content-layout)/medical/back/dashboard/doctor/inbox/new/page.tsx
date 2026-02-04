


import NotAuthorized from "@/app/(components)/(content-layout)/medical/components/NotAuthorized";
import InboxForm from "@/app/(components)/(content-layout)/medical/components/Dashboard/InboxForm";
import { getDoctorAppointments } from "@/app/(components)/(content-layout)/medical/actions/appointments";


import React from "react";
import { PatientProps } from "../../patients/layout";
import { validateRequest } from "@/app/auth";

export default async function page() {
  const {user} = await validateRequest();
  // if (user?.medicalrole !== "DOCTOR") {
  //   return <NotAuthorized />;
  // }
  const appointments = (await getDoctorAppointments(user?.id)).data || [];

  const uniquePatientsMap = new Map();

  appointments.forEach((app) => {
    if (!uniquePatientsMap.has(app.patientId)) {
      uniquePatientsMap.set(app.patientId, {
        patientId: app.patientId,
        name: `${app.firstName} ${app.lastName}`,
        email: app.email,
        phone: app.phone,
        location: app.location,
        gender: app.gender,
        occupation: app.occupation,
        dob: app.dob,
      });
    }
  });
  const patients = Array.from(uniquePatientsMap.values()) as PatientProps[];
  const users = patients.map((patient) => {
    return {
      label: patient.name,
      value: patient.patientId,
    };
  });
  return <InboxForm users={users}  title="New Message" />;
}
