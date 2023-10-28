import { githubAuth } from "@/lib/auth/lucia/lucia";
import { json } from "@hattip/response";
import { RequestContext } from "lucia";
import { serializeCookie } from "lucia/utils";

export async function get(ctx: RequestContext) {
  try {
    const [url, state] = await githubAuth.getAuthorizationUrl();
    const stateCookie = serializeCookie("github_oauth_state", state, {
      httpOnly: true,
      secure: import.meta.env.PROD, // `true` for production
      path: "/",
      maxAge: 60 * 60,
    });
    // console.log({ state, url });
    return json(null, {
      status: 302,
      headers: {
        Location: url.toString(),
        "Set-Cookie": stateCookie,
      },
    });
  } catch (error) {
    // console.log({ error });
    return json(error, {
      status: 400,
    });
  }
}
