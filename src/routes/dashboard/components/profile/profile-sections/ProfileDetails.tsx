import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { SherpaUserResponse, SherpaUserUpdate } from "@/lib/pb/db-types";
import { Github, Linkedin, Mail, UserCircle2 } from "lucide-react";

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
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }
  return (
    <div className="w-full h-full flex flex-wrap items-center  px-3 p-1 gap-2">
      <div className="h-full flex flex-wrap items-center justify-center gap-1">
        <TheTextInput
          field_key={"email"}
          val={profile.email}
          placeholder="email"
          // input={input}
          field_name={<Mail className="w-4 h-4" />}
          className="input input-bordered input-sm "
          container_classname="w-full flex min-w-[100px] flex-row items-center gap-1"
          label_classname="flex"
          onChange={handleChange}
          editing={false}
        />
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
      <div className="h-full flex flex-wrap items-center justify-center gap-1">
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
