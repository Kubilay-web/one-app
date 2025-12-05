import { validateRequest } from "@/app/auth";
import Preloader from "./components/Preloader";
import UserHome from "./components/UserHome";
import { Suspense } from "react";

export default async function Home() {
  const { user } = await validateRequest();


  return (
    <div className="">
      {user && (
        <Suspense fallback={<Preloader />}>
          <UserHome />
        </Suspense>
      )}
    </div>
  );
}
