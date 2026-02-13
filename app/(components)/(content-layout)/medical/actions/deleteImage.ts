"use server";

import cloudinary from "@/app/lib/cloudinary";
import db from "@/app/lib/db";
import { getCloudinaryPublicId } from "../utils/getCloudinaryPublicId";

export async function deleteDoctorProfileImage(userId: string) {
  // 1️⃣ DoctorProfile'ı bul
  const doctorProfile = await db.doctorProfile.findUnique({
    where: { userId },
  });

  if (!doctorProfile?.profilePicture) return;

  // 2️⃣ URL'den public_id çıkar
  const publicId = getCloudinaryPublicId(doctorProfile.profilePicture);

  if (!publicId) return;

  // 3️⃣ Cloudinary'den sil
  await cloudinary.uploader.destroy(publicId);

  // 4️⃣ DB'den sil
  await db.doctorProfile.update({
    where: { userId },
    data: {
      profilePicture: null,
    },
  });
}
