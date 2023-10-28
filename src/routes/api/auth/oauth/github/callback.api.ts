import { auth, githubAuth } from "@/lib/auth/lucia/lucia";
import { prisma } from "@/lib/db/prisma";
import { json } from "@hattip/response";
import { RequestContext } from "lucia";
import { parseCookie } from "lucia/utils";

export async function get(ctx: RequestContext) {
  const request = ctx.request;
  const cookies = parseCookie(request.headers.get("Cookie") ?? "");
  const storedState = cookies.github_oauth_state;
  const url = new URL(request.url!);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  // console.log({storedState,state,code})
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return json(
      {
        error: "Invalid state",
        message: `Invalid state : ${storedState}, ${state}, ${code}`,
      },
      {
        status: 400,
      }
    );
  }
  try {
    const { getExistingUser, githubUser, createUser, createKey } =
      await githubAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;

      if (!githubUser.email) {
        throw new Error("no email found ");
      }
      const existingDatabaseUserWithEmail = await prisma.user.findUnique({
        where: {
          email: githubUser.email!,
        },
      });
      if (existingDatabaseUserWithEmail) {
        // @ts-expect-error
        const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail);
        await createKey(user.userId);
        return user;
      }
      const user = await createUser({
        attributes: {
          username: githubUser.login,
          email: githubUser.email!,
          avatar: githubUser.avatar_url,
        },
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const sessionCookie = auth.createSessionCookie(session);
    // console.log({ session });
    return json(session, {
      headers: {
        Location: "/",
        "Set-Cookie": sessionCookie.serialize(), // store session cookie
      },
      status: 302,
    });
  } catch (e) {
    // console.log({ "error logging in": e });
    if (e instanceof Error) {
      // invalid code
      return json(e, {
        headers: {
          location: "/auth",
        },
        status: 400,
      });
    }

    return json(e, {
      headers: {
        location: "/auth",
      },
      status: 500,
    });
  }
}
