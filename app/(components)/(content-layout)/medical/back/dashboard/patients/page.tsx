



import React from "react";
import { PatientProps } from "./layout";



import { getAppointments } from "../../../actions/appointments";
import HomeDisplayCard from "../../../components/Dashboard/Doctor/HomeDisplayCard";
import NewButton from "../../../components/Dashboard/Doctor/NewButton";
import generateSlug from "../../../utils/generateSlug";
import { validateRequest } from "@/app/auth";

export default async function page() {
  const {user} = await validateRequest();
  const slug = generateSlug(user?.username ?? "");
  const appointments = (await getAppointments()).data || [];

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
  // console.log(patients);
  //doctors/doctor-asuman-jb
  return (
    <div>
      <div className="py-2  border-b border-gray-200 flex items-center justify-end px-4">
        <div className="flex items-center gap-4">
          <NewButton title="New Patient" href={``} />
        </div>
      </div>
      <HomeDisplayCard
        title="Patient"
        newAppointmentLink={""}
        count={patients.length}
      />
    </div>
  );
}
