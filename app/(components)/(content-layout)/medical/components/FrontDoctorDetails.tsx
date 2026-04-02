// import React from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";



// import { getNormalDate } from "../utils/getNormalDate";

// import {
//   AlertTriangle,
//   Calendar,
//   CalendarCheck,
//   Check,
//   CircleEllipsis,
//   History,
//   X,
// } from "lucide-react";
// import SubHeading from "./SubHeading";
// import { DoctorProfile } from "@prisma/client";
// import { FaRegFilePdf } from "react-icons/fa";
// import Link from "next/link";
// export default function FrontDoctorDetails({
//   doctorProfile,
// }: {
//   doctorProfile: DoctorProfile | null | undefined;
// }) {
//   if (!doctorProfile) {
//     return (
//       <div className="min-h-96 flex items-center justify-center">
//         <div className="space-y-3 text-center flex items-center justify-center flex-col">
//           <AlertTriangle className="w-10 h-10 " />
//           <h2>No Doctor Profile Found</h2>
//         </div>
//       </div>
//     );
//   }
//   const dob = doctorProfile?.dob ?? "1992-05-13T21:00:00.000Z";
//   return (
//     <div className="p-4">
//       <Tabs defaultValue="details" className="w-full">
//         <TabsList>
//           <TabsTrigger value="details">Doctor Details</TabsTrigger>
//           <TabsTrigger value="education">Education Info</TabsTrigger>
//           <TabsTrigger value="practice">Practice Info</TabsTrigger>
//           <TabsTrigger value="additional">Additional Info</TabsTrigger>
//         </TabsList>
//         <TabsContent value="details">
//           <div className="p-4">
//             <SubHeading title="Bio Data" />
//             <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
//               <div className="flex items-center">
//                 <span className="mr-3">First Name :</span>
//                 <span>{doctorProfile?.firstName}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Last Name :</span>
//                 <span>{doctorProfile?.lastName}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Date of Birth :</span>
//                 <span>{getNormalDate(dob as string)}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Middle Name :</span>
//                 <span>{doctorProfile?.middleName}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Gender :</span>
//                 <span>{doctorProfile?.gender}</span>
//               </div>
//             </div>
//           </div>
//           <div className="p-4">
//             <SubHeading title="Profile Information" />
//             <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
//               <div className="flex items-center">
//                 <span className="mr-3">Medical License :</span>
//                 <span>{doctorProfile?.medicalLicense}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Years of Experience :</span>
//                 <span>{doctorProfile?.yearsOfExperience}</span>
//               </div>
//             </div>
//             <div className="py-3 space-y-3">
//               <p>{doctorProfile?.bio}</p>
//             </div>
//           </div>
//           <div className="p-4">
//             <SubHeading title="Contact Information" />
//             <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
//               <div className="flex items-center">
//                 <span className="mr-3">Email Address :</span>
//                 <span>{doctorProfile?.email}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Phone :</span>
//                 <span>{doctorProfile?.phone}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Country :</span>
//                 <span>{doctorProfile?.country}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">City:</span>
//                 <span>{doctorProfile?.city}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">State :</span>
//                 <span>{doctorProfile?.state}</span>
//               </div>
//             </div>
//           </div>
//         </TabsContent>
//         <TabsContent value="education">
//           <div className="p-4">
//             <SubHeading title="Education Information" />
//             <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
//               <div className="flex items-center">
//                 <span className="mr-3">Graduation Year :</span>
//                 <span>{doctorProfile?.graduationYear}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Primary Specialization :</span>
//                 <span>{doctorProfile?.primarySpecialization}</span>
//               </div>
//             </div>
//             <div className="py-4 space-y-4">
//               <div className="flex items-center">
//                 <span className="mr-3">Medical School :</span>
//                 <span>{doctorProfile?.medicalSchool}</span>
//               </div>
//               {doctorProfile?.otherSpecialties && (
//                 <div className="">
//                   <h2>Other Specialties</h2>
//                   <div className="flex gap-4 flex-wrap py-3">
//                     {doctorProfile.otherSpecialties.map((item, i) => {
//                       return (
//                         <p key={i} className="py-1.5 px-4 border rounded-md">
//                           {item}
//                         </p>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </TabsContent>
//         <TabsContent value="practice">
//           <div className="p-4">
//             <SubHeading title="Practice Information" />
//             <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
//               <div className="flex items-center">
//                 <span className="mr-3">Hospital Name :</span>
//                 <span>{doctorProfile?.hospitalName}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Hourly Charge :</span>
//                 <span>{doctorProfile?.hourlyWage}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Hospital Address :</span>
//                 <span>{doctorProfile?.hospitalAddress}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Hospital Contact :</span>
//                 <span>{doctorProfile?.hospitalContactNumber}</span>
//               </div>

