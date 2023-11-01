import PocketBase, { OAuth2AuthConfig } from "pocketbase";
import { GithubOauthResponse } from "./types";
import { TypedPocketBase } from "typed-pocketbase";
import { Schema, SherpaUserCreate, SherpaUserResponse, SherpaUserUpdate } from "./db-types";
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
    const data:SherpaUserUpdate = {
      github_access_token: authData.meta?.accessToken,
      github_username: authData.meta?.rawUser?.login,
      username: authData.meta?.rawUser?.login,
      avatar_url: authData.meta?.rawUser?.avatar_url,
      about_me: authData.meta?.rawUser?.bio,
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


export async function oneClickOauthLogin(provider: "github" | "google") {
  try {
    const authData = await pb.collection('sherpa_user').authWithOAuth2({ provider});
    // console.log("============== AUTH DATA ============== ",authData)
    const dev = authData.record;
    const data: SherpaUserUpdate = authData?.meta?.isNew?{
      github_access_token: authData.meta?.accessToken,
      github_username: authData.meta?.rawUser?.login,
      // username: authData.meta?.rawUser?.login,
      avatar_url: authData.meta?.rawUser?.avatar_url,
      about_me: authData.meta?.rawUser?.bio,
    }:
    {
        github_access_token: authData.meta?.accessToken,
    };
    console.log("to update  === ",data)
    const updated_user =await pb.collection("sherpa_user").update(dev.id, data)
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    return updated_user

  } catch (error) {
    throw error
  }
}





export function getFileURL({collection_id_or_name,file_name,record_id}:{
  collection_id_or_name: string,
  record_id: string,
  file_name: string
}){
  // http://127.0.0.1:8090/api/files/COLLECTION_ID_OR_NAME/RECORD_ID/FILENAME?thumb=100x300
  return `${pb_url}/api/files/${collection_id_or_name}/${record_id}/${file_name}`;
}
