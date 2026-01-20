import PageTitle from "../../../../components/page-title";
import React from "react";
import PropertiesForm from "../_components/properties-form";
import db from "@/app/lib/db";
import { Property } from "@prisma/client";
import { validateRequest } from "@/app/auth";


async function CreatePropertyPage({ searchParams }: { searchParams: any }) {
  const {user} = await validateRequest();
  const cloneFrom = searchParams?.cloneFrom || "";
  let property: Property | null = null;
  if (cloneFrom) {
    property = (await db.property.findUnique({
      where: {
        id: cloneFrom,
      },
    })) as Property;
  }

  // check user subscription and properties count

  const [userSubscription, propertiesCount] = (await Promise.all([
    db.subscriptionEstate.findFirst({
      where: {
        userId: user?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.property.count({
      where: {
        userId: user?.id,
      },
    }),
  ])) as any;

  let showForm = true;
  let errorMessage = "";
  if (!userSubscription && propertiesCount >= 3) {
    showForm = false;
    errorMessage =
      "You have reached the maximum number of properties (3), please upgrade your subscription to add more properties";
  }

  if (userSubscription?.plan.propertiesCount >= propertiesCount) {
    showForm = false;
    errorMessage = `You have reached the maximum number of properties ${userSubscription?.plan.propertiesCount} , please upgrade your subscription to add more properties`;
  }

  return (
    <div>
      <PageTitle title="Create Property" />
      {showForm ? (
        <PropertiesForm initialValues={property ? property : {}} />
      ) : (
        <span className="text-sm text-gray-600">{errorMessage} </span>
      )}
    </div>
  );
}

export default CreatePropertyPage;
