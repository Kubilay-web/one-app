import { getSpecialtyBySlug } from "@/app/(components)/(content-layout)/medical/actions/specialities";
import SpecialtyForm from "@/app/(components)/(content-layout)/medical/components/Dashboard/SpecialtyForm";
import React from "react";

export default async function page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const specialty = (await getSpecialtyBySlug(slug))?.data;
  return (
    <div>
      {specialty && specialty.id && (
        <SpecialtyForm title="Update Service" initialData={specialty} />
      )}
    </div>
  );
}
