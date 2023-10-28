import { z } from "zod";
import { prismaApiWrapper } from "./prismaApiWrapper";

export const JobApplicationSchema = z.object({
    id: z.string().uuid().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),

    job_title: z.string(),
    description: z.string(),
    job_posting_url: z.string(),
    cover_letter: z.string(),
    resume: z.string(),
    userId: z.string(),

    
    resumeId: z.string().nullable(),
});

export type TJobApplicationInputType = z.infer<typeof JobApplicationSchema>;
export const jobApplicationApi = prismaApiWrapper<TJobApplicationInputType>("jobApplication")
