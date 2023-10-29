import { SubmitButton } from "@/components/form/inputs/SubmitButton";
import { TheTextAreaInput } from "@/components/form/inputs/TheTextArea";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { SherpaJobApplicationCreate, SherpaJobApplicationResponse, SherpaJobApplicationUpdate } from "@/lib/pb/db-types";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { UseMutationResult } from "@tanstack/react-query";
import { ClientResponseError } from "pocketbase";
import { toast } from "react-toastify";
import { TypedRecord } from "typed-pocketbase";


interface JobBasicInfoFormProps {
  input: Omit<SherpaJobApplicationResponse, "id" | "created" | "updated">;
  updating: boolean;
  editing: boolean;
  create_mutation: UseMutationResult<
    {
      data: TypedRecord<
        {
          user: string;
          title: string;
          description: string;
          posting_url: string;
          cover_letter?: string | undefined;
          resume?: string | undefined;
          id: string;
          created: string;
          updated: string;
        },
        {}
      > | null;
      error: ClientResponseError | null;
    },
    Error,
    SherpaJobApplicationCreate,
    unknown
  >;
  update_mutation: UseMutationResult<
    {
      data: TypedRecord<
        {
          user: string;
          title: string;
          description: string;
          posting_url: string;
          cover_letter?: string | undefined;
          resume?: string | undefined;
          id: string;
          created: string;
          updated: string;
        },
        {}
      > | null;
      error: ClientResponseError | null;
    },
    Error,
    SherpaJobApplicationUpdate,
    unknown
  >;

  isLoading: boolean;
  setInput: React.Dispatch<
    React.SetStateAction<
      Omit<SherpaJobApplicationResponse, "id" | "created" | "updated">
    >
  >;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export function JobBasicInfoForm({input,setInput,handleChange,editing,updating,create_mutation,update_mutation}:JobBasicInfoFormProps){

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  e.stopPropagation();

  if (editing) {
    if (updating) {
      update_mutation
        .mutateAsync(input)
        .then((res) => {

            if (res.error) {
              toast(res.error.message, {
                type: "error",
                autoClose: false,
              });
            }
            if (res.data) {
              toast("JobAplication updated successfully", {
                type: "success",
              });
        
            }
        })
        .catch((error) =>
          toast(error.message, { type: 'error', autoClose: false }),
        );
    } else {
      create_mutation
        .mutateAsync(input)
        .then((res) => {
            if (res.error) {
              toast(res.error.message, {
                type: "error",
                autoClose: false,
              });
            }
            if (res.data) {
              toast("JobAplication added successfully", {
                type: "success",
              });
            }
        })
        .catch((error) =>
          toast(error.message, { type: 'error', autoClose: false }),
        );
    }
  }
}


const isLoading = create_mutation.isPending || update_mutation.isPending;
  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full w-full flex-col items-center justify-center gap-3 p-1"
    >
      {/* <FormHeader editing={editing} updating={updating} name="Job Application" /> */}
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <TheTextInput<SherpaJobApplicationResponse>
          required
          field_key={"title"}
          val={input["title"]}
          // input={input}
          field_name={"Job Title"}
          className="input input-bordered input-sm w-full  "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />
        <TheTextInput<SherpaJobApplicationResponse>
          required
          field_key={"posting_url"}
          val={input["posting_url"] ?? ""}
          // input={input}
          field_name={"Job posting Url"}
          type="url"
          className="input input-bordered input-sm w-full  "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />
        <TheTextAreaInput<SherpaJobApplicationResponse>
          required
          field_key={"description"}
          value={input["description"] ?? ""}
          // input={input}
          field_name={"Job Description"}
          className="min-h-[200px]"
          description="copy-paste in your job description"
          label_classname="text-base capitalize gap-2"
          onChange={handleChange}
          editing={editing}
        />
      </div>

      {editing && (
        <div className="flex w-full items-center justify-center">
          {editing && (
            <div className="flex w-full items-center justify-center">
              <SubmitButton
                loading={create_mutation.isPending || update_mutation.isPending}
              />
            </div>
          )}
        </div>
      )}
    </form>
  );
}
