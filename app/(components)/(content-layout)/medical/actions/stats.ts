"use server";

import  db  from "@/app/lib/db";
import {
  AlarmClock,
  DollarSign,
  LayoutGrid,
  LucideIcon,
  Mail,
  Users,
} from "lucide-react";
import {
  getAppointments,
  getDoctorAppointments,
  getPatientAppointments,
} from "./appointments";
import { getInboxMessages } from "./inbox";
import { getDoctors } from "./users";
import { getServices } from "./services";
import { validateRequest } from "@/app/auth";
export type DoctorAnalyticsProps = {
  title: string;
  count: number;
  icon: LucideIcon;
  unit: string;
  detailLink: string;
};
export async function getAdminAnalytics() {
  try {
    const {user} =await validateRequest();
    const appointments = (await getAppointments()).data || [];
    const doctors = (await getDoctors()) || [];
    const services = (await getServices()).data || [];
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
    const patients = Array.from(uniquePatientsMap.values());
    const messages = (await getInboxMessages(user!.id)).data || [];
    const analytics = [
      {
        title: "Doctors",
        count: doctors.length,
        icon: Users,
        unit: "",
        detailLink: "/medical/dashboard/doctors",
      },
      {
        title: "Patients",
        count: patients.length,
        icon: Users,
        unit: "",
        detailLink: "/medical/dashboard/patients",
      },
      {
        title: "Appointments",
        count: appointments.length ?? 0,
        icon: AlarmClock,
        unit: "",
        detailLink: "/medical/dashboard/appointments",
      },

      {
        title: "Services",
        count: services.length,
        icon: LayoutGrid,
        unit: "",
        detailLink: "/medical/dashboard/services",
      },
    ];
    return analytics as DoctorAnalyticsProps[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getDoctorAnalytics() {
  try {
    const {user} =await validateRequest();
    const appointments =
      (await getDoctorAppointments(user?.id ?? "")).data || [];

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
    const patients = Array.from(uniquePatientsMap.values());
    const messages = (await getInboxMessages(user!.id)).data || [];
    const analytics = [
      {
        title: "Appointments",
        count: appointments.length ?? 0,
        icon: AlarmClock,
        unit: "",
        detailLink: "/medical/dashboard/doctor/appointments",
      },
      {
        title: "Patients",
        count: patients.length,
        icon: Users,
        unit: "",
        detailLink: "/medical/dashboard/doctor/patients",
      },
      {
        title: "Inbox",
        count: messages.length,
        icon: Mail,
        unit: "",
        detailLink: "/medical/dashboard/doctor/inbox",
      },
    ];
    return analytics as DoctorAnalyticsProps[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getUserAnalytics() {
  try {
    const {user} =await validateRequest();
    const appointments =
      (await getPatientAppointments(user?.id ?? "")).data || [];

    const uniquePatientsMap = new Map();

    appointments.forEach((app) => {
      if (!uniquePatientsMap.has(app.doctorId)) {
        uniquePatientsMap.set(app.doctorId, {
          doctorId: app.doctorId,
          name: `${app.firstName} ${app.lastName}`,
        });
      }
    });
    const doctors = Array.from(uniquePatientsMap.values());
    const messages = (await getInboxMessages(user!.id)).data || [];
    const analytics = [
      {
        title: "Appointments",
        count: appointments.length ?? 0,
        icon: AlarmClock,
        unit: "",
        detailLink: "/medical/dashboard/user/appointments",
      },
      {
        title: "Doctors",
        count: doctors.length,
        icon: Users,
        unit: "",
        detailLink: "/medical/dashboard/user/doctors",
      },
      {
        title: "Inbox",
        count: messages.length,
        icon: Mail,
        unit: "",
        detailLink: "/medical/dashboard/user/inbox",
      },
    ];
    return analytics as DoctorAnalyticsProps[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getStats() {
  try {
    const serviceCount = await db.service.count();
    const doctorCount = await db.doctorProfile.count();
    // const appointmentCount = await db.app.count();
    const stats = {
      doctors: doctorCount.toString().padStart(2, "0"),
      patients: "00",
      appointments: "00",
      services: serviceCount.toString().padStart(2, "0"),
    };
    return stats;
  } catch (error) {
    console.log(error);
    return {
      doctors: null,
      patients: null,
      appointments: null,
      services: null,
    };
  }
}