//               <div className="flex items-center">
//                 <span className="mr-3">Hospital Hours of operation :</span>
//                 <span>{doctorProfile?.hospitalHoursOfOperation}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Do you accept Insurance :</span>
//                 <span>{doctorProfile?.insuranceAccepted}</span>
//               </div>
//             </div>
//             <div className="py-4 space-y-4">
//               <div className="flex items-center">
//                 <span className="mr-3">Hospital Email address :</span>
//                 <span>{doctorProfile?.hospitalEmailAddress}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Hospital Website address :</span>
//                 <span>{doctorProfile?.hospitalWebsite}</span>
//               </div>

//               {doctorProfile?.servicesOffered && (
//                 <div className="">
//                   <h2>Hospital Services</h2>
//                   <div className="flex gap-4 flex-wrap py-3">
//                     {doctorProfile.servicesOffered.map((item, i) => {
//                       return (
//                         <p key={i} className="py-1.5 px-4 border rounded-md">
//                           {item}
//                         </p>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </TabsContent>
//         <TabsContent value="additional">
//           <div className="p-4">
//             <SubHeading title="Additional Information" />

//             <div className="py-4 space-y-4">
//               <div className="flex items-center">
//                 <span className="mr-3">Education History :</span>
//                 <span>{doctorProfile?.educationHistory}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Published Works or Research :</span>
//                 <span>{doctorProfile?.research}</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3">Accomplishments or awards :</span>
//                 <span>{doctorProfile?.accomplishments}</span>
//               </div>
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }















