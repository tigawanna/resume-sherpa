import { z } from "zod";
import { prismaApiWrapper } from "./prismaApiWrapper";

export const InternshipSchema = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),

  description: z.string(),
  from: z.coerce.date(),
  to: z.coerce.date(),
  role: z.string(),
  company: z.string(),
  userId: z.string(),
})

export type TInternshipInputType = z.infer<typeof InternshipSchema>

export const internshipApi = prismaApiWrapper<TInternshipInputType>("internship")

