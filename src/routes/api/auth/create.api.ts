import { json } from "@hattip/response";
import { RequestContext } from "rakkasjs";
import { createUserWithEmailandPassword } from "../helpers/auth-methods";

export async function get(ctx: RequestContext) {
  return json({ route: "creaet user route" });
}
export async function post(ctx: RequestContext) {
  return
  return await createUserWithEmailandPassword(ctx);
}
