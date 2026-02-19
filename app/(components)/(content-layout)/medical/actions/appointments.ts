"use server";





import { AppointmentUpdateProps } from "../components/Dashboard/Doctor/UpdateAppointmentForm";
import NewAppointmentEmail from "../components/Emails/new-appointment";
import  db  from "@/app/lib/db";
import { AppointmentProps } from "../types/types";





import { Appointment } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import Stripe from "stripe";


const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


export async function createAppointment(data: AppointmentProps) {
  try {
    const doctor = await db.user.findUnique({
      where: {
        id: data.doctorId,
      },
    });

    if (!doctor) {
      return {
        data: null,
        status: 404,
        error: "Doctor not found",
      };
    }

    const newAppointment = await db.appointment.create({
      data: {
        ...data,
        doctorName: doctor.username, // ✅ burada set ediyoruz
      },
    });

    const link = `${baseUrl}/medical/dashboard/doctor/appointments/view/${newAppointment.id}`;
    const message =
      "You have a new appointment scheduled. Please review and approve it by clicking the button below.";

    await resend.emails.send({
      from: "sandbox@resend.dev",
      to: doctor.email ?? "",
      subject: "New Appointment Approval Needed",
      react: NewAppointmentEmail({
        firstName: doctor.username,
        link,
        message,
      }),
    });

    revalidatePath("/medical/dashboard/doctor/appointments");

    return {
      data: newAppointment,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}



export async function updateAppointment(id: string, data: AppointmentProps) {
  try {
    const updatedAppointment = await db.appointment.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/medical/dashboard/doctor/appointments");
    console.log(updatedAppointment);
    return {
      data: updatedAppointment,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}
export async function updateAppointmentById(
  id: string,
  data: AppointmentUpdateProps
) {
  try {
    const updatedAppointment = await db.appointment.update({
      where: {
        id,
      },
      data,
    });
    const patientId = updatedAppointment.patientId;
    const patient = await db.user.findUnique({
      where: {
        id: patientId,
      },
    });

    
    const firstName = patient?.username;
    const doctorMail = patient?.email;
    const link = `${baseUrl}/medical/dashboard/user/appointments/view/${updatedAppointment.id}`;
    const message =
      "Your appointment has been approved. You can View the Details here";
    const sendMail = await resend.emails.send({
      from: "sandbox@resend.dev",
      to: doctorMail ?? "",
      subject: "Appointment Approved",
      react: NewAppointmentEmail({ firstName, link, message }),
    });
    revalidatePath("/dashboard/doctor/appointments");
    revalidatePath("/dashboard/user/appointments");
    console.log(updatedAppointment);
    return {
      data: updatedAppointment,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}

export async function getAppointments() {
  try {
    const appointments = await db.appointment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      data: appointments,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}
export async function getPatientAppointments(patientId: string) {
  try {
    const appointments = await db.appointment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        patientId,
      },
    });
    return {
      data: appointments,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}
export async function getAppointmentByPatientId(patientId: string | undefined) {
  if (patientId) {
    try {
      const appointment = await db.appointment.findFirst({
        where: {
          patientId,
        },
      });
      if (!appointment) {
        return null;
      }
      return appointment as Appointment;
    } catch (error) {
      console.log(error);
      return {
        data: null,
        status: 500,
        error,
      };
    }
  }
}
export async function getDoctorAppointments(doctorId: string) {
  try {
    const appointments = await db.appointment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        doctorId,
      },
    });
    return {
      data: appointments,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}
export async function getAppointmentById(id: string) {
  try {
    if (id) {
      const appointment = await db.appointment.findUnique({
        where: {
          id,
        },
      });
      return appointment;
    }
  } catch (error) {
    console.log(error);
  }
}
export async function deleteAppointment(id: string) {
  try {
    await db.appointment.delete({
      where: {
        id,
      },
    });
    revalidatePath("/medical/dashboard/doctor/appointments");
    return {
      ok: true,
      status: 200,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error,
    };
  }
}









// Ödeme durumunu güncelle
export async function updateAppointmentPaymentStatus(
  appointmentId: string, 
  paymentIntentId: string, 
  paymentStatus: string
) {
  try {
    const updatedAppointment = await db.appointment.update({
      where: { id: appointmentId },
      data: {
        paymentIntentId: paymentIntentId,
        paymentStatus: paymentStatus,
        status: paymentStatus === "paid" ? "approved" : "pending",
        paymentDate: paymentStatus === "paid" ? new Date() : null,
      },
    });

    // Ödeme başarılıysa email gönder
    if (paymentStatus === "paid") {
      // Doktora email
      const doctor = await db.user.findUnique({
        where: { id: updatedAppointment.doctorId },
      });

      if (doctor) {
        const link = `${baseUrl}/medical/dashboard/doctor/appointments/view/${updatedAppointment.id}`;
        await resend.emails.send({
          from: "sandbox@resend.dev",
          to: doctor.email ?? "",
          subject: "New Paid Appointment",
          react: NewAppointmentEmail({
            firstName: doctor.username,
            link,
            message: "You have a new paid appointment. The payment has been confirmed.",
          }),
        });
      }

      // Hastaya email
      const patient = await db.user.findUnique({
        where: { id: updatedAppointment.patientId },
      });

      if (patient) {
        const patientLink = `${baseUrl}/medical/dashboard/user/appointments/view/${updatedAppointment.id}`;
        await resend.emails.send({
          from: "sandbox@resend.dev",
          to: patient.email ?? "",
          subject: "Payment Successful - Appointment Confirmed",
          react: NewAppointmentEmail({
            firstName: patient.username,
            link: patientLink,
            message: "Your payment was successful. Your appointment has been confirmed.",
          }),
        });
      }
    }

    revalidatePath("/medical/dashboard");
    revalidatePath("/medical/dashboard");

    return { 
      data: updatedAppointment, 
      status: 200, 
      error: null 
    };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { 
      data: null, 
      status: 500, 
      error 
    };
  }
}

// Ödeme durumunu kontrol et
export async function checkPaymentStatus(appointmentId: string) {
  try {
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return { error: "Appointment not found" };
    }

    if (appointment.paymentIntentId) {
      // Stripe'dan payment intent'i kontrol et
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const paymentIntent = await stripe.paymentIntents.retrieve(appointment.paymentIntentId);
      
      // Eğer Stripe'da succeeded ama bizde paid değilse güncelle
      if (paymentIntent.status === 'succeeded' && appointment.paymentStatus !== 'paid') {
        const updated = await updateAppointmentPaymentStatus(
          appointmentId,
          appointment.paymentIntentId,
          'paid'
        );
        return { data: updated.data };
      }
    }

    return { data: appointment };
  } catch (error) {
    console.error("Error checking payment status:", error);
    return { error };
  }
}
