
import NotAuthorized from "../../../../components/NotAuthorized";
import NewButton from "../../../../components/Dashboard/Doctor/NewButton";
import HomeDisplayCard from "../../../../components/Dashboard/Doctor/HomeDisplayCard";
import { getPatientAppointments } from "../../../../actions/appointments";




import React from "react";
import { validateRequest } from "@/app/auth";

export default async function page() {

  const {user} = await validateRequest();
  if (user?.medicalrole !== "USER") {
    return <NotAuthorized />;
  }
  const appointments = (await getPatientAppointments(user?.id)).data || [];
  // console.log(appointments);
  return (
    <div>
      <div className="py-2  border-b border-gray-200 flex items-center justify-end px-4">
        <div className="flex items-center gap-4">
          <NewButton
            title="New Appointment"
            href="/medical/dashboard/user/appointments/new"
          />
        </div>
      </div>
      <HomeDisplayCard
        title="Appointment"
        newAppointmentLink="/medical/dashboard/user/appointments/new"
        count={appointments.length}
      />
    </div>
  );
}