import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { getNormalDate } from "../utils/getNormalDate";
import {
  AlertTriangle,
  Calendar,
  CalendarCheck,
  Check,
  CircleEllipsis,
  History,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Stethoscope,
  Award,
  FileText,
  Clock,
  DollarSign,
  Shield,
  Globe,
  BookOpen,
  Briefcase,
  Heart,
  CreditCard,
  Video,
} from "lucide-react";
import SubHeading from "./SubHeading";
import { DoctorProfile } from "@prisma/client";
import { FaRegFilePdf } from "react-icons/fa";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export default function FrontDoctorDetails({
  doctorProfile,
}: {
  doctorProfile: DoctorProfile | null | undefined;
}) {
  if (!doctorProfile) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Doctor Profile Found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              The doctor profile you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dob = doctorProfile?.dob ?? "1992-05-13T21:00:00.000Z";
  const initials = `${doctorProfile?.firstName?.[0] || ""}${doctorProfile?.lastName?.[0] || ""}`;

  // Info Card Component
  const InfoCard = ({ icon: Icon, label, value, className = "" }: any) => (
    <div className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}>
      <div className="mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{value || "N/A"}</p>
      </div>
    </div>
  );

  const BadgeList = ({ items, color = "default" }: { items: string[]; color?: string }) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item, i) => (
        <Badge key={i} variant="secondary" className="text-xs">
          {item}
        </Badge>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary/10">
            <AvatarImage src={doctorProfile?.profilePicture || ""} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Dr. {doctorProfile?.firstName} {doctorProfile?.lastName}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {doctorProfile?.primarySpecialization && (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  {doctorProfile.primarySpecialization}
                </Badge>
              )}
              {doctorProfile?.yearsOfExperience && (
                <Badge variant="outline" className="gap-1">
                  <Briefcase className="w-3 h-3" />
                  {doctorProfile.yearsOfExperience}+ Years
                </Badge>
              )}
              {doctorProfile?.hourlyWage && (
                <Badge variant="outline" className="gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${doctorProfile.hourlyWage}/hr
                </Badge>
              )}
            </div>
            {doctorProfile?.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
                {doctorProfile.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="details" className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0">
            <TabsTrigger value="details" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personal</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Education</span>
              <span className="sm:hidden">Edu</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Practice</span>
              <span className="sm:hidden">Work</span>
            </TabsTrigger>
            <TabsTrigger value="additional" className="gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Additional</span>
              <span className="sm:hidden">More</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Personal Details Tab */}
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bio Data Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Bio Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoCard icon={User} label="First Name" value={doctorProfile?.firstName} />
                  <InfoCard icon={User} label="Last Name" value={doctorProfile?.lastName} />
                  <InfoCard icon={Calendar} label="Date of Birth" value={getNormalDate(dob as string)} />
                  <InfoCard icon={User} label="Middle Name" value={doctorProfile?.middleName} />
                  <InfoCard icon={Heart} label="Gender" value={doctorProfile?.gender} />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoCard icon={Mail} label="Email" value={doctorProfile?.email} />
                  <InfoCard icon={Phone} label="Phone" value={doctorProfile?.phone} />
                  <InfoCard icon={Globe} label="Country" value={doctorProfile?.country} />
                  <InfoCard icon={MapPin} label="City" value={doctorProfile?.city} />
                  <InfoCard icon={MapPin} label="State" value={doctorProfile?.state} />
                </div>
              </CardContent>
            </Card>

            {/* Profile Information Card */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <InfoCard icon={FileText} label="Medical License" value={doctorProfile?.medicalLicense} />
                  <InfoCard icon={Clock} label="Years of Experience" value={`${doctorProfile?.yearsOfExperience} years`} />
                </div>
                {doctorProfile?.bio && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {doctorProfile.bio}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <InfoCard icon={Calendar} label="Graduation Year" value={doctorProfile?.graduationYear} />
                  <InfoCard icon={Stethoscope} label="Primary Specialization" value={doctorProfile?.primarySpecialization} />
                  <InfoCard icon={Building2} label="Medical School" value={doctorProfile?.medicalSchool} />
                </div>
                
                {doctorProfile?.otherSpecialties && doctorProfile.otherSpecialties.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Other Specialties
                    </h3>
                    <BadgeList items={doctorProfile.otherSpecialties} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Practice Tab */}
        <TabsContent value="practice" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Practice Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <InfoCard icon={Building2} label="Hospital Name" value={doctorProfile?.hospitalName} />
                  <InfoCard icon={DollarSign} label="Hourly Charge" value={`$${doctorProfile?.hourlyWage}/hr`} />
                  <InfoCard icon={MapPin} label="Hospital Address" value={doctorProfile?.hospitalAddress} />
                  <InfoCard icon={Phone} label="Hospital Contact" value={doctorProfile?.hospitalContactNumber} />
                  <InfoCard icon={Clock} label="Hours of Operation" value={doctorProfile?.hospitalHoursOfOperation} />
                  <InfoCard icon={Shield} label="Insurance Accepted" value={doctorProfile?.insuranceAccepted} />
                  <InfoCard icon={Mail} label="Hospital Email" value={doctorProfile?.hospitalEmailAddress} />
                  <InfoCard icon={Globe} label="Hospital Website" value={doctorProfile?.hospitalWebsite} />
                </div>

                {doctorProfile?.servicesOffered && doctorProfile.servicesOffered.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Services Offered
                    </h3>
                    <BadgeList items={doctorProfile.servicesOffered} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Additional Tab */}
        <TabsContent value="additional" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {doctorProfile?.educationHistory && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Education History
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{doctorProfile.educationHistory}</p>
                  </div>
                )}
                
                {doctorProfile?.research && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Published Works & Research
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{doctorProfile.research}</p>
                  </div>
                )}
                
                {doctorProfile?.accomplishments && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Accomplishments & Awards
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{doctorProfile.accomplishments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
