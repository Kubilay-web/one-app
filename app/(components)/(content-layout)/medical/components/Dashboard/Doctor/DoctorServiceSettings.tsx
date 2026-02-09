import React from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";




import UpdateServiceForm from "./UpdateServiceForm";



import { getServices } from "../../../actions/services";
import { getSpecialties } from "../../../actions/specialities";
import { getSymptoms } from "../../../actions/symptom";


import { DoctorProfile } from "@prisma/client";
export default async function DoctorServiceSettings({
  profile,
}: {
  profile: DoctorProfile | undefined | null;
}) {
  const services = (await getServices()).data;
  const specialties = (await getSpecialties()).data;
  const symptoms = await (await getSymptoms()).data;

  console.log(profile);

  return (
    <div className="grid gap-6 w-full">
      <Card className="w-full">
        {/* <CardHeader>
          <CardTitle>Choose Service</CardTitle>
          <CardDescription>
            Used to identify your store in the marketplace.
          </CardDescription>
        </CardHeader> */}
        <UpdateServiceForm
          profile={profile}
          services={services}
          specialties={specialties}
          symptoms={symptoms}
        />
      </Card>
    </div>
  );
}
