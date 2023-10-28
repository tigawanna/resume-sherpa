import { auth } from "@/lib/auth/lucia/lucia";
import {
  TUserSignUpFormFields,
  TUserSigninFormFields,
  signinFormSchema,
  signupFormSchema,
} from "@/lib/auth/schema";
import { json } from "@hattip/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { LuciaError } from "lucia";
import { RequestContext } from "rakkasjs";
import { ZodError } from "zod";

export async function emailPasswordLogin(email: string, password: string) {
  try {
    const key = await auth.useKey("email", email?.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });
    const sessionCookie = auth.createSessionCookie(session);

    // console.log("logged in with session == ", { session, sessionCookie });
    return { session, sessionCookie };
  } catch (error: any) {
    throw error;
  }
}

export async function emailPasswordSignup(
{ email, password, username, avatar }:LuciaUser&{password:string} ) {
  try {
    const user = await auth.createUser({
      key: {
        providerId: "email", // auth method
        providerUserId: email.toLowerCase(), // unique id when using "username" auth method
        password, // hashed by Lucia
      },
      attributes: {
        username,
        email,
        avatar
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const sessionCookie = auth.createSessionCookie(session);
    return { session, sessionCookie };
  } catch (error: any) {
    throw error;
  }
}

/**
 * Logs in a user with email and password using lucia auth.
 *
 * @param {RequestContext} ctx - The request context.
 * @param {TUserSignUpFormFields} input - The create user variables if they were not provied in the form data.
 * @return {Promise<HttpResponse>} - The response object.
 *
 */
export async function loginUserWithEmailandPassword(
  ctx: RequestContext,
  input?: TUserSigninFormFields
) {
  try {
    const request = ctx.request;
    const formData = await request.formData();
    const { password, email } =
      input ??
      signinFormSchema.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });
    const { session, sessionCookie } = await emailPasswordLogin(
      email,
      password
    );
    return json(session, {
      headers: {
        // Location: "/", // redirect to profile page
        "Set-Cookie": sessionCookie.serialize(), // store session cookie
      },
      status: 302,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      return json(
        {
          type: "zod-error",
          error: e,
        },
        {
          status: 400,
        }
      );
    }

    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      return json(
        {
          message: "Incorrect email or password",
          error: e,
        },
        {
          status: 400,
        }
      );
    }

    return json(e, {
      status: 400,
    });
  }
}

/**
 * Logs in a user with email and password using lucia auth.
 *
 * @param {RequestContext} ctx - The request context.
 * @param {TUserSignUpFormFields} input - The create user variables if they were not provied in the form data.
 * @return {Promise<HttpResponse>} - The response object.
 *
 * @throws {LuciaError}
 */
export async function createUserWithEmailandPassword(
  ctx: RequestContext,
  input?: TUserSignUpFormFields
) {
  try {
    const request = ctx.request;
    const formData = await request.formData();
    const { password, email, username } =
      input ??
      signupFormSchema.parse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      });
    const { session, sessionCookie } = await emailPasswordSignup(
      { email, password, username }    );

    return json(session, {
      headers: {
        // Location: "/",
        "Set-Cookie": sessionCookie.serialize(), // store session cookie
      },
      status: 302,
    });
  } catch (e: any) {
    // this part depends on the database you're using
    // check for unique constraint error in user table
    if (e instanceof ZodError) {
      // Access individual field errors
      const fieldErrors = e.errors.map((err) => {
        return {
          field: err.path.join("."),
          message: err.message,
        };
      });

      return json(JSON.stringify({ errors: fieldErrors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (
      e instanceof PrismaClientKnownRequestError &&
      e.message.includes("Unique constraint failed on the fields")
    ) {
      const target_fields = e?.meta?.target as string[];

      if (target_fields?.includes("username")) {
        return json(
          {
            message: "Username not unique",
            error: e,
          },
          {
            status: 400,
          }
        );
      }
      if (target_fields?.includes("email")) {
        return json(
          {
            message: "Email not unique",
            error: e,
          },
          {
            status: 400,
          }
        );
      }

      return json(
        {
          message: "User not unique",
          error: e,
        },
        {
          status: 400,
        }
      );
    }

    return json(
      {
        measage: "Something went wrong " + e.message,
        error: e,
      },
      {
        status: 500,
      }
    );
  }
}
