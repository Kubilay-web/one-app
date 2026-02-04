
import Subscribers from "../../components/dashboard/Subscribers";
import { getUserSubscribers } from "../../actions/subscribe";

import React from "react";
import { validateRequest } from "@/app/auth";

export default async function page() {
  const {user} = await validateRequest();
  const subscribers = (await getUserSubscribers(user?.id ?? "")) || [];

  return (
    <div className="max-w-3xl p-8">
      <Subscribers subscribers={subscribers} />
    </div>
  );
}
