import { SherpaUserResponse } from "@/lib/pb/db-types";
import { RequestContext } from "rakkasjs";

export async function canProompt(
  ctx: RequestContext,
  type: "letter" | "resume",
): Promise<{
  can_proompt: boolean;
  can_proompt_after: number;
}> {
  try {
    // return {
    //   can_proompt: true,
    //   can_proompt_after: 0,
    // };
    const user = ctx.locals.pb?.authStore.model as SherpaUserResponse;
    if (type === "letter") {
     
        const last_letter_on = user.last_letter_on ? new Date(user.last_letter_on): new Date();
        const last_letter_on_hour = user.last_letter_on?last_letter_on.getHours():3
        const this_hour = new Date().getHours();
          if (last_letter_on_hour <= this_hour - 3) {
          try {
            await ctx.locals.pb?.collection("sherpa_user").update(user.id, {
              last_letter_on: new Date(),
            });
            // console.log(" ================ updated last letter on =============",updated_user)
            return {
              can_proompt: true,
              can_proompt_after: 0,
            };
          } catch (error) {
            console.log("error updating last letter on", error);
            return {
              can_proompt: false,
              can_proompt_after: 1,
            };
          }
        } else {
          return {
            can_proompt: false,
            can_proompt_after: this_hour - last_letter_on_hour + 3,
          };
        
      }
    }
    if (type === "resume") {
      const last_resume_on = user.last_resume_on
        ? new Date(user.last_resume_on)
        : new Date();
        const last_resume_on_hour = user.last_resume_on?last_resume_on.getHours():3
      
        const this_hour = new Date().getHours();
        if (last_resume_on_hour <= this_hour - 3) {
        try {
          await ctx.locals.pb?.collection("sherpa_user").update(user.id, {
            last_resume_on: new Date(),
          });
          console.log(" ================ updated last resume on =============")
          return {
            can_proompt: true,
            can_proompt_after: 0,
          };
        } catch (error) {
          console.log("error updating last resume on", error);
          return {
            can_proompt: false,
            can_proompt_after: 1,
          };
        }
      } else {
        return {
          can_proompt: false,
          can_proompt_after: this_hour - last_resume_on_hour + 3,
        };
      }
    }

    return {
      can_proompt: false,
      can_proompt_after: 1,
    };
  } catch (error) {
    console.log("error updating last resume on", error);
    return {
      can_proompt: false,
      can_proompt_after: 1,
    };
  }
}
