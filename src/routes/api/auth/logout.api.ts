import { auth } from "@/lib/auth/lucia/lucia";
import { json } from "@hattip/response";
import { RequestContext } from "rakkasjs";

export async function post(ctx: RequestContext) {
  const request = ctx.request;
  const authRequest = auth.handleRequest(request);
  // check if user is authenticated
  const session = await authRequest.validate(); // or `authRequest.validateBearerToken()`
  if (!session) {
    return json("Unauthorized", {
      status: 401,
    });
  }
  // make sure to invalidate the current session!
  await auth.invalidateSession(session.sessionId);
  const sessionCookie = auth.createSessionCookie(null);
  return json(null, {
    headers: {
      Location: "/auth", // redirect to login page
      "Set-Cookie": sessionCookie.serialize(), // delete session cookie
    },
    status: 302,
  });
}
