




import NotAuthorized from "../../../../components/NotAuthorized";
import PanelHeader from "../../../../components/Dashboard/Doctor/PanelHeader";
import ListPanel from "../../../../components/Dashboard/Doctor/ListPanel";
import { getDoctorAppointments } from "../../../../actions/appointments";
import { Calendar } from "lucide-react";
import React, { ReactNode } from "react";
import { validateRequest } from "@/app/auth";

export default async function AppointmentLayout({
  children,
}: {
  children: ReactNode;
}) {

  const {user} = await validateRequest();
  // if (user?.medicalrole !== "DOCTOR") {
  //   return <NotAuthorized />;
  // }
  const appointments = (await getDoctorAppointments(user?.id)).data || [];
  return (
    <div>
      {/* Header */}

      {/* 2 PANNELS */}
      <div className="grid grid-cols-12">
        {/* LIST PANNEL */}
        <div className="col-span-4  py-3 border-r border-gray-100">
          <PanelHeader
            title="Appointments"
            count={appointments.length ?? 0}
            icon={Calendar}
          />
          <div className="px-3">
            <ListPanel appointments={appointments} role={user?.medicalrole} />
          </div>
        </div>

        <div className="col-span-8">{children}</div>
      </div>
    </div>
  );
}
