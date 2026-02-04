
import NotAuthorized from "../../../../components/NotAuthorized";
import NewButton from "../../../../components/Dashboard/Doctor/NewButton";
import HomeDisplayCard from "../../../../components/Dashboard/Doctor/HomeDisplayCard";
import { getDoctorAppointments } from "../../../../actions/appointments";
import React from "react";
import { validateRequest } from "@/app/auth";

export default async function page() {
  const {user} = await validateRequest();
  // if (user?.medicalrole !== "DOCTOR") {
  //   return <NotAuthorized />;
  // }
  const appointments = (await getDoctorAppointments(user?.id)).data || [];
  return (
    <div>
      <div className="py-2  border-b border-gray-200 flex items-center justify-end px-4">
        <div className="flex items-center gap-4">
          <NewButton
            title="New Appointment"
            href="/medical/dashboard/doctor/appointments/new"
          />
        </div>
      </div>
      <HomeDisplayCard
        title="Appointment"
        newAppointmentLink="/medical/dashboard/doctor/appointments/new"
        count={appointments.length}
      />
    </div>
  );
}
