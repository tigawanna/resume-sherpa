import { auth } from "@/lib/auth/lucia/lucia";
import { json } from "@hattip/response";
import { RequestContext } from "rakkasjs";

export async function get(ctx: RequestContext) {
  const request = ctx.request;
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
  if (session) {
    return json(session, {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }
  return json(null, {
    status: 400,
    headers: {
      "content-type": "application/json",
    },
  });
}
