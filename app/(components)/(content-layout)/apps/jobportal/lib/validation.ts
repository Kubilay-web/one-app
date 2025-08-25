import { z } from "zod";
import { jobTypes, locationTypes } from "./job-types";

const requiredString = z.string().min(1, "Required");

// Application fields validation
const applicationSchema = z
  .object({
    apply_email: z.string().email().max(100).optional().or(z.literal("")),
    apply_url: z.string().url().max(100).optional().or(z.literal("")),
  })
  .refine((data) => data.apply_email || data.apply_url, {
    message: "Email or URL is required",
    path: ["apply_email"],
  });

// Main job schema

export const createJobSchema = z
  .object({
    title: z.string().min(1, "Required").max(100),
    jobType: z
      .string()
      .refine((value) => jobTypes.includes(value), "Invalid job type"),
    companyName: z.string().min(1, "Required").max(100),
    vacancies: z
      .string()
      .regex(/^\d+$/, "Must be a number"),
    description: z.string().max(5000).optional(),
    apply_email: z.string().email().max(100).optional().or(z.literal("")),
    apply_url: z.string().url().max(100).optional().or(z.literal("")),
    cityId: z.string().optional(),
    locationType: z
      .string()
      .refine((value) => locationTypes.includes(value), "Invalid location type")
      .optional(),
  })
  .refine((data) => data.apply_email || data.apply_url, {
    message: "Email or URL is required",
    path: ["apply_email"],
  });


export type CreateJobValues = z.infer<typeof createJobSchema>;
