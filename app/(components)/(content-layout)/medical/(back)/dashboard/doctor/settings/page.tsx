// import React from "react";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../../../components/ui/tabs";

// import AvailabilitySettings from "../../../../components/Dashboard/Doctor/AvailabilitySettings";
// import { getDoctorProfileById } from "../../../../actions/onboarding";
// import DoctorServiceSettings from "../../../../components/Dashboard/Doctor/DoctorServiceSettings";
// import { validateRequest } from "@/app/auth";

// // import { Tabs } from "flowbite-react";
// export default async function page() {

  
//   const { user } = await validateRequest();

//   console.log(user);
//   const profile = await getDoctorProfileById(user?.id);
//   console.log(profile);
//   return (
//     <div className="max-w-5xl mx-auto w-full px-6 py-6">
//       <h2 className="pb-4 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
//         Settings
//       </h2>
//       <Tabs defaultValue="availability" className="w-[800px]">
//         <TabsList>
//           <TabsTrigger value="availability">Availability Settings</TabsTrigger>
//           <TabsTrigger value="service">Service Settings</TabsTrigger>
//         </TabsList>
//         <TabsContent value="availability" className="w-full">
//           {/* Availability Form */}
//           <AvailabilitySettings profile={profile?.data} />
//         </TabsContent>
//         <TabsContent value="service">
//           <DoctorServiceSettings profile={profile?.data} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }









import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

import AvailabilitySettings from "../../../../components/Dashboard/Doctor/AvailabilitySettings";
import { getDoctorProfileById } from "../../../../actions/onboarding";
import DoctorServiceSettings from "../../../../components/Dashboard/Doctor/DoctorServiceSettings";
import { validateRequest } from "@/app/auth";

export default async function page() {

  const { user } = await validateRequest();
  const profile = await getDoctorProfileById(user?.id);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <h2 className="pb-6 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
        Settings
      </h2>

      <Tabs
        defaultValue="availability"
        className="w-full"
      >

        <TabsList className="w-full flex flex-col sm:flex-row gap-2 sm:gap-0">

          <TabsTrigger
            value="availability"
            className="w-full sm:w-auto"
          >
            Availability Settings
          </TabsTrigger>

          <TabsTrigger
            value="service"
            className="w-full sm:w-auto"
          >
            Service Settings
          </TabsTrigger>

        </TabsList>

        <TabsContent
          value="availability"
          className="w-full mt-4"
        >
          <AvailabilitySettings profile={profile?.data} />
        </TabsContent>

        <TabsContent
          value="service"
          className="w-full mt-4"
        >
          <DoctorServiceSettings profile={profile?.data} />
        </TabsContent>

      </Tabs>
    </div>
  );
}
