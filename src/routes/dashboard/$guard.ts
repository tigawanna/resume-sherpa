import { LookupHookResult, PageContext } from "rakkasjs";

export function pageGuard(ctx: PageContext): LookupHookResult {
  const user = ctx.queryClient.getQueryData("user");
  // console.log("user in dashboard page guard", user);
  if (user) {
    return true;
  } else {
    const redirect_url = new URL(ctx.url);
    redirect_url.pathname = "/auth";
    redirect_url.searchParams.set("redirect", ctx.url.pathname);
    return {
      redirect: redirect_url,
    };
  }
}
