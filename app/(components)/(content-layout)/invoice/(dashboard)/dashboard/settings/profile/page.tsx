
import UserProfileForm from "../../../../components/Forms/UserProfileForm";


import { getUserById } from "../../../../actions/users";

import { Suspense } from "react";
import ProfileSettingsLoading from "./ProfileSettingsLoading";
import { validateRequest } from "@/app/auth";

export default async function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSettingsLoading />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const {user} = await validateRequest();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const userDetails = await getUserById(user.id);

  const userProfile = {
    id: userDetails?.id ?? "",
    firstName: userDetails?.firstName ?? "",
    lastName: userDetails?.lastName ?? "",
    email: userDetails?.email ?? "",
    phone: userDetails?.phone ?? "",
    jobTitle: userDetails?.jobTitle ?? "",
    image: userDetails?.image ?? "",
  };

  return (
    <div>
      <UserProfileForm currentUser={userProfile} />
    </div>
  );
}
