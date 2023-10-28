import { useState } from "react";
import { toast } from "react-toastify";
import { Edit, Loader } from "lucide-react";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { useFormHook } from "@/components/form/useForm";
import { navigate } from "rakkasjs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/ui/select";
import { Label } from "@radix-ui/react-label";
import { FormHeader } from "@/components/form/inputs/FormHeader";
import {
  SherpaContentCreate,
  SherpaContentResponse,
  SherpaContentUpdate,
} from "@/lib/pb/db-types";
import { useMutation } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/async";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { TheTextAreaInput } from "@/components/form/inputs/TheTextArea";
import { SubmitButton } from "@/components/form/inputs/SubmitButton";

interface ContentFormProps {
  default_value?: SherpaContentResponse | null;
  updating?: boolean;
}

export function ContentForm({ default_value, updating }: ContentFormProps) {
 
  const { user_query: user, page_ctx } = useUser();

  const create_mutation = useMutation({
    mutationFn: async (vars: SherpaContentCreate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_content").create(vars),
      );
    },
  });
  const update_mutation = useMutation({
    mutationFn: async (vars: SherpaContentUpdate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_content")
          .update(default_value?.id!, vars),
      );
    },
  });

  const { handleChange, input, setInput } = useFormHook<
    Omit<SherpaContentResponse, "created" | "updated">
  >({
    initialValues: {
      id: default_value?.id ?? "",
      description: default_value?.description ?? "",
      content_url: default_value?.content_url ?? "",
      title: default_value?.title ?? "",
      type: default_value?.type ?? "Blog",
      user: user.data?.id ?? "",
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
              toast(res.error.message, { type: "error", autoClose: false });
            }
            if (res.data) {
              toast("profile updated successfully", { type: "success" });
              // navigate("/dashboard/content");
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
              toast(res.error.message, { type: "error", autoClose: false });
            }
            if (res.data) {
              toast("content created successfully", { type: "success" });
              navigate("/dashboard/content");
            }
          })
          .catch((error) =>
            toast(error.message, { type: "error", autoClose: false }),
          );
      }
    }
  }
  const dateToString = (date: Date | string) => {
    if (date instanceof Date) {
      return date.toISOString().slice(0, 10);
    }
    return date;
  };

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
        <FormHeader editing={editing} updating={updating} name="Content" />
        <TheTextInput
          field_key={"title"}
          val={input["title"]}
          required
          // input={input}
          field_name={"Title"}
          className="input input-bordered input-sm w-full  "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />
        <TheTextAreaInput
          field_key={"description"}
          value={input["description"]}
          required
          // input={input}
          field_name={"Description"}
          className="min-h-[150px] "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />

        <TheTextInput
          field_key={"content_url"}
          val={input["content_url"]}
          required
          // input={input}
          type="url"
          field_name={"Content Url"}
          className="input input-bordered input-sm w-full  "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />
        {/* "Video" | "Blog" | "Gist" | "Podcast" */}
        <div className="flex w-full flex-col gap-1">
          <Label className="text  font-serif font-bold">Content Type</Label>
          <Select
            defaultValue={input["type"]}
            // className="select select-accent select-sm w-full max-w-xs"
            onValueChange={(e) => {
              setInput((prev) => {
                return {
                  ...prev,
                  qualification: e as SherpaContentResponse["type"],
                };
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"Video"}>Video</SelectItem>
                <SelectItem value={"Blog"}>Blog</SelectItem>
                <SelectItem value={"Gist"}>Gist</SelectItem>
                <SelectItem value={"Podcast"}>Podcast</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {editing && (
          <div className="flex w-full items-center justify-center">
            {/* <button className="btn btn-sm  mt-2 w-[80%] sm:w-[70%] md:w-[40%] ">
              {create_mutation.isPending || update_mutation.isPending ? (
                <Loader className="h-6 w-6 animate-spin" />
              ) : (
                <div></div>
              )}
              {updating ? "Update" : "Create"}
            </button> */}
            <SubmitButton
              loading={create_mutation.isPending || update_mutation.isPending}
              
            />
          </div>
        )}
      </form>
    </div>
  );
}
