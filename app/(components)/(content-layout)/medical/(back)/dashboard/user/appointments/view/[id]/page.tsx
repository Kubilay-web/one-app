import { getAppointmentById } from "@/app/(components)/(content-layout)/medical/actions/appointments";
import { Button } from "../../../../../../components/ui/button";
import { Calendar, Mail, Phone, Video } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function page({
  params: { id },
}: {
  params: { id: string };
}) {
  const appointment = await getAppointmentById(id);
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <div className="">
          <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            {`${appointment?.firstName} ${appointment?.lastName}`}
          </h2>
          <div className="flex space-x-2 divide-x-2 divide-gray-200 text-sm">
            <p className="capitalize px-2">{appointment?.gender}</p>
            <p className="px-2">{appointment?.phone}</p>
          </div>
        </div>
        <div className="">
          <h2 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight first:mt-0">
            {appointment?.appointmentFormattedDate}
          </h2>
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{appointment?.appointmentTime}</span>
          </div>
        </div>
      </div>
      {appointment?.status === "approved" ? (
        <div className="border-2 border-green-600 shadow rounded-md p-4 mx-2 sm:mx-4 my-4">
          <div className="sm:col-span-4">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3 mb-3">
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                Appointment Approved
              </h2>

              <Button className="w-full sm:w-auto text-center break-words">
                {appointment?.appointmentFormattedDate} at{" "}
                {appointment?.appointmentTime}
              </Button>
            </div>

            {/* CONTENT */}
            <div className="py-2 space-y-5">
              {/* MEETING */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="font-semibold capitalize text-md sm:text-base">
                  {appointment?.meetingProvider}
                </h2>

                <Button
                  asChild
                  variant={"outline"}
                  className="w-full sm:w-auto"
                >
                  <Link href={appointment?.meetingLink ?? "#"}>
                    <Video className="mr-2 w-4 h-4" />
                    <span>Join Meeting</span>
                  </Link>
                </Button>
              </div>

              {/* COMMUNICATION */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* <h2 className="font-semibold capitalize text-sm sm:text-base">
                  Communicate
                </h2> */}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    asChild
                    variant={"outline"}
                    className="w-full sm:w-auto"
                  >
                    <Link href={appointment?.meetingLink ?? "#"}>
                      <Phone className="mr-2 w-4 h-4" />
                      <span>Call Doctor</span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant={"outline"}
                    className="w-full sm:w-auto"
                  >
                    <Link href={appointment?.meetingLink ?? "#"}>
                      <Mail className="mr-2 w-4 h-4" />
                      <span>Mail Doctor</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" border-2 border-green-600 shadow rounded-md p-4 mx-4 my-4">
          <div className="sm:col-span-4">
            <div className="flex items-center justify-between ">
              <h2 className="scroll-m-20 text-xl font-semibold tracking-tight py-2 mb-3">
                Appointment Status
              </h2>
              <Button>{appointment?.status}</Button>
            </div>
          </div>
        </div>
      )}
      <div className="py-4">
        <div className="flex divide-x-2 px-4 py-3 divide-gray-200 border-b">
          <p className="px-3 text-sm font-semibold">Reason</p>
          <p className="px-3">{appointment?.appointmentReason}</p>
        </div>
        <div className="flex divide-x-2 px-4 py-3 divide-gray-200 border-b">
          <p className="px-3 text-sm font-semibold">Date od Birth</p>
          <p className="px-3">
            {appointment?.dob?.toISOString().split("T")[0]}
          </p>
        </div>
        <div className="flex divide-x-2 px-4 py-3 divide-gray-200 border-b">
          <p className="px-3 text-sm font-semibold">Email</p>
          <p className="px-3">{appointment?.email}</p>
        </div>
        <div className="flex divide-x-2 px-4 py-3 divide-gray-200 border-b">
          <p className="px-3 text-sm font-semibold">Location</p>
          <p className="px-3">{appointment?.location}</p>
        </div>
        <div className="flex divide-x-2 px-4 py-3 divide-gray-200 border-b">
          <p className="px-3 text-sm font-semibold">Medical Docs</p>
          <div className="grid grid-cols-4 px-3">
            {appointment?.medicalDocuments.map((item, i) => {
              return (
                <Button key={i} variant={"outline"} asChild>
                  <Link target="_blank" href={item} download>{`Doc-${
                    i + 1
                  }`}</Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
