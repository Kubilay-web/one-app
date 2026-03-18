// "use client";

// import { useState } from "react";
// import { Card, CardContent } from "../../components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
// import { Badge } from "../../components/ui/badge";
// import { Button } from "../../components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../../components/ui/dialog";
// import {
//   Mail,
//   Phone,
//   Building,
//   MapPin,
//   Users,
//   Briefcase,
//   Globe,
//   Calendar,
// } from "lucide-react";

// interface Contact {
//   id: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   school: string;
//   country: string;
//   schoolPage: string;
//   students: number;
//   role: string;
//   media: string;
//   createdAt: string;
// }

// interface ContactInfoModalProps {
//   contact: Contact;
//   trigger?: React.ReactNode;
// }

// export default function ContactInfoModal({
//   contact,
//   trigger,
// }: ContactInfoModalProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   const infoCards = [
//     { icon: Mail, label: "Email", value: contact.email },
//     { icon: Phone, label: "Phone", value: contact.phone },
//     { icon: Building, label: "School", value: contact.school },
//     { icon: MapPin, label: "Country", value: contact.country },
//     { icon: Globe, label: "School Page", value: contact.schoolPage },
//     { icon: Users, label: "Students", value: contact.students.toString() },
//     { icon: Briefcase, label: "Role", value: contact.role },
//     {
//       icon: Calendar,
//       label: "Joined",
//       value: new Date(contact.createdAt).toLocaleDateString(),
//     },
//   ];

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         {trigger || <Button variant="outline">View</Button>}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-4">
//             <Avatar className="w-16 h-16">
//               <AvatarImage
//                 src={`https://api.dicebear.com/6.x/initials/svg?seed=${contact.fullName}`}
//                 alt={contact.fullName}
//               />
//               <AvatarFallback>
//                 {contact.fullName
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")}
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <h2 className="text-2xl font-bold">{contact.fullName}</h2>
//               <Badge variant="secondary" className="mt-1">
//                 Via {contact.media}
//               </Badge>
//             </div>
//           </DialogTitle>
//         </DialogHeader>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
//           {infoCards.map((card, index) => (
//             <Card key={index} className="overflow-hidden">
//               <CardContent className="p-4 flex flex-col items-center text-center">
//                 <card.icon className="w-8 h-8 mb-2 text-primary" />
//                 <h3 className="font-semibold text-sm mb-1">{card.label}</h3>
//                 <p className="text-sm text-muted-foreground break-all">
//                   {card.label === "School Page" ? (
//                     <a
//                       href={card.value}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-500 hover:underline"
//                     >
//                       {card.value}
//                     </a>
//                   ) : (
//                     card.value
//                   )}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }







"use client";

import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Mail,
  Phone,
  Building,
  MapPin,
  Users,
  Briefcase,
  Globe,
  Calendar,
} from "lucide-react";

interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  country: string;
  schoolPage: string;
  students: number;
  role: string;
  media: string;
  createdAt: string;
}

interface ContactInfoModalProps {
  contact: Contact;
  trigger?: React.ReactNode;
}

export default function ContactInfoModal({
  contact,
  trigger,
}: ContactInfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const infoCards = [
    { icon: Mail, label: "Email", value: contact.email },
    { icon: Phone, label: "Phone", value: contact.phone },
    { icon: Building, label: "School", value: contact.school },
    { icon: MapPin, label: "Country", value: contact.country },
    { icon: Globe, label: "School Page", value: contact.schoolPage },
    { icon: Users, label: "Students", value: contact.students.toString() },
    { icon: Briefcase, label: "Role", value: contact.role },
    {
      icon: Calendar,
      label: "Joined",
      value: new Date(contact.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">View</Button>}
      </DialogTrigger>
      <DialogContent className="bg-white text-black sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${contact.fullName}`}
                alt={contact.fullName}
              />
              <AvatarFallback>
                {contact.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-black">{contact.fullName}</h2>
              <Badge variant="secondary" className="mt-1 text-black">
                Via {contact.media}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {infoCards.map((card, index) => (
            <Card
              key={index}
              className="overflow-hidden bg-white border border-gray-200 shadow-sm"
            >
              <CardContent className="p-4 flex flex-col items-center text-center text-black">
                <card.icon className="w-8 h-8 mb-2 text-black" />
                <h3 className="font-semibold text-sm mb-1">{card.label}</h3>
                <p className="text-sm break-words">
                  {card.label === "School Page" ? (
                    <a
                      href={card.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {card.value}
                    </a>
                  ) : (
                    card.value
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}