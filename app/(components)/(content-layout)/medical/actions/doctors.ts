"use server";

import db  from "@/app/lib/db";
import { Doctor } from "../types/types";
import generateSlug from "../utils/generateSlug";



type ServiceProps = {
  title: string;
  slug: string;
  id?: string;
};
export type DataProps = {
  doctors: Doctor[] | undefined;
  services: ServiceProps[];
};
export async function getDoctorsByServiceSlug(slug: string) {
  try {
    if (slug) {
      let doctors: any[] | undefined = [];
      let services: ServiceProps[] = [];
      const service = await db.service.findUnique({
        where: {
          slug,
        },
        include: {
          doctorProfiles: {
            include: {
              availability: true,
            },
          },
        },
      });
      doctors = service?.doctorProfiles.map((doc) => {
        return {
          id: doc.userId,
          name: `${doc.firstName} ${doc.lastName} `,
          email: doc.email ?? "",
          phone: doc.phone ?? "",
          slug: generateSlug(`${doc.firstName} ${doc.lastName} `),
          doctorProfile: doc,
        };
      });
      services = await db.service.findMany({
        where: {
          id: {
            not: service?.id,
          },
        },
      });
      const data: DataProps = {
        doctors,
        services,
      };
      return data as DataProps;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getDoctorsBySpecialtySlug(slug: string) {
  try {
    if (slug) {
      let doctors: any[] | undefined = [];
      let services: ServiceProps[] = [];
      const service = await db.speciality.findUnique({
        where: {
          slug,
        },
        include: {
          doctorProfiles: {
            include: {
              availability: true,
            },
          },
        },
      });
      doctors = service?.doctorProfiles.map((doc) => {
        return {
          id: doc.userId,
          name: `${doc.firstName} ${doc.lastName} `,
          email: doc.email ?? "",
          phone: doc.phone ?? "",
          slug: generateSlug(`${doc.firstName} ${doc.lastName} `),
          doctorProfile: doc,
        };
      });
      services = await db.speciality.findMany({
        where: {
          id: {
            not: service?.id,
          },
        },
      });
      const data: DataProps = {
        doctors,
        services,
      };
      return data as DataProps;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getDoctorsBySymptomId(symptomId: string) {
  try {
    if (symptomId) {
      let doctors: any[] | undefined = [];
      let services: ServiceProps[] = [];
      const doctorProfiles = await db.doctorProfile.findMany({
        where: {
          symptomIds: {
            has: symptomId, // This checks if symptomIds array contains the symptomId
          },
        },
        include: {
          availability: true,
        },
      });
      doctors = doctorProfiles.map((doc) => {
        return {
          id: doc.userId,
          name: `${doc.firstName} ${doc.lastName} `,
          email: doc.email ?? "",
          phone: doc.phone ?? "",
          slug: generateSlug(`${doc.firstName} ${doc.lastName} `),
          doctorProfile: doc,
        };
      });
      services = await db.symptom.findMany({
        where: {
          id: {
            not: symptomId,
          },
        },
      });
      const data: DataProps = {
        doctors,
        services,
      };
      return data as DataProps;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getDoctorsBySearch(query: string) {
  if (query) {
    const services = await db.service.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        _count: {
          select: {
            doctorProfiles: true,
          },
        },
      },
    });
    const symptoms = await db.symptom.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
    });
    const specialties = await db.speciality.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
        ],
      },
    });
    const doctorProfiles = await db.doctorProfile.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { servicesOffered: { hasSome: [query] } },
        ],
      },
      include: {
        availability: true,
      },
    });
    const doctors = doctorProfiles.map((doc) => {
      return {
        id: doc.userId,
        name: `${doc.firstName} ${doc.lastName} `,
        email: doc.email ?? "",
        phone: doc.phone ?? "",
        slug: generateSlug(`${doc.firstName} ${doc.lastName} `),
        doctorProfile: doc,
      };
    });
    return {
      services,
      specialties,
      symptoms,
      doctors,
    };
  }
}
