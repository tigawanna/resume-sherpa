import { SherpaResumeResponse, SherpaUserResponse } from "@/lib/pb/db-types";
import { json } from "@hattip/response";
import { RequestContext } from "rakkasjs";

export default async function authenticate(ctx: RequestContext) {
try {
    if (!ctx.locals.pb?.authStore.isValid){
        console.log("is not valid")
        throw new Error("invalid credentials");
    }
    const pb_user = await ctx.locals.pb?.collection('sherpa_user').authRefresh<SherpaUserResponse>();
    if(!pb_user.record.verified){
        throw new Error("invalid credentials");
    }
    } catch (_) {
    ctx.locals.pb?.authStore.clear();
    const new_pb_auth_cookie  = ctx.locals.pb?.authStore.exportToCookie({ httpOnly: false });
        return json({
            data: null,
            error: {
                message: "invalid credentials",
                original_error: new Error("invalid credentials"),
            },
        },{
            status: 401,
            headers:{
                "Set-Cookie": new_pb_auth_cookie
            },
    
        })
    }
}
