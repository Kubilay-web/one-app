

import { getServiceBySlug } from "@/app/(components)/(content-layout)/medical/actions/services";
import ServiceForm from "@/app/(components)/(content-layout)/medical/components/Dashboard/ServiceForm";
import React from "react";

export default async function page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const service = (await getServiceBySlug(slug))?.data;
  return (
    <div>
      {service && service.id && (
        <ServiceForm title="Update Service" initialData={service} />
      )}
    </div>
  );
}
