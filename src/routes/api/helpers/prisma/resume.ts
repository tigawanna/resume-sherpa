
import { z } from "zod";
import { prismaApiWrapper } from "./prismaApiWrapper";


export const ResumeSchema = z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  body: z.string(),
  jobAplicationId: z.string().optional(),
  userId: z.string(),
})

export type TResumeInputType = z.infer<typeof ResumeSchema>

export const resumeApi= prismaApiWrapper<TResumeInputType>("resume")
