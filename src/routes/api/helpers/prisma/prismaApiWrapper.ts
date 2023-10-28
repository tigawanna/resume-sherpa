import { prisma } from "@/lib/db/prisma";
import{ PrismaClient, type Prisma } from "@prisma/client";
import async from "react-select/dist/declarations/src/async/index";

const model_keys = [
  "education",
  "experience",
  "project",
  "hackathon",
  "user",
  "content",
  "internship",
  "jobApplication",
  "resume",
] as const;


export function prismaApiWrapper<T>(model:keyof typeof prisma) {
  
  const prisma_model = prisma[model]

  const api = {
    getAll: async ({ user_id }: { user_id: string }) => {
      try {
        // @ts-expect-error
        return (await prisma_model.findMany({
          where: { userId: user_id },
        })) as T[];
      } catch (error: any) {
        // console.log("error getting all \n VARS ===== ", { user_id });
        // console.log("===== ERROR mESSAGE======", error.message);
        // console.log("==== FULL ERROR ======", error);
        return {
          error: {
            message: error.message,
            original_error: error,
          },
        };
      }
    },
    getOne: async ({
      item_id,
      user_id,
    }: {
      item_id: string;
      user_id: string;
    }) => {
      try {
        // @ts-expect-error
        return (await prisma_model.findUnique({
          where: { id: item_id, userId: user_id },
        })) as T;
      } catch (error: any) {
        // console.log("error getting one \n VARS ===== ", { item_id, user_id });
        // console.log("===== ERROR mESSAGE======", error.message);
        // console.log("==== FULL ERROR ======", error);
        return {
          error: {
            message: error.message,
            original_error: error,
          },
        };
      }
    },
    getCount: async({user_id}:{user_id:string})=>{
      try {
        // @ts-expect-error
        return (await prisma_model.count({
          where: {userId: user_id },
        })) as number
      } catch (error: any) {
        // console.log("error counting records \n VARS ===== ", {user_id });
        // console.log("===== ERROR mESSAGE======", error.message);
        // console.log("==== FULL ERROR ======", error);
        return {
          error: {
            message: error.message,
            original_error: error,
          },
        };
      }
    },
    findByName: async ({
      item_name,
      user_id,
    }: {
      item_name: string;
      user_id: string;
    }) => {
      try {
        return (
          // @ts-expect-error
          await prisma_model.findMany({
          where: {
            userId: user_id,
            name: {
              contains: item_name,
              mode: "insensitive",
            },
          },
          take: 10,
        })) as T[];
      } catch (error: any) {
        // console.log("error lloking up by name \n VARS ===== ", {item_name,user_id,});
        // console.log("===== ERROR mESSAGE======", error.message);
        // console.log("==== FULL ERROR ======", error);
        return {
          error: {
            message: error.message,
            original_error: error,
          },
        };
      }
    },
    findByField: async ({fields,user_id,keyword}: {
    user_id: string;
    keyword:string;
    fields:Array<keyof T>
    }) => {
      
      try {
      
        // const fields_to_search = fields.reduce((acc:any, field:any) => {
        //   // console.log("field",field)
        //   acc[field] = {
        //     mode: "insensitive",
        //     contains: keyword,
        //   }
        //   return acc;
        // },{})
        const fields_to_search_array = fields.map((item)=>{
          return {
            [item]: {
              mode: "insensitive",
              contains: keyword,
            }
            }
        })
 
        // @ts-expect-error
        return (await prisma_model.findMany({
          where: {
            userId: user_id,
            AND: [
              {
                OR:fields_to_search_array
              }
            ]
      
            },
          take: 10,
        })) as T[];
      } catch (error: any) {
        // console.log("error looking up by fields  \n VARS ===== ", {fields,user_id,});
        // console.log("===== ERROR mESSAGE======", error.message);
        // console.log("==== FULL ERROR ======", error);
        return {
          error: {
            message: error.message,
            original_error: error,
          },
        };
      }
    },

    addNew: async ({ input }: { input: T }) => {
      try {
        // @ts-expect-error
        return (await prisma_model.create({ data: input })) as T;
      } catch (error: any) {
        // console.log("error adding new \n VARS ===== ", { input });
        // console.log("===== ERROR mESSAGE======", error.message);
        // console.log("==== FULL ERROR ======", error);
        return {
          error: {
            message: error.message,
            original_error: error,
          },
        };
      }
    },

    updateOne: async ({ input, user_id }: { input: Partial<T>&{ id: string}; user_id: string }) => {
      try {
        if(!input?.id){
          return {
            error: {
              message: "id is required",
              original_error: new Error("id is required"),
            },
          };
        }
        // @ts-expect-error
        return (await prisma_model.update({
        where: { id: input.id, userId: user_id },
          data: input,
        })) as T;
      } catch (error: any) {
        // console.log("error updating \n VARS ===== ", { input ,user_id });
        // console.log("===== ERROR mESSAGE======", error.message);
        // console.log("==== FULL ERROR ======", error);
        return {
          error: {
            message: error.message,
            original_error: error,
          },
        };
      }
    },

    removeOne: async ({
      item_id,
      user_id,
    }: {
      item_id: string;
      user_id: string;
    }) => {
      try {
        // @ts-expect-error
        return (await prisma_model.delete({
          where: { id: item_id, userId: user_id },
        })) as T;
      } catch (error: any) {
        // console.log("error removing one \n VARS ===== ", { item_id, user_id });
        // console.log("===== ERROR mESSAGE======", error.message);
        // console.log("==== FULL ERROR ======", error);

        return {
          error: {
            message: error.message,
            original_error: error,
          },
        };
      }
    },

    removeAll: async ({ user_id }: { user_id: string }) => {
      try {
        // @ts-expect-error
        return (await prisma_model.deleteMany({
          where: { userId: user_id },
        })) as Prisma.PrismaPromise<Prisma.BatchPayload>;
      } catch (error: any) {
        // console.log("error removing all \n VARS ===== ", { user_id });
        // console.log("===== ERROR mESSAGE======", error.message);
        // console.log("==== FULL ERROR ======", error);
        return {
          error: {
            message: error.message,
            original_error: error,
          },
        };
      }
    },
  };
  return api;
}
