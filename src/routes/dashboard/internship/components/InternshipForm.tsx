import { useState } from "react";
import { toast } from "react-toastify";
import { Edit } from "lucide-react";
import { TheTextAreaInput } from "@/components/form/inputs/TheTextArea";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { useFormHook } from "@/components/form/useForm";
import { navigate } from "rakkasjs";
import { FormHeader } from "@/components/form/inputs/FormHeader";
import { useMutation } from "@tanstack/react-query";
import {
  SherpaInternshipCreate,
  SherpaInternshipResponse,
  SherpaInternshipUpdate,
} from "@/lib/pb/db-types";
import { tryCatchWrapper } from "@/utils/async";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { dateToString } from "@/utils/helpers/others";
import { SubmitButton } from "@/components/form/inputs/SubmitButton";

interface InternshipFormProps {
  default_value?: SherpaInternshipResponse | null;
  updating?: boolean;
}

export function InternshipForm({
  default_value,
  updating,
}: InternshipFormProps) {
  const { user_query: user, page_ctx } = useUser();
  const create_mutation = useMutation({
    mutationFn: async (vars: SherpaInternshipCreate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_internship").create(vars),
      );
    },
  });
  const update_mutation = useMutation({
    mutationFn: async (vars: SherpaInternshipUpdate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_internship")
          .update(default_value?.id!, vars),
      );
    },
  });

  const { handleChange, input, setError, setInput, validateInputs } =
    useFormHook<Omit<SherpaInternshipResponse, "id" | "created" | "updated">>({
      initialValues: {
        company: default_value?.company ?? "",
        role: default_value?.role ?? "",
        description: default_value?.description ?? "",
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
            if (res.error) {
              toast(res.error.message, {
                type: "error",
                autoClose: false,
              });
            }
            if (res.data) {
              toast("Internship updated successfully", {
                type: "success",
              });
            }
          })
          .catch((error) =>
            toast(error.message, { type: "error", autoClose: false }),
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
              toast("Interndhip added successfully", {
                type: "success",
              });
              navigate("/dashboard/internship");
            }
          })
          .catch((error) =>
            toast(error.message, { type: "error", autoClose: false }),
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
        className="flex h-full w-full flex-col items-center justify-center gap-2"
      >
  
          <FormHeader editing={editing} updating={updating} name="Internship" />
       
        <TheTextInput
          required
          field_key={"company"}
          val={input["company"]}
          // input={input}
          field_name={"Company"}
          className="input input-bordered input-sm w-full  "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />
        <TheTextInput
          required
          field_key={"role"}
          val={input["role"]}
          // input={input}
          field_name={"Role"}
          className="input input-bordered input-sm w-full  "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />
        <TheTextAreaInput
          required
          field_key={"description"}
          value={input["description"]}
          // input={input}
          field_name={"Description"}
          className="min-h-[150px]"
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
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
            {editing && (
              <div className="flex w-full items-center justify-center">
                <SubmitButton
                  loading={
                    create_mutation.isPending || update_mutation.isPending
                  }
                />
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
