import { validateRequest } from "@/app/auth";
import React from "react";
import MeetingPage from "../../../components/hms/MeetingPage";

export default async function page({
  params: { roomId },
}: {
  params: { roomId: string };
}) {



  return (
    <div>
      <MeetingPage roomId={roomId} />
    </div>
  );
}
