import PocketBase, { OAuth2AuthConfig } from "pocketbase";
import { GithubOauthResponse } from "./types";
import { TypedPocketBase } from "typed-pocketbase";
import { Schema, SherpaUserCreate } from "./db-types";
import { tryCatchWrapper } from "@/utils/async";
import { errorToClientResponseError } from "./utils";

const pb_url = import.meta.env.RAKKAS_PB_URL
export const pb = new PocketBase(
  pb_url,
) as TypedPocketBase<Schema>;

export async function createUser(data: SherpaUserCreate) {
  const res = await tryCatchWrapper(pb.collection("sherpa_user").create(data));
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  return res;
}

export async function verifyUserEmail(email: string) {
  return await tryCatchWrapper(
    pb.collection("sherpa_user").requestVerification(email),
  );
}

export async function emailPasswordLogin(identity: string, password: string) {
  const user  =await tryCatchWrapper(
    pb.collection("sherpa_user").authWithPassword(identity, password),
  );
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  return user
}

// export async function oauthLogin(options:OAuth2AuthConfig) {
//     return await tryCatchWrapper(pb.collection('sherpa_user').authWithOAuth2(options))
// }

export async function listOAuthMethods() {
  return await tryCatchWrapper(pb.collection("sherpa_user").listAuthMethods());
}

export async function triggerOuathLogin(options: OAuth2AuthConfig) {
  return await tryCatchWrapper<GithubOauthResponse>(
    pb.collection("sherpa_user").authWithOAuth2(options) as any,
  );
}

export async function updateUser(authData: GithubOauthResponse) {

    const dev = authData.record;
    const data = {
      access_token: authData.meta?.accessToken,
      github_login: authData.meta?.rawUser?.login,
      avatar_url: authData.meta?.rawUser?.avatar_url,
      username: authData.meta?.rawUser?.login,
      bio: authData.meta?.rawUser?.bio,
      emailVisibility: true,
    };
    const new_dev = await tryCatchWrapper(pb.collection("sherpa_user").update(dev.id, data));
    if (new_dev?.data) {
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    }
    return new_dev;

}

export async function oAuthLogin(provider: "github" | "google") {
  const authdata = await triggerOuathLogin({ provider });

  if (authdata?.error) {
    return authdata.error;
  }

  if (authdata?.data && authdata?.data?.meta) {
    const user = await tryCatchWrapper(updateUser(authdata?.data));
    if (user?.error) {
      return user.error;
    }
    if (user?.data) {
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
      return user.data;
    }
  }
  return errorToClientResponseError({name: "Login Failed", message: "Oauth Login Failed",isAbort: false,});
}


export function getFileURL({collection_id_or_name,file_name,record_id}:{
  collection_id_or_name: string,
  record_id: string,
  file_name: string
}){
  // http://127.0.0.1:8090/api/files/COLLECTION_ID_OR_NAME/RECORD_ID/FILENAME?thumb=100x300
  return `${pb_url}/api/files/${collection_id_or_name}/${record_id}/${file_name}`;
}
