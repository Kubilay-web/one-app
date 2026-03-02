// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

// import GeneralSettings from "./GeneralSettings";
// import { Button } from "../../../components/ui/button";
// import { PlusCircle } from "lucide-react";

// export default function Settings() {
//   const tabs = [
//     {
//       label: "General",
//       value: "general",
//       component: <GeneralSettings />,
//     },
//     {
//       label: "Security",
//       value: "security",
//       component: <></>,
//     },
//     {
//       label: "Integrations",
//       value: "integrations",
//       component: <></>,
//     },
//     {
//       label: "Support",
//       value: "support",
//       component: <></>,
//     },
//     {
//       label: "Organizations",
//       value: "organizations",
//       component: <></>,
//     },
//     {
//       label: "Advanced",
//       value: "advanced",
//       component: <></>,
//     },
//   ];
//   return (
//     <main className="grid flex-1 items-start  gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
//       <Tabs defaultValue="all">
//         <div className="flex items-center">
//           <TabsList>
//             {tabs.map((tab) => {
//               return (
//                 <TabsTrigger key={tab.value} value={tab.value}>
//                   {tab.label}
//                 </TabsTrigger>
//               );
//             })}
//           </TabsList>
//           <div className="ml-auto flex items-center gap-2">
//             <Button size="sm" className="h-8 gap-1">
//               <PlusCircle className="h-3.5 w-3.5" />
//               <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//                 Add Product
//               </span>
//             </Button>
//           </div>
//         </div>
//         {tabs.map((tab) => {
//           return (
//             <TabsContent
//               key={tab.value}
//               className="w-full"
//               value={tab.value ?? "general"}
//             >
//               {tab.component}
//             </TabsContent>
//           );
//         })}
//       </Tabs>
//     </main>
//   );
// }







import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import GeneralSettings from "./GeneralSettings";
import { Button } from "../../../components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Settings() {
  const tabs = [
    { label: "General", value: "general", component: <GeneralSettings /> },
    { label: "Security", value: "security", component: <></> },
    { label: "Integrations", value: "integrations", component: <></> },
    { label: "Support", value: "support", component: <></> },
    { label: "Organizations", value: "organizations", component: <></> },
    { label: "Advanced", value: "advanced", component: <></> },
  ];

  return (
    <main className="flex-1 p-4 sm:px-6 sm:py-6">
      <Tabs defaultValue="general" className="w-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          
          {/* Scrollable Tabs */}
          <TabsList className="w-full sm:w-auto overflow-x-auto flex-nowrap whitespace-nowrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Action Button */}
          <div className="sm:ml-auto w-full sm:w-auto">
            <Button
              size="sm"
              className="h-9 w-full sm:w-auto gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="whitespace-nowrap">Add Product</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="w-full mt-6"
          >
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}