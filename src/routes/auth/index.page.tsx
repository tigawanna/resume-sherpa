import { SignInForm } from "./components/SignInForm";
import { ActionHandler, PageProps, Head, ActionResult } from "rakkasjs";
import { ActionErrorData } from "@/lib/rakkas/utils/actions";
import {
  mapZodIssueToField,
  mapPrismaIssueToField,
} from "@/utils/error-handling";
import { ZodError } from "zod";
import { TSigninformSchema, signinformSchema } from "./components/auth";
import { tryCatchWrapper } from "@/utils/async";

export default function SignInPage({ actionData }: PageProps) {
  return (
    <div className="w-full min-h-screen h-full flex items-center justify-center">
      <Head title="Sign in" description={"Sign in to your account"} />
      <SignInForm  />
    </div>
  );
}

export const action: ActionHandler = async (
  ctx,
): Promise<ActionResult<ActionErrorData<Partial<TSigninformSchema>>>> => {
  const destination =
    ctx.requestContext.url.searchParams.get("redirect") ?? "dashboard";

  const formData = await ctx.requestContext.request.formData();
  const defaultValues = {
    usernameOrEmail: formData.get("usernameOrEmail")?.toString(),
    password: formData.get("password")?.toString(),
  };

  try {
    const { password, usernameOrEmail } = signinformSchema.parse({
      usernameOrEmail: formData.get("usernameOrEmail"),
      password: formData.get("password"),
    });
    const res = await tryCatchWrapper(ctx.locals.pb?.collection('sherpa_user').authWithPassword(
    usernameOrEmail,
    password,
    ))
    

if(res.data){
    const redirect_url = new URL(ctx.url);
    redirect_url.pathname = destination;
    redirect_url.searchParams.delete("redirect"); 
    return {
      redirect: redirect_url,
      headers: {
        "Set-Cookie":ctx.locals.pb?.authStore.exportToCookie(),
    },
};
}
return {
  data: {
    error: {
      fields: {
        // usernameOrEmail: mapZodIssueToField(error., "email"),
        // password: mapZodIssueToField(error, "password"),
      },

      message: res?.error?.message??"Try again later",
    },
    defaultValues,
  },
};

  } catch (error: any) {
    if (error instanceof ZodError) {
      // console.log("ZOD ACTION ERROR ==>", error);
      return {
        data: {
          error: {
            fields: {
              usernameOrEmail: mapZodIssueToField(error, "email"),
              password: mapZodIssueToField(error, "password"),
            },
            message: "Incorrect fields",
          },
          defaultValues,
        },
      };
    }


    // console.log("UNCLASSIFIED ACTION ERROR ==>", error);
    return {
      data: {
        error: {
          fields: {
            // username: mapPrismaIssueToField(error, "username"),
            // email: mapPrismaIssueToField(error, "email"),
            // password: mapPrismaIssueToField(error, "password"),
          },
          message: "error logging in ",
        },
        defaultValues,
      },
    };
  }
};
