import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { SherpaUserResponse, SherpaUserUpdate } from "@/lib/pb/db-types";
import { Github, Linkedin, Mail, UserCircle2, Verified } from "lucide-react";
import { VerifyEmailModal } from "./VerifyEmailModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/async";
import { usePageContext } from "rakkasjs";
import { toast } from "react-toastify";

interface ProfileDetailsProps {
  profile: SherpaUserResponse;
  editing: boolean;
  input: SherpaUserUpdate;
  setInput: React.Dispatch<React.SetStateAction<SherpaUserUpdate>>;
}

export function ProfileDetails({
  profile,
  editing,
  setInput,
  input,
}: ProfileDetailsProps) {
// const page_ctx= usePageContext()
// const qc = useQueryClient()
//   const request_verfication_mutation = useMutation({
//     mutationFn: (email:string) => {
//       return tryCatchWrapper(
//        page_ctx.locals.pb?.collection("sherpa_user").requestVerification(email),
//       );
//     },
//     onSuccess(data, variables, context) {
//       if (data.data) {
//         qc.invalidateQueries({ queryKey: ["sherpa_user"] });
//         toast("Verification email sent", { type: "success" });
//         }
//       if (data.error) {
//         toast(data.error.message, { type: "error", autoClose: false });
//       }
//     },
//     onError(error, variables, context) {
//       toast(error.message, { type: "error", autoClose: false });
//     },
//   });
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }
  return (
    <div className="w-full flex lg:flex-row flex-col  items-center sm:px-3 p-1 gap-2">
      <div className="h-full w-full lg:w-fit flex flex-wrap items-center justify-center gap-1 ">
        <div className="flex gap-2 flex-wrap  items-center w-full min-w-[100px] ">
          <TheTextInput
            field_key={"email"}
            val={profile.email}
            placeholder="email"
            // input={input}
            field_name={<Mail className="w-4 h-4" />}
            className="input input-bordered input-sm "
            container_classname="w-full flex w-fit flex-row items-center gap-1"
            label_classname="flex"
            onChange={handleChange}
            editing={false}
          />
          {profile.verified ?<Verified className="text-green-600 w-4 h-4" />:
          <VerifyEmailModal email={profile?.email!}/>}
        </div>
        <TheTextInput
          field_key={"username"}
          val={input["username"]}
          // input={input}
          field_name={<UserCircle2 className="w-4 h-4" />}
          className="input input-bordered input-sm w-full  "
          container_classname="flex flex-row min-w-[100px] items-center gap-1"
          placeholder="username"
          onChange={handleChange}
          editing={editing}
        />
      </div>
      <div className="h-full w-full lg:w-fit flex flex-wrap items-center justify-center gap-1 ">
        <TheTextInput
          field_key={"github_username"}
          val={input["github_username"]}
          placeholder="Github username"
          // input={input}
          field_name={<Github className="w-4 h-4" />}
          className="input input-bordered input-sm "
          container_classname="w-full min-w-[100px] flex flex-row items-center gap-1"
          label_classname="flex"
          onChange={handleChange}
          editing={editing}
        />

        <TheTextInput
          field_key={"linkedin_username"}
          val={input["linkedin_username"]}
          placeholder="linkedin username"
          // input={input}
          field_name={<Linkedin className="w-4 h-4" />}
          className="input input-bordered input-sm "
          container_classname="w-full min-w-[100px] flex flex-row items-center gap-1"
          label_classname="flex"
          onChange={handleChange}
          editing={editing}
        />
      </div>
    </div>
  );
}
