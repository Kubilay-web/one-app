import Footer from "@/app/projects/components/footer/page";
import CartContainer from "@/app/projects/components/store/cart-page/container";
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

      <CartContainer userCountry={userCountry} />
      <Footer/>
    </>
  );
}
