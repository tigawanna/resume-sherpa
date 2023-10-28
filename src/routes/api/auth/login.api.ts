import { RequestContext } from "rakkasjs";
import { loginUserWithEmailandPassword } from "../helpers/auth-methods";

export async function post(ctx: RequestContext) {
  return
  return await loginUserWithEmailandPassword(ctx);
}
