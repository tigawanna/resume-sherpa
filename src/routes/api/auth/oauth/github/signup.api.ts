import { auth } from "@/lib/auth/lucia/lucia";
import { json } from "@hattip/response";
import { RequestContext } from "rakkasjs";

export async function get(ctx: RequestContext) {
  try {
    const request = ctx.request;
    const authRequest = auth.handleRequest(request);
    const session = await authRequest.validate();
    if (session) {
      // redirect to profile page
      return json(session, {
        headers: {
          Location: "/",
        },
        status: 302,
      });
    }
  } catch (error: any) {
    return json(
      {
        error,
        message: `error logging in with github${error.message}`,
      },
      {
        status: 400,
      }
    );
  }
}
