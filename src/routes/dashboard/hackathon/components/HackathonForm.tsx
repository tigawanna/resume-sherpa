import { useState } from "react";
import { toast } from "react-toastify";
import { Edit } from "lucide-react";
import { useFormHook } from "@/components/form/useForm";
import { navigate} from "rakkasjs";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { TheTextAreaInput } from "@/components/form/inputs/TheTextArea";
import { TheListInput } from "@/components/form/inputs/ListInput";
import { FormHeader } from "@/components/form/inputs/FormHeader";
import { useMutation } from "@tanstack/react-query";
import { SherpaHackathonCreate, SherpaHackathonResponse, SherpaHackathonUpdate } from "@/lib/pb/db-types";
import { tryCatchWrapper } from "@/utils/async";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { dateToString } from "@/utils/helpers/others";
import { SubmitButton } from "@/components/form/inputs/SubmitButton";
import { TheStringListInput } from "@/components/form/inputs/StringListInput";

interface HackathonFormProps {
  default_value?: SherpaHackathonResponse|null;
  updating?: boolean;
}

export function HackathonForm({
  default_value,
  updating,
}: HackathonFormProps) {


  const { user_query: user, page_ctx } = useUser();
  const create_mutation = useMutation({
    mutationFn: async (vars: SherpaHackathonCreate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_hackathon").create(vars),
      );
    },
  });
  const update_mutation = useMutation({
    mutationFn: async (vars: SherpaHackathonUpdate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_hackathon")
          .update(default_value?.id!, vars),
      );
    },
  });

  const { handleChange, input, setError, setInput, validateInputs } =
    useFormHook<Omit<SherpaHackathonResponse,"id"|"created"|"updated">>({
      initialValues: {
        name: default_value?.name ?? "",
        description: default_value?.description ?? "",
        link: default_value?.link ?? "",
        technologies: default_value?.technologies ?? "",
        user: default_value?.user ?? user?.data?.id!,
        from: dateToString(default_value?.from) ?? dateToString(new Date()),
        to: dateToString(default_value?.to) ?? dateToString(new Date()),
      },
    });

  const [editing, setEditing] = useState(!updating);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (editing) {
      if (updating) {
        update_mutation
          .mutateAsync(input)
          .then((res) => {

          })
          .catch((error) =>
            toast(error.message, { type: "error", autoClose: false })
          );
      } else {
        create_mutation
          .mutateAsync(input)
          .then((res) => {

            navigate("/dashboard/hackathon");
          })
          .catch((error) =>
            toast(error.message, { type: "error", autoClose: false })
          );
      }
    }
  }


  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 border p-2 shadow shadow-accent">
      <div className="flex w-full justify-end px-5">
        <Edit
          className={editing ? "h-6 w-6 text-accent" : "h-6 w-6"}
          onClick={() => setEditing(!editing)}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full flex-col items-center justify-center gap-4"
      >
        <FormHeader editing={editing} updating={updating} name="Hackathon" />
        <TheTextInput
          field_key={"name"}
          value={input["name"]}
          // input={input}
          field_name={"Hackathon name"}
          className="input input-bordered input-sm w-full  "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />
        <TheTextAreaInput
          field_key={"description"}
          value={input["description"]}
          // input={input}
          field_name={"Brief description"}
          className="min-h-[200px]"
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />
        <TheTextInput
          field_key={"link"}
          value={input["link"]}
          // input={input}
          field_name={"Link to Project"}
          type="url"
          className="input input-bordered input-sm w-full  "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />

        <TheStringListInput
          editing={editing}
          field_name="Technologies"
          field_key="technologies"
          input={input}
          setInput={setInput}
        />

        <div className="flex  w-full flex-col  items-center justify-evenly gap-2 sm:flex-row">
          <TheTextInput
            required
            field_key={"from"}
            val={dateToString(input["from"])}
            type="date"
            // input={input}
            field_name={"From"}
            className="input input-bordered input-sm w-full  "
            label_classname="text-base capitalize"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInput((prev) => {
                return {
                  ...prev,
                  from: dateToString(e.target.value),
                };
              });
            }}
            editing={editing}
          />
          <TheTextInput
            required
            field_key={"to"}
            val={dateToString(input["to"])}
            type="date"
            // input={input}
            field_name={"To"}
            className="input input-bordered input-sm w-full  "
            label_classname="text-base capitalize"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInput((prev) => {
                return { ...prev, to: dateToString(e.target.value) };
              });
            }}
            editing={editing}
          />
        </div>
        {editing && (
          <div className="flex w-full items-center justify-center">
            <SubmitButton
              loading={create_mutation.isPending || update_mutation.isPending}
            />
          </div>
        )}
      </form>
    </div>
  );
}
