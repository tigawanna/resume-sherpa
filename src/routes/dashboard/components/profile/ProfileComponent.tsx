import { SherpaUserResponse, SherpaUserUpdate } from "@/lib/pb/db-types";
import { useMutation, usePageContext,useSSQ } from "rakkasjs";
import { ProfileImage } from "./profile-sections/ProfileImage";
import { tryCatchWrapper } from "@/utils/async";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { useState } from "react";
import { ProfileDetails } from "./profile-sections/ProfileDetails";
import { Edit, Save } from "lucide-react";
import { TheCountryFields } from "@/components/form/TheCountryFields";
import { toast } from "react-toastify";
import { pb } from "@/lib/pb/client";
import { Spinner } from "@/components/navigation/loaders/Spinner";

interface ProfileComponentProps {}

export function ProfileComponenst({}: ProfileComponentProps) {
  const page_ctx = usePageContext();
  const qc = page_ctx.queryClient;
  const { id } = qc.getQueryData("user") as SherpaUserResponse;
  
  const query = useSSQ((ctx) => {
    return tryCatchWrapper(ctx.locals.pb?.collection("sherpa_user").getOne(id));
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
  const [editing, setEditing] = useState(true);

  const mutation = useMutation(
    async (vars: SherpaUserUpdate) => {
      return tryCatchWrapper(pb.collection("sherpa_user").update(id, vars));
    },
    {
      onSuccess: (res) => {
        if (res.data) {
          toast("Image updated successfully", { type: "success" });
          query.refetch();
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
    },
  );

  const response = query.data;
  console.log("response  ==  ",response)
  // console.log("input =============== ", input);
  return (
    <div className="w-full h-full  flex flex-col items-center justify-center">
      {response?.error && <PBReturnedUseQueryError error={response.error} />}
      {query.isRefetching && <Spinner />}
     
      <div className="flex items-center justify-end gap-2  p-1 w-full sticky top-10">
        <button
          title={editing ? "stop editing" : "toggle editing"}
          className={editing ? "btn btn-sm text-accent" : "btn btn-sm"}
        >
          <Edit onClick={() => setEditing((prev) => !prev)} />
        </button>
        <button title="save changes" className="btn btn-sm ">
          {mutation.isLoading ? (
            <Spinner size="40px" />
          ) : (
            <Save onClick={() => mutation.mutate(input)} className="h-7 w-7" />
          )}
        </button>
      </div>

      {response?.data && (
        <div className="w-full  flex flex-col  gap-2  px-5 justify-between">
          <div className="w-full  flex flex-col md:flex-row gap-2  px-5 justify-between">
            <div className="min-w-[250px]">
              <ProfileImage
                file_name={response?.data?.avatar}
                record_id={response?.data?.id}
                editing={editing}
                setEditing={setEditing}
                setInput={setInput}
              />
            </div>

            <div className="min-w-[70%] h-full flex flex-col  md:flex-row  p-1  gap-2">
              <div className="w-full h-full flex flex-col  bg-base-300 p-1  gap-2">
                <ProfileDetails
                  profile={response?.data}
                  editing={editing}
                  input={input}
                  setInput={setInput}
                />
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
          </div>
          <div className="flex w-full justify-center"></div>
        </div>
       )}
    </div>
  );
}
