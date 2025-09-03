import AddressContainer from "@/app/projects/components/store/profile/addresses/container";
import db from "@/app/lib/db";
import { getUserShippingAddresses } from "@/app/queries/user";

export default async function ProfileAddressesPage() {
  const addresses = await getUserShippingAddresses();
  const countries = await db.country.findMany();
  return (
    <div>
      <AddressContainer addresses={addresses} countries={countries} />
    </div>
  );
}
