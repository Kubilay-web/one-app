import CartContainer from "@/app/projects/components/store/cart-page/container";
import Header from "@/app/projects/components/store/layout/header/header";
import { Country } from "@prisma/client";
import { cookies } from "next/headers";

export default function CartPage() {
  const cookieStore = cookies();
  const userCountryCookie = cookieStore.get("userCountry");

  let userCountry: Country = {
    name: "United States",
    city: "",
    code: "US",
    region: "",
  };

  if (userCountryCookie) {
    userCountry = JSON.parse(userCountryCookie.value) as Country;
  }
  return (
    <>
      <Header />
      <CartContainer userCountry={userCountry} />
    </>
  );
}
