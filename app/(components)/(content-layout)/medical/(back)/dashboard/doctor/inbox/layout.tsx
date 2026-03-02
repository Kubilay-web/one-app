// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../../../components/ui/tabs";

// import {
//   getInboxMessages,
//   getInboxSentMessages,
// } from "../../../../actions/inbox";
// import MailListPanel from "../../../../components/Dashboard/Doctor/MailListPannel";
// import PanelHeader from "../../../../components/Dashboard/Doctor/PanelHeader";
// import NotAuthorized from "../../../../components/NotAuthorized";

// import { Calendar, Mail } from "lucide-react";

// import React, { ReactNode } from "react";
// import { validateRequest } from "@/app/auth";

// export default async function AppointmentLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const { user } = await validateRequest();
//   // if (user?.rolemedical !== "DOCTOR") {
//   //   return <NotAuthorized />;
//   // }
//   const messages = (await getInboxMessages(user?.id)).data || [];
//   const sentMessages = (await getInboxSentMessages(user?.id)).data || [];
//   return (
//     <div>
//       {/* Header */}

//       {/* 2 PANNELS */}
//       <div className="flex w-full flex-wrap">
//         {/* LIST PANNEL */}
//         <div className="flex flex-wrap w-full align-top py-3 border-r border-gray-100">
//           <PanelHeader
//             title="Inbox Messages"
//             count={messages.length ?? 0}
//             icon={Mail}
//           />
//           <div className="px-3">
//             <Tabs defaultValue="received" className="">
//               <TabsList>
//                 <TabsTrigger value="received">
//                   Received({messages.length.toString().padStart(2, "0")})
//                 </TabsTrigger>
//                 <TabsTrigger value="sent">
//                   Sent({sentMessages.length.toString().padStart(2, "0")})
//                 </TabsTrigger>
//               </TabsList>
//               <TabsContent value="received">
//                 <MailListPanel messages={messages} role={user?.rolemedical} />
//               </TabsContent>
//               <TabsContent value="sent">
//                 <MailListPanel
//                   messages={sentMessages}
//                   role={user?.rolemedical}
//                 />
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>

//         <div>{children}</div>
//       </div>
//     </div>
//   );
// }

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

import {
  getInboxMessages,
  getInboxSentMessages,
} from "../../../../actions/inbox";
import MailListPanel from "../../../../components/Dashboard/Doctor/MailListPannel";
import PanelHeader from "../../../../components/Dashboard/Doctor/PanelHeader";
import NotAuthorized from "../../../../components/NotAuthorized";

import { Calendar, Mail } from "lucide-react";

import React, { ReactNode } from "react";
import { validateRequest } from "@/app/auth";

export default async function AppointmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await validateRequest();

  // if (user?.rolemedical !== "DOCTOR") {
  //   return <NotAuthorized />;
  // }

  const messages = (await getInboxMessages(user?.id)).data || [];
  const sentMessages = (await getInboxSentMessages(user?.id)).data || [];

  return (
    <div className="w-full">
      {/* MAIN WRAPPER */}
      <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-120px)]">
        {/* LIST PANEL */}
        <div
          className="
          w-full 
          lg:w-1/3 
          xl:w-1/4 
          border-b 
          lg:border-b-0 
          lg:border-r 
          border-gray-100 
          py-3
        "
        >
          <PanelHeader
            title="Inbox Messages"
            count={messages.length ?? 0}
            icon={Mail}
          />

          <div className="px-3">
            <Tabs defaultValue="received" className="w-full">
              <TabsList className="w-full flex justify-between">
                <TabsTrigger value="received" className="flex-1 text-center">
                  Received({messages.length.toString().padStart(2, "0")})
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex-1 text-center">
                  Sent({sentMessages.length.toString().padStart(2, "0")})
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="received"
                className="mt-3 max-h-[60vh] lg:max-h-[75vh] overflow-y-auto"
              >
                <MailListPanel messages={messages} role={user?.rolemedical} />
              </TabsContent>

              <TabsContent
                value="sent"
                className="mt-3 max-h-[60vh] lg:max-h-[75vh] overflow-y-auto"
              >
                <MailListPanel
                  messages={sentMessages}
                  role={user?.rolemedical}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* CONTENT PANEL */}
        <div
          className="
          w-full 
          lg:w-2/3 
          xl:w-3/4 
          p-4
        "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
