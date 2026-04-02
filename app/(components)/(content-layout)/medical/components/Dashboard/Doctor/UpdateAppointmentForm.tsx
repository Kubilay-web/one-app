// "use client";





// import { updateAppointmentById } from "../../../actions/appointments";
// import RadioInput from "../../FormInputs/RadioInput";
// import SelectInput from "../../FormInputs/SelectInput";
// import TextInput from "../../FormInputs/TextInput";
// import { Button } from "../../../components/ui/button";



// import { Appointment, AppointmentStatus } from "@prisma/client";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// export type AppointmentUpdateProps = {
//   status: AppointmentStatus;
//   meetingLink: string;
//   meetingProvider: string;
// };
// export default function UpdateAppointmentForm({
//   appointment,
// }: {
//   appointment: Appointment;
// }) {
//   const [loading, setLoading] = useState(false);
//   const statusOptions = [
//     {
//       label: "Pending",
//       value: "pending",
//     },
//     {
//       label: "Approve",
//       value: "approved",
//     },
//     {
//       label: "Reject",
//       value: "rejected",
//     },
//   ];
//   const meetingProviders = [
//     {
//       label: "Zoom",
//       value: "zoom",
//     },
//     {
//       label: "Google Meet",
//       value: "google-meet",
//     },
//     {
//       label: "Microsoft Teams",
//       value: "microsoft-teams",
//     },
//   ];
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<AppointmentUpdateProps>({
//     defaultValues: {
//       meetingLink: appointment.meetingLink,
//       meetingProvider: appointment.meetingProvider,
//       status: appointment.status,
//     },
//   });

//   async function handleUpdate(data: AppointmentUpdateProps) {
//     setLoading(true);
//     try {
//       await updateAppointmentById(appointment.id, data);
//       setLoading(false);
//       toast.success("Appointment Updated successfully");
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//     }
//   }
//   return (
//     <form
//       className=" border-2 border-green-600 shadow rounded-md p-4 mx-4 my-4"
//       onSubmit={handleSubmit(handleUpdate)}
//     >
//       <div className="sm:col-span-4">
//         <div className="flex items-center justify-between border-b">
//           <h2 className="scroll-m-20 text-md font-semibold tracking-tight py-2 pr-3 mb-3">
//             Update Appointment
//           </h2>
//           <Button disabled={loading}>
//             {loading ? "Saving please wait..." : "Update Appointment"}
//           </Button>
//         </div>
//         <div className=" mt-2">
//           {/* <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
//           <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
//             $
//           </span>
//           <input
//             type="number"
//             name="price"
//             id="price"
//             value={price}
//             onChange={(e) => setPrice(+e.target.value)}
//             autoComplete="price"
//             className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//             placeholder="100"
//           />
//         </div> */}
//           <div className="py-2">
//             <TextInput
//               label="Add Meeting Link"
//               register={register}
//               name="meetingLink"
//               errors={errors}
//               placeholder="https://meet.google.com/nvg-vvvd-uyj"
//             />
//           </div>
//           <div className="py-2">
//             <div className="flex flex-col w-full">
//               <SelectInput
        
//                 label="Meeting Provider"
//                 name="meetingProvider"
//                 register={register}
//                 options={meetingProviders}
//               />
//               <RadioInput
//                 title="Approve the Appointment"
//                 name="status"
//                 errors={errors}
//                 register={register}
//                 radioOptions={statusOptions}
        
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// }








"use client";

import { updateAppointmentById } from "../../../actions/appointments";
import RadioInput from "../../FormInputs/RadioInput";
import SelectInput from "../../FormInputs/SelectInput";
import TextInput from "../../FormInputs/TextInput";
import { Button } from "../../../components/ui/button";

import { Appointment, AppointmentStatus } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export type AppointmentUpdateProps = {
  status: AppointmentStatus;
  meetingLink: string;
  meetingProvider: string;
};

export default function UpdateAppointmentForm({
  appointment,
}: {
  appointment: Appointment;
}) {
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Approve", value: "approved" },
    { label: "Reject", value: "rejected" },
  ];

  const meetingProviders = [
    { label: "Zoom", value: "zoom" },
    { label: "Google Meet", value: "google-meet" },
    { label: "Microsoft Teams", value: "microsoft-teams" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentUpdateProps>({
    defaultValues: {
      meetingLink: appointment.meetingLink,
      meetingProvider: appointment.meetingProvider,
      status: appointment.status,
    },
  });

  async function handleUpdate(data: AppointmentUpdateProps) {
    setLoading(true);
    try {
      await updateAppointmentById(appointment.id, data);
      toast.success("Appointment Updated successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="border rounded-xl p-4 sm:p-6 mx-2 sm:mx-4 my-4 shadow-sm bg-white"
      onSubmit={handleSubmit(handleUpdate)}
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3 mb-4">
        <h2 className="text-base sm:text-lg font-semibold">
          Update Appointment
        </h2>

        <Button
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Saving..." : "Update Appointment"}
        </Button>
      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meeting Link */}
        <div className="col-span-1 md:col-span-2">
          <TextInput
            label="Add Meeting Link"
            register={register}
            name="meetingLink"
            errors={errors}
            placeholder="https://meet.google.com/xxx"
          />
        </div>

        {/* Meeting Provider */}
        <div className="col-span-1">
          <SelectInput
            label="Meeting Provider"
            name="meetingProvider"
            register={register}
            options={meetingProviders}
          />
        </div>

        {/* Status */}
        <div className="col-span-1">
          <RadioInput
            title="Appointment Status"
            name="status"
            errors={errors}
            register={register}
            radioOptions={statusOptions}
          />
        </div>
      </div>
    </form>
  );
}







