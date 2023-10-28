import { SherpaUserUpdate } from "@/lib/pb/db-types";
import { ProfileImage } from "./profile-sections/ProfileImage";
import { tryCatchWrapper } from "@/utils/async";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { useState } from "react";
import { ProfileDetails } from "./profile-sections/ProfileDetails";
import { Edit, Loader, Save } from "lucide-react";
import { TheCountryFields } from "@/components/form/TheCountryFields";
import { toast } from "react-toastify";
import { pb } from "@/lib/pb/client";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { TheTextAreaInput } from "@/components/form/inputs/TheTextArea";
import { TheStringListInput } from "@/components/form/inputs/StringListInput";

interface ProfileComponentProps {}

export function ProfileComponenst({}: ProfileComponentProps) {
  const qc = useQueryClient();
  const { user_query: user_query } = useUser();
  const id = user_query?.data?.id;
  const [editing, setEditing] = useState(false);

  const query = useQuery({
    queryKey: ["sherpa_user", id],
    queryFn: () =>
      tryCatchWrapper(pb.collection("sherpa_user").getOne(id ?? "")),
  });
  const profile = query.data?.data;

  const [input, setInput] = useState<SherpaUserUpdate>({
    username: profile?.username,
    github_username: profile?.github_username ?? "",
    linkedin_username: profile?.linkedin_username ?? "",
    about_me: profile?.about_me ?? "",
    // @ts-expect-error
    avatar: profile?.avatar,
    country: profile?.country ?? "",
    city: profile?.city ?? "",
    langauges: profile?.langauges ?? "",
    phone: profile?.phone ?? "",
    skills: profile?.skills ?? "",
  });
  const mutation = useMutation({
    mutationFn: async (vars: SherpaUserUpdate) => {
      return tryCatchWrapper(
        pb.collection("sherpa_user").update(id ?? "", vars),
      );
    },

    onSuccess: (res) => {
      if (res.data) {
        toast("profile updated successfully", { type: "success" });
        qc.invalidateQueries({ queryKey: ["sherpa_user", id] });
        setEditing(false);
        // startTransition(() => {
        // })
      }
      if (res.error) {
        toast(res.error.message, { type: "error", autoClose: false });
      }
    },
    onError: (err: any) => {
      toast(err?.message, { type: "error", autoClose: false });
    },
  });

  const response = query.data;
  return (
    <div className="w-full h-full flex flex-col items-center  px-4 ">
      {response?.error && <PBReturnedUseQueryError error={response.error} />}

      <div className="flex items-center justify-end gap-1  p-1 w-full sticky top-10">
        {editing && (
          <button title="save changes" className="btn btn-sm ">
            {mutation.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              <Save
                onClick={() => mutation.mutate(input)}
                className="h-7 w-7"
              />
            )}
          </button>
        )}
        <button
          title={editing ? "stop editing" : "toggle editing"}
          className={editing ? "btn btn-sm text-accent" : "btn btn-sm"}
        >
          <Edit onClick={() => setEditing((prev) => !prev)} />
        </button>
      </div>

      {response?.data && (
        <div className="w-full  flex flex-col  gap-10  p-1  mb-5 sm:px-5 ">
          <div className="w-full flex flex-col md:flex-row gap-5  justify-between ">
            <div className="min-w-[250px] w-full">
              <ProfileImage
                file_name={response?.data?.avatar}
                record_id={response?.data?.id}
                editing={editing}
                setEditing={setEditing}
                setInput={setInput}
              />
            </div>

            <div className="w-full  flex flex-col   p-1  gap-2 ">
              {/* email, username , github_username , linkedin_username */}
              <ProfileDetails
                profile={response?.data}
                editing={editing}
                input={input}
                setInput={setInput}
              />
              {/* country , city , phone */}
              <TheCountryFields
                editing={editing}
                country={{
                  city: input.city ?? "",
                  country: input.country ?? "",
                  phone: input.phone ?? "",
                }}
                setInput={(value) =>
                  setInput((prev) => {
                    return {
                      ...prev,
                      country: value.country,
                      phone: value.phone,
                      city: value.city,
                    };
                  })
                }
              />
            </div>
          </div>
          {/* skills */}
          <div className="w-full flex flex-wrap gap-5  ">
            <TheStringListInput
              editing={editing}
              field_name="Skills"
              field_key="skills"
              input={input}
              setInput={setInput}
            />{" "}
            <TheStringListInput
              editing={editing}
              field_name="Languages Spoken"
              field_key="langauges"
              input={input}
              setInput={setInput}
            />
          </div>

          {/* about_me */}
          <div className="w-full h-full flex flex-col  md:flex-row  p-1  gap-2">
            <TheTextAreaInput
              container_classname="lg:max-w-[70%] lg:max-w-[60%] gap-2"
              className="min-h-[180px] "
              field_key={"about_me"}
              value={input["about_me"]}
              // input={input}
              field_name={"About Me"}
              onChange={(e) => {
                setInput((prev) => {
                  return {
                    ...prev,
                    about_me: e.target.value,
                  };
                });
              }}
              label_classname=""
              editing={editing}
            />
          </div>

          {editing && (
            <button
              title="save changes"
              className="btn btn-sm h-auto p-1 px-3 btn-outline w-fit"
            >
              {mutation.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  Save Changes
                  <Save onClick={() => mutation.mutate(input)} className="" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
