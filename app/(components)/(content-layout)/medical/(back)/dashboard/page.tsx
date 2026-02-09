

import { validateRequest } from "@/app/auth";
import Dashboard from "../../components/Dashboard/Dashboard";
import DoctorDashboard from "../../components/Dashboard/DoctorDashboard";
import PatientDashboard from "../../components/Dashboard/PatientDashboard";

import React from "react";

export default async function page() {

  const {user}= await validateRequest();
 
  if (user?.rolemedical === "DOCTOR") {
    return (
      <>
        <DoctorDashboard session={user} />
      </>
    );
  }
  if (user?.rolemedical === "USER") {
    return (
      <>
        <PatientDashboard session={user} />
      </>
    );
  }
  return (
    <div>
      <Dashboard />
    </div>
  );
}
