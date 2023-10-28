import { z } from "zod";
import { prismaApiWrapper } from "./prismaApiWrapper";


export const QualificationSchema = z.enum(['Certificate', 'Bachelors', 'Masters', 'PhD']);
export const EducationSchema = z.object({
  qualification: QualificationSchema,
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  school: z.string(),
  field: z.string(),
  from: z.coerce.date(),
  to: z.coerce.date(),
  userId: z.string(),
})

export type TEducationInputType = z.infer<typeof EducationSchema>

export const educationApi = prismaApiWrapper<TEducationInputType>("education")

