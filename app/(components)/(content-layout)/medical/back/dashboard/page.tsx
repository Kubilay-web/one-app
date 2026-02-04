

import { validateRequest } from "@/app/auth";
import Dashboard from "../../components/Dashboard/Dashboard";
import DoctorDashboard from "../../components/Dashboard/DoctorDashboard";
import PatientDashboard from "../../components/Dashboard/PatientDashboard";

import React from "react";

export default async function page() {
  const {user} = await validateRequest();
  const role = user?.medicalrole;
  if (role === "DOCTOR") {
    return (
      <>
        <DoctorDashboard user={user} />
      </>
    );
  }
  if (role === "USER") {
    return (
      <>
        <PatientDashboard user={user} />
      </>
    );
  }
  return (
    <div>
      <Dashboard />
    </div>
  );
}
