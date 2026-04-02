

import { validateRequest } from "@/app/auth";
import { getPatientAppointments } from "../../../../actions/appointments";
import ListPanel from "../../../../components/Dashboard/Doctor/ListPanel";
import PanelHeader from "../../../../components/Dashboard/Doctor/PanelHeader";
import NotAuthorized from "../../../../components/NotAuthorized";


import { Calendar } from "lucide-react";

import React, { ReactNode } from "react";

export default async function AppointmentLayout({
  children,
}: {
  children: ReactNode;
}) {


  const {user}=await validateRequest();



  // if (user?.rolemedical !== "USER") {
  //   return <NotAuthorized />;
  // }


  const appointments = (await getPatientAppointments(user?.id)).data || [];
  return (
    <div>
      {/* Header */}

      {/* 2 PANNELS */}
      <div className="flex w-full flex-wrap justify-around">
        {/* LIST PANNEL */}
        <div className="py-3 border-r border-gray-100">
          <PanelHeader
            title="Appointments"
            count={appointments.length ?? 0}
            icon={Calendar}
          />
          <div className="px-3">
            <ListPanel role={user.rolemedical} appointments={appointments} />
          </div>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
