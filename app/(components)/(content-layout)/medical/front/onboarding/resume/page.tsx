// import { getUserById } from "@/actions/users";
// import VerifyTokenForm from "@/components/VerifyTokenForm";




import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";


import TrackingForm from "../../../components/Frontend/TrackingForm";





import { redirect } from "next/navigation";
import { validateRequest } from "@/app/auth";

export default async function VerifyTrackingNumber() {
  const {user} = await validateRequest();
  const id = user?.id;
  if (id) {
    redirect(`/medical/onboarding/${id}`);
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Resume your Application</CardTitle>
          <CardDescription>
            Please enter the 10-Character Trucking number that was given to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrackingForm />
        </CardContent>
      </Card>
    </div>
  );
}
