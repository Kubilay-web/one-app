// import DoctorDetails from "../../../components/DoctorDetails";
// import { getDoctorById, getDoctorProfile } from "../../../actions/users";
// import { getAppointmentByPatientId } from "../../../actions/appointments";

// import { cn } from "@/app/lib/utils";
// import { Appointment } from "@prisma/client";
// import { Check, Plus, RefreshCcw, X } from "lucide-react";

// import Image from "next/image";
// import React from "react";
// import { validateRequest } from "@/app/auth";
// import FixedBookButton from "../../../components/FixedBookButton";

// export default async function page({
//   params: { slug },
//   searchParams,
// }: {
//   params: { slug: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// }) {
//   const { id } = searchParams;
//   // Fetch Doctor

//   const { user } = await validateRequest();

//   // const doctor = (await getDoctorBySlug(slug)) || null;
//   const doctor = (await getDoctorById(id as string)) || null;

//   console.log("SEARCH PARAMS:", searchParams);
//   console.log("ID:", id);

//   // Fetch Appointment By Patient Id
//   const appointment = await getAppointmentByPatientId(user?.id ?? "");
//   const doctorProfile = await getDoctorProfile((id as string) ?? "");
//   const status = doctorProfile?.status ?? "PENDING";
//   return (
//     <>
//       {doctor && doctor.id ? (
//         <div className="bg-slate-50 dark:bg-slate-800 py-8  min-h-screen">
//           <div className="bg-white dark:bg-slate-950 max-w-4xl border border-gray-200 dark:border-slate-600 mx-auto shadow-md rounded-md">
//             <div className="py-8 px-6">
//               <div className="flex items-center justify-between ">
//                 <div className="">
//                   <div className="flex flex-col">
//                     <div className="flex items-center space-x-5">
//                       <h2 className="uppercase font-bold text-2xl tracking-widest">
//                         {doctor.name}
//                       </h2>
//                       <div className="">
//                         <button
//                           className={cn(
//                             "py-2 px-3 rounded-md text-xs flex items-center space-x-2",
//                             status === "APPROVED"
//                               ? "bg-green-500 text-white"
//                               : "bg-orange-400 text-white",
//                           )}
//                         >
//                           {status === "APPROVED" ? (
//                             <Check className="mr-2 w-4 h-4" />
//                           ) : (
//                             <RefreshCcw className="mr-2 w-4 h-4" />
//                           )}

//                           {status === "APPROVED" ? "VERIFIED" : "NOT VERIFIED"}
//                         </button>
//                       </div>
//                     </div>
//                     <p className="text-gray-500 text-xs uppercase">
//                       Adult Health
//                     </p>
//                   </div>
//                   <div className="py-3">
//                     <p>{doctor.doctorProfile?.operationMode}</p>
//                     <p>
//                       {doctor.doctorProfile?.state},{" "}
//                       {doctor.doctorProfile?.city},{" "}
//                       {doctor.doctorProfile?.country}
//                     </p>
//                   </div>
//                 </div>
//                 <Image
//                   // src={
//                   //   doctor.doctorProfile?.profilePicture ?? "/onemedical/doc-profile.jpeg"
//                   // }

//                   src={"/onemedical/doc-profile.jpeg"}
//                   width={243}
//                   height={207}
//                   alt="Doctor"
//                   className="w-36 h-36 rounded-full object-cover"
//                 />
//               </div>
//             </div>
//             <div className="">
//               <DoctorDetails
//                 appointment={appointment as Appointment | null}
//                 doctor={doctor}
//                 doctorProfile={doctorProfile}
//               />
//             </div>
//           </div>

//           {/* <FixedBookButton price={doctor.doctorProfile?.hourlyWage} />  */}
//         </div>
//       ) : (
//         <div className="min-h-screen flex items-center justify-center">
//           <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
//             No Doctor Details Found
//           </h2>
//         </div>
//       )}
//     </>
//   );
// }






import DoctorDetails from "../../../components/DoctorDetails";
import { getDoctorBySlug, getDoctorProfile } from "../../../actions/users";
import { getAppointmentByPatientId } from "../../../actions/appointments";
import { cn } from "@/app/lib/utils";
import { Appointment } from "@prisma/client";
import { Check, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { validateRequest } from "@/app/auth";

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { user } = await validateRequest();

  // ✅ Doctor'ı slug ile çek
  const doctor = await getDoctorBySlug(params.slug);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-semibold">
          No Doctor Details Found
        </h2>
      </div>
    );
  }

  const appointment = await getAppointmentByPatientId(user?.id ?? "");
  const doctorProfile = await getDoctorProfile(doctor.id);
  const status = doctorProfile?.status ?? "PENDING";

  return (
    <div className="bg-slate-50 dark:bg-slate-800 py-8 min-h-screen">
      <div className="bg-white dark:bg-slate-950 max-w-4xl border mx-auto shadow-md rounded-md">
        <div className="py-8 px-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-5">
                <h2 className="uppercase font-bold text-2xl tracking-widest">
                  {doctor.name}
                </h2>

                <button
                  className={cn(
                    "py-2 px-3 rounded-md text-xs flex items-center space-x-2",
                    status === "APPROVED"
                      ? "bg-green-500 text-white"
                      : "bg-orange-400 text-white"
                  )}
                >
                  {status === "APPROVED" ? (
                    <Check className="mr-2 w-4 h-4" />
                  ) : (
                    <RefreshCcw className="mr-2 w-4 h-4" />
                  )}

                  {status === "APPROVED"
                    ? "VERIFIED"
                    : "NOT VERIFIED"}
                </button>
              </div>

              <div className="py-3">
                <p>{doctor.doctorProfile?.operationMode}</p>
                <p>
                  {doctor.doctorProfile?.state},{" "}
                  {doctor.doctorProfile?.city},{" "}
                  {doctor.doctorProfile?.country}
                </p>
              </div>
            </div>

            <Image
              src="/onemedical/doc-profile.jpeg"
              width={243}
              height={207}
              alt="Doctor"
              className="w-36 h-36 rounded-full object-cover"
            />
          </div>
        </div>

        <DoctorDetails
          appointment={appointment as Appointment | null}
          doctor={doctor}
          doctorProfile={doctorProfile}
        />
      </div>
    </div>
  );
}
