import { z } from "zod"
import { prismaApiWrapper } from "./prismaApiWrapper"
import { prisma } from "@/lib/db/prisma"

export const ExperienceSchema = z.object({
    id: z.string().uuid().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    position: z.string(),
    company: z.string(),
    from: z.coerce.date(),
    to: z.coerce.date(),
    description: z.string().nullable(),
    userId: z.string(),
})

export type TExperienceInputType = z.infer<typeof ExperienceSchema>



// interface ISearchForExperiencePros{
// userId:string;
// keyword:string;
// }
// async function searchForExperience({keyword,userId}: ISearchForExperiencePros){
//     try {
  
//         return (
//             await prisma.experience.findMany({
//                 where: {
//                 userId,
//                     AND: [
//                         {
//                             OR: [
//                                 { description: { contains: keyword, mode: "insensitive" } },
//                                 { company: { contains: keyword, mode: "insensitive" } }
//                             ]
//                         }
//                     ]
//                 },
//                 take: 10,
//             }));
//     } catch (error: any) {
//         // console.log("error lloking up by name \n VARS ===== ", {
//             keyword,
//             userId,
//         });
//         // console.log("===== ERROR mESSAGE======", error.message);
//         // console.log("==== FULL ERROR ======", error);
//         return {
//             error: {
//                 message: error.message,
//                 original_error: error,
//             },
//         };
//     }
// }

export const experienceApi = prismaApiWrapper<TExperienceInputType>("experience")

