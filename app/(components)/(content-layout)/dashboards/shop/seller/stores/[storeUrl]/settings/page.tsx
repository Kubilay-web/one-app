import db from "@/app/lib/db"; // If you exported directly from db.ts
import StoreDetails from "@/app/projects/components/dashboard/forms/store-details";
import { redirect } from "next/navigation";

export default async function SellerStoreSettingsPage({
  params,
}: {
  params: { storeUrl: string };
}) {
  // Log the params for debugging
  console.log("params", params);

  // Fetch store details based on storeUrl
  const storeDetails = await db.store.findUnique({
    where: { url: params.storeUrl },
  });

  if (!storeDetails) redirect("/dashboard/seller/stores");

  return (
    <div>
      {/* Pass the fetched store details to the StoreDetails component */}
      <StoreDetails data={storeDetails} />
    </div>
  );
}
