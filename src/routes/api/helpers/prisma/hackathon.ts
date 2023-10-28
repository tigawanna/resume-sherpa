import { z } from "zod";
import { prismaApiWrapper } from "./prismaApiWrapper";

export const HackathonSchema = z.object({
    id: z.string().uuid().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    from: z.coerce.date(),
    to: z.coerce.date(),
    link: z.string(),
    userId: z.string(),
})

export type THackathonInputType = z.infer<typeof HackathonSchema>

// export const hackathonApi = {


//     getAll:async({user_id}:{user_id:string}) => {
//             return prisma.hackathon.findMany({ where: { userId:user_id } });
//         },
//     getOne: ({ id, user_id }: { id:string ; user_id: string; }) => {
//             return prisma.hackathon.findUnique({ where: { id:id, userId:user_id } });
//         },

//     addNew: ({ input }: { input: THackathonInputType; }) => {
//             return prisma.hackathon.create({ data: input });
//         },

//     updateOne: ({ input,user_id }: { input: THackathonInputType;user_id:string }) => {
//             return prisma.hackathon.update({ where: { id: input.id, userId:user_id }, data: input });
//     },

//     removeOne: ({ input,user_id }: { input: THackathonInputType,user_id:string }) => {
//             return prisma.hackathon.delete({ where: { id: input.id, userId:user_id } });
//         },

//     removeAll: async ({ user_id }: { user_id:string }) => {
//             return prisma.hackathon.deleteMany({
//                 where: { userId: user_id },
//             });
//         }


// }

export const hackathonApi = prismaApiWrapper<THackathonInputType>("hackathon")

