// import { getAppointmentById } from "@/app/(components)/(content-layout)/medical/actions/appointments";
// import UpdateAppointmentForm from "@/app/(components)/(content-layout)/medical/components/Dashboard/Doctor/UpdateAppointmentForm";
// import { Button } from "../../../../../../components/ui/button";
// import { Calendar } from "lucide-react";
// import Link from "next/link";
// import React from "react";
// export default async function page({
//   params: { id },
// }: {
//   params: { id: string };
// }) {
//   const appointment = await getAppointmentById(id);
//   return (
//     <div>
//       <div className="flex items-center justify-between px-4 py-4 border-b">
//         <div className="">
//           <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
//             {`${appointment?.firstName} ${appointment?.lastName}`}
//           </h2>
//           <div className="flex space-x-2 divide-x-2 divide-gray-200 text-sm">
//             <p className="capitalize px-2">{appointment?.gender}</p>
//             <p className="px-2">{appointment?.phone}</p>
//           </div>
//         </div>
//         <div className="">
//           <h2 className="scroll-m-20 pb-2 text-2xl font-medium tracking-tight first:mt-0">
//             {appointment?.appointmentFormattedDate}
//           </h2>
//           <div className="flex items-center text-sm">
//             <Calendar className="w-4 h-4 mr-2" />
//             <span>{appointment?.appointmentTime}</span>
//           </div>
//         </div>
//       </div>
//       <div className="py-4">
//         <div className="flex divide-x-2 px-4 py-3 divide-gray-200 border-b">
//           <p className="px-3 text-sm font-semibold">Reason</p>
//           <p className="px-3">{appointment?.appointmentReason}</p>
//         </div>
//         <div className="flex divide-x-2 px-4 py-3 divide-gray-200 border-b">
//           <p className="px-3 text-sm font-semibold">Date od Birth</p>
//           <p className="px-3">
//             {appointment?.dob?.toISOString().split("T")[0]}
//           </p>
//         </div>
//         <div className="flex divide-x-2 px-4 py-3 divide-gray-200 border-b">
//           <p className="px-3 text-sm font-semibold">Email</p>
//           <p className="px-3">{appointment?.email}</p>
//         </div>
//         <div className="flex divide-x-2 px-4 py-3 divide-gray-200 border-b">
//           <p className="px-3 text-sm font-semibold">Location</p>
//           <p className="px-3">{appointment?.location}</p>
//         </div>
//         <div className="flex divide-x-2 px-4 py-3 divide-gray-200 border-b">
//           <p className="px-3 text-sm font-semibold">Medical Docs</p>
//           <div className="grid grid-cols-4 px-3">
//             {appointment?.medicalDocuments.map((item, i) => {
//               return (
//                 <Button key={i} variant={"outline"} asChild>
//                   <Link target="_blank" href={item} download>{`Doc-${
//                     i + 1
//                   }`}</Link>
//                 </Button>
//               );
//             })}
//           </div>
//         </div>
//         <div className="">
//           {/* Update form */}
//           {appointment && appointment.id && (
//             <UpdateAppointmentForm appointment={appointment} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }












import { getAppointmentById } from "@/app/(components)/(content-layout)/medical/actions/appointments";
import UpdateAppointmentForm from "@/app/(components)/(content-layout)/medical/components/Dashboard/Doctor/UpdateAppointmentForm";
import { Button } from "../../../../../../components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";
import React from "react";



export default async function page({
  params: { id },
}: {
  params: { id: string };
}) {
  const appointment = await getAppointmentById(id);

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-4 border-b gap-4">
        {/* LEFT */}
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">
            {`${appointment?.firstName} ${appointment?.lastName}`}
          </h2>

          <div className="flex flex-col sm:flex-row sm:space-x-2 sm:divide-x-2 divide-gray-200 text-sm mt-2">
            <p className="capitalize sm:px-2">{appointment?.gender}</p>
            <p className="sm:px-2">{appointment?.phone}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-left md:text-right">
          <h2 className="text-lg md:text-2xl font-medium">
            {appointment?.appointmentFormattedDate}
          </h2>

          <div className="flex md:justify-end items-center text-sm mt-1">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{appointment?.appointmentTime}</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="py-4">
        {/* ITEM */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:divide-x-2 px-4 py-3 border-b gap-2">
          <p className="sm:px-3 text-sm font-semibold">Reason</p>
          <p className="sm:px-3">{appointment?.appointmentReason}</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:divide-x-2 px-4 py-3 border-b gap-2">
          <p className="sm:px-3 text-sm font-semibold">Date of Birth</p>
          <p className="sm:px-3">
            {appointment?.dob?.toISOString().split("T")[0]}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:divide-x-2 px-4 py-3 border-b gap-2">
          <p className="sm:px-3 text-sm font-semibold">Email</p>
          <p className="sm:px-3 break-all">{appointment?.email}</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:divide-x-2 px-4 py-3 border-b gap-2">
          <p className="sm:px-3 text-sm font-semibold">Location</p>
          <p className="sm:px-3">{appointment?.location}</p>
        </div>

        {/* DOCS */}
        <div className="flex flex-col sm:flex-row sm:divide-x-2 px-4 py-3 border-b gap-3">
          <p className="sm:px-3 text-sm font-semibold">Medical Docs</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:px-3 w-full">
            {appointment?.medicalDocuments.map((item, i) => {
              return (
                <Button key={i} variant={"outline"} asChild className="w-full">
                  <Link target="_blank" href={item} download>
                    {`Doc-${i + 1}`}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* FORM */}
        <div className="px-4 mt-4">
          {appointment && appointment.id && (
            <UpdateAppointmentForm appointment={appointment} />
          )}
        </div>
      </div>
    </div>
  );
}

