import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prismaApiWrapper } from "./prismaApiWrapper";

export const ProjectSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  name: z.string(),
  description: z.string(),
  repoUrl: z.string(),
  image_url: z.string().optional(),
  languages: z.array(z.string()),
  libraries: z.array(z.string()),
  userId: z.string().optional(),
});

export type TProjectInputType = z.infer<typeof ProjectSchema>;

export const projectApi = prismaApiWrapper<TProjectInputType>("project")

// interface IGetAllProjectsProps {
//   userId: string;
// }
// export async function getAllProjects({ userId }: IGetAllProjectsProps) {
//   try {
//     return await prisma.project.findMany({
//       where: {
//         userId,
//       },
//     });
//   } catch (error: any) {
//     return {
//       error: {
//         message: error.message,
//         original_error: error,
//       },
//     };
//   }
// }

// export interface ISearchProjectsProps {
//   userId: string;
//   keyword: string;
// }
// export async function searchForProject({
//   userId,
//   keyword,
// }: ISearchProjectsProps) {
//   try {
//     return await prisma.project.findMany({
//       where: {
//         userId,
//         name: {
//           contains: keyword,
//           mode: "insensitive",
//         },
//       },
//       take: 10,
//     });
//   } catch (error: any) {
//     return {
//       error: {
//         message: error.message,
//         original_error: error,
//       },
//     };
//   }
// }
// export interface IGetProjectByIdProps {
//   id: string;
// }
// export async function getProjectById({ id }: IGetProjectByIdProps) {
//   try {
//     return await prisma.project.findUnique({ where: { id } });
//   } catch (error: any) {
//     // console.log("error getting project by id  =========  ", error);
//     return {
//       error: {
//         message: error.message,
//         original_error: error,
//       },
//     };
//   }
// }

// export interface IRemoveProjectProps {
//   id: string;
// }
// export async function addNewProject(input: TProjectInputType) {
//   try {
//     return await prisma.project.create({ data: input });
//   } 
//   catch (error: any) {
//     return {
//       error: {
//         message: error.message,
//         original_error: error,
//       },
//     };
//   }
// }

// export interface IUpdateProjectProps {
//   id: string;
//   input: TProjectInputType;
// }
// export async function updateProject(input: TProjectInputType) {
//   try {
//     return await prisma.project.update({
//       where: { id: input.id },
//       data: input,
//     });
//   } catch (error: any) {
//     return {
//       error: {
//         message: error.message,
//         original_error: error,
//       },
//     };
//   }
// }

// export interface IRemoveProjectProps {
//   id: string;
//   userId: string;
// }
// export async function removeProject({ id, userId }: IRemoveProjectProps) {
//   try {
//     return await prisma.project.delete({ where: { id, userId } });
//   } catch (error: any) {
//     return {
//       error: {
//         message: error.message,
//         original_error: error,
//       },
//     };
//   }
// }

// export async function removeAllProjects() {
//   try {
//     return await prisma.project.deleteMany();
//   } catch (error: any) {
//     return {
//       error: {
//         message: error.message,
//         original_error: error,
//       },
//     };
//   }
// }

// export const projectApi = {
//   getAllProjects,
//   searchForProject,
//   getProjectById,
//   addNewProject,
//   updateProject,
//   removeProject,
//   removeAllProjects,
// };
