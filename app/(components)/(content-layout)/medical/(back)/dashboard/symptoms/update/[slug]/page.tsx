
import { getSymptomBySlug } from "@/app/(components)/(content-layout)/medical/actions/symptom";
import SymptomForm from "@/app/(components)/(content-layout)/medical/components/Dashboard/SymptomForm";
import React from "react";

export default async function page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const symptom = (await getSymptomBySlug(slug))?.data;
  return (
    <div>
      {symptom && symptom.id && (
        <SymptomForm title="Update Symptom" initialData={symptom} />
      )}
    </div>
  );
}
