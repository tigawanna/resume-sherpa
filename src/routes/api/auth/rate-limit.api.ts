import { auth } from '@/lib/auth/lucia/lucia';
import { prisma } from '@/lib/db/prisma';
import { json } from '@hattip/response';
import { RequestContext } from 'rakkasjs';

export async function post(ctx: RequestContext) {
  try {
    const body = await ctx.request.json();
    const user_id = body?.user_id;
    const type = body?.type as "resume"|"letter"
    if(!type){
      throw new Error('what is your proompt type?');
    }
    if (!user_id) {
      throw new Error('user_id not found');
    }
    const user = (await auth.getUser(user_id)) as LuciaUser;
    if (!user) {
      throw new Error('user not found');
    }

//  type resume
   if(type === "resume"){
     if (user?.last_resume_on) {
       const last_resume_on = new Date(user.last_resume_on);
       const last_resume_on_hour = last_resume_on.getHours();

       const this_hour = new Date().getHours();
       // console.log({ last_resume_on, last_resume_on_hour, this_hour });

       if (last_resume_on_hour + 3 > this_hour) {
         // console.log("TO BE RATE LIMITED");
         return json({
           error: {
             message: `try again in ${last_resume_on_hour + 3 - this_hour} hours`,
             original_error: new Error(`try again in ${last_resume_on_hour + 3 - this_hour} hours`),
           },
         });
       } else {
         // console.log("WITHIN LIMITS");
         return await updateLastProomptedOn(user_id,"resume");
       }
     }
     else {
       // console.log("WITHIN LIMITS");
       return await updateLastProomptedOn(user_id,"resume");

     }
   }
//  type letter
    if (type === "letter") {
      if (user?.last_letter_on) {
        const last_letter_on = new Date(user.last_letter_on);
        const last_letter_on_hour = last_letter_on.getHours();

        const this_hour = new Date().getHours();
        // console.log({ last_letter_on, last_letter_on_hour, this_hour });
      // TODO : chage back to +3 hours
        if (last_letter_on_hour + 3 > this_hour) {
          // console.log("TO BE RATE LIMITED");
          return json({
            error: {
              message: `try again in ${last_letter_on_hour + 3 - this_hour} hours`,
              original_error: new Error(`try again in ${last_letter_on_hour + 3 - this_hour} hours`),
            },
          });
        } else {
          // console.log("WITHIN LIMITS");
          return await updateLastProomptedOn(user_id,"letter");
        }
      }
      else {
        // console.log("WITHIN LIMITS");
        return await updateLastProomptedOn(user_id,"letter");

      }
    }


  } catch (error: any) {
    return json(
      {
        error: {
          message: 'error validating lucia user:' + error.message,
          original_error: error,
        },
      },
      { status: 400 },
    );
  }
}


export async function updateLastProomptedOn(userId:string,type:"letter"|"resume"){
try {
  if(type==="resume"){
    return prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          last_resume_on: new Date().toString(),
        },
      })
      .then((user) => {
        return json(user, {
          status: 200,
        });
      })
      .catch((error) => {
        throw error
      });
  }
  if(type==="letter"){
    return prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          last_letter_on: new Date().toString(),
        },
      })
      .then((user) => {
        return json(user, {
          status: 200,
        });
      })
      .catch((error) => {
        throw error
      });
  }

} catch (error) {
    throw error
}
}
