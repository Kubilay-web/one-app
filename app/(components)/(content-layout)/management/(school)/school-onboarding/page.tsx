import { validateRequest } from "@/app/auth";
import { getServerUser } from "../../actions/auth";
import SchoolOnboardingForm from "../../components/dashboard/forms/school/school-onboarding-form";

import { Card, CardContent } from "../../components/ui/card";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  
  
  
  const {user} = await validateRequest();



  // const role = user?.role;

  
  // if (!user || role !== "SUPER_ADMIN") {
  //   redirect("/login");
  // }



  return (
    <div className="max-w-2xl mx-auto p-16">
      <Card className="border-t-4 border-blue-600 shadow">
        <CardContent className="p-3">
          <SchoolOnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
}
