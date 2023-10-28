
import { z } from "zod";
import { prismaApiWrapper } from "./prismaApiWrapper";

export const ContentTypeSchema = z.enum(['Video', 'Blog', 'Gist', 'Podcast']);
export const ContentSchema = z.object({
  type: ContentTypeSchema,
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  title: z.string(),
  content_url: z.string(),
  userId: z.string().nullable(),
})

export type TContentInputType = z.infer<typeof ContentSchema>

export const contentApi = prismaApiWrapper<TContentInputType>("content")


