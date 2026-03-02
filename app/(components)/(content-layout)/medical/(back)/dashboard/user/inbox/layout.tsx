

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";



// import { getInboxMessages,getInboxSentMessages } from "../../../../actions/inbox";
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


//   const {user}=await validateRequest();


//   // if (user?.rolemedical !== "USER") {
//   //   return <NotAuthorized />;
//   // }


  
//   const messages = (await getInboxMessages(user?.id)).data || [];
//   const sentMessages = (await getInboxSentMessages(user?.id)).data || [];
//   return (
//     <div>
//       {/* Header */}

//       {/* 2 PANNELS */}
//       <div className="grid grid-cols-12">
//         {/* LIST PANNEL */}
//         <div className="col-span-4  py-3 border-r border-gray-100">
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
//                 <MailListPanel messages={sentMessages} role={user?.rolemedical} />
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>

//         <div className="col-span-8">{children}</div>
//       </div>
//     </div>
//   );
// }






import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

import { getInboxMessages, getInboxSentMessages } from "../../../../actions/inbox";
import MailListPanel from "../../../../components/Dashboard/Doctor/MailListPannel";
import PanelHeader from "../../../../components/Dashboard/Doctor/PanelHeader";
import NotAuthorized from "../../../../components/NotAuthorized";

import { Mail } from "lucide-react";
import React, { ReactNode } from "react";
import { validateRequest } from "@/app/auth";

export default async function AppointmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await validateRequest();

  // if (user?.rolemedical !== "USER") {
  //   return <NotAuthorized />;
  // }

  const messages = (await getInboxMessages(user?.id)).data || [];
  const sentMessages = (await getInboxSentMessages(user?.id)).data || [];

  return (
    <div className="w-full">
      {/* 2 PANELS */}
      <div className="flex flex-col lg:flex-row w-full">

        {/* LEFT PANEL - MESSAGE LIST */}
        <div className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-gray-100 py-3">
          <PanelHeader
            title="Inbox Messages"
            count={messages.length ?? 0}
            icon={Mail}
          />

          <div className="px-3">
            <Tabs defaultValue="received" className="w-full">
              
              {/* Scrollable Tabs on Mobile */}
              <TabsList className="w-full overflow-x-auto flex-nowrap whitespace-nowrap">
                <TabsTrigger value="received" className="whitespace-nowrap">
                  Received({messages.length.toString().padStart(2, "0")})
                </TabsTrigger>
                <TabsTrigger value="sent" className="whitespace-nowrap">
                  Sent({sentMessages.length.toString().padStart(2, "0")})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="received" className="mt-4">
                <MailListPanel
                  messages={messages}
                  role={user?.rolemedical}
                />
              </TabsContent>

              <TabsContent value="sent" className="mt-4">
                <MailListPanel
                  messages={sentMessages}
                  role={user?.rolemedical}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* RIGHT PANEL - MESSAGE DETAIL */}
        <div className="flex-1 w-full p-4">
          {children}
        </div>
      </div>
    </div>
  );
}