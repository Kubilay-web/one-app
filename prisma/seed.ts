import { PrismaClient, RoleMedical, DoctorStatus } from "@prisma/client";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

async function main() {
  const service = await prisma.service.findFirst();
  const speciality = await prisma.speciality.findFirst();

  for (let i = 1; i <= 10; i++) {
    const userId = new ObjectId().toHexString();

    // User oluştur
    const user = await prisma.user.create({
      data: {
        id: new ObjectId().toHexString(),
        username: `doctor${i}`,
        email: `doctor${i}@example.com`,
        password: "hashedpassword",
        rolemedical: RoleMedical.DOCTOR,
        isVerfied: true,
        status: true,
        googleId: `google-doctor${i}`, // unique olmalı
        name: `Doctor ${i} Name`,
        localCurrency: "UGX",
        defaultCurrency: "UGX",
        slug: `doctor-${i}`,
        phone: `+2567000000${i}`,
        reputation: 0,
        isActive: true,
      },
    });

    // DoctorProfile oluştur

    await prisma.doctorProfile.create({
  data: {
    id: new ObjectId().toHexString(),
    userId: user.id,
    trackingNumber: `DOC-${1000 + i}`,
    status: DoctorStatus.APPROVED,
    firstName: `Doctor${i}`,
    lastName: `Lastname${i}`,
    middleName: `Middle${i}`,
    dob: new Date(1980 + i, i % 12, i),
    gender: i % 2 === 0 ? "Female" : "Male",
    page: `doctor${i}-page`,
    profilePicture: `https://placekitten.com/200/200?image=${i}`,
    bio: "Experienced medical doctor with years of practice.",
    medicalLicense: `ML-${1000 + i}`,
    medicalLicenseExpiry: new Date(2030, 0, i),
    yearsOfExperience: 3 + i,
    email: user.email,
    phone: user.phone,
    country: "Uganda",
    city: "Kampala",
    state: "Central",
    medicalSchool: `Medical School ${i}`,
    graduationYear: `${2000 + i}`,
    primarySpecialization: speciality?.title || "General",
    otherSpecialties: ["Cardiology", "Neurology"],
    boardCertificates: ["Board1", "Board2"],
    hospitalName: `Hospital ${i}`,
    hospitalAddress: `Street ${i}, Kampala`,
    hospitalContactNumber: `+256700000${i}`,
    hospitalEmailAddress: `hospital${i}@example.com`,
    hospitalWebsite: `https://hospital${i}.com`,
    hospitalHoursOfOperation: 8,
    servicesOffered: service ? [service.title] : [],
    insuranceAccepted: "All",
    educationHistory: `Graduated from Medical School ${i}`,
    research: `Research focus ${i}`,
    accomplishments: `Accomplishment ${i}`,
    additionalDocs: [],
    operationMode: "Telehealth visit",
    hourlyWage: 100 + i * 10,
    serviceId: service?.id,
    specialtyId: speciality?.id,
    symptomIds: [],
    availability: {
      create: {       // <-- Burada nested create!
        monday: ["09:00", "10:00", "11:00"],
        tuesday: ["10:00", "12:00"],
        wednesday: ["14:00", "16:00"],
        thursday: ["09:00", "11:00"],
        friday: ["13:00", "15:00"],
        saturday: [],
        sunday: [],
      },
    },
  }, // <-- data objesi burada kapanıyor
}); // <-- create fonksiyonu burada kapanıyor

 
  }

  console.log("✅ 10 doctors seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
