
// import { DataProps,getDoctorsByServiceSlug } from "../../../actions/doctors";
// import DoctorCard from "../../../components/DoctorCard";
// import { Doctor } from "../../../types/types";
// import Link from "next/link";
// import React from "react";

// export default async function page({
//   params: { slug },
//   searchParams,
// }: {
//   params: { slug: string };
//   searchParams: { [key: string]: string | string[] | undefined };
// }) {
//   const { type } = searchParams;
//   console.log(type);
//   const title = slug.split("-").join(" ");
//   const data = (await getDoctorsByServiceSlug(slug)) as DataProps;
//   const doctors = data?.doctors as Doctor[];
//   const services = data?.services;
//   return (
//     <div className="container p-8">
//       <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl pb-6 capitalize">
//         {title} ({doctors.length.toString().padStart(2, "0")})
//       </h1>
//       <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 lg:gap-10">
//         <div className="col-span-3  border border-gray-200/50 rounded-sm p-6">
//           <h2 className="capitalize font-semibold">Other Services</h2>
//           {services && services.length > 0 && (
//             <div className="py-3 flex flex-col text-sm space-y-2">
//               {services.map((service, i) => {
//                 return (
//                   <Link
//                     key={i}
//                     href={`/medical/service/${service.slug}`}
//                     className="hover:text-blue-600"
//                   >
//                     {service.title}
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//         <div className="col-span-9 ">
//           {doctors && doctors.length > 0 ? (
//             <div className="grid grid-cols-2 gap-6">
//               {doctors.map((doctor: Doctor) => {
//                 return <DoctorCard key={doctor.id} doctor={doctor} />;
//               })}
//             </div>
//           ) : (
//             <div className="">
//               <h2>No Doctors for this Category</h2>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import { DataProps, getDoctorsByServiceSlug } from "../../../actions/doctors";
import DoctorCard from "../../../components/DoctorCard";
import { Doctor } from "../../../types/types";
import Link from "next/link";
import React from "react";

export default async function page({
  params: { slug },
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { type } = searchParams;
  const title = slug.split("-").join(" ");
  const data = (await getDoctorsByServiceSlug(slug)) as DataProps;
  const doctors = data?.doctors as Doctor[];
  const services = data?.services;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight pb-6 capitalize">
        {title} ({doctors?.length?.toString().padStart(2, "0")})
      </h1>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 max-w-7xl mx-auto">
        
        {/* SIDEBAR */}
        <div className="lg:col-span-3 border border-gray-200/50 rounded-sm p-4 sm:p-6 h-fit">
          <h2 className="capitalize font-semibold mb-3">
            Other Services
          </h2>

          {services && services.length > 0 && (
            <div className="flex flex-col text-sm space-y-2">
              {services.map((service, i) => (
                <Link
                  key={i}
                  href={`/medical/service/${service.slug}`}
                  className="hover:text-blue-600 transition-colors break-words"
                >
                  {service.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* DOCTORS */}
        <div className="lg:col-span-9">
          {doctors && doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {doctors.map((doctor: Doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16">
              <h2 className="text-lg font-medium text-gray-500">
                No Doctors for this Category
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}