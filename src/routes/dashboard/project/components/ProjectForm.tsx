import { useState } from "react";
import { toast } from "react-toastify";
import { Edit, Loader } from "lucide-react";
import { useFormHook } from "@/components/form/useForm";
import { ThePicUrlInput } from "@/components/form/ThePicUrlInput";
import { TheTextAreaInput } from "@/components/form/inputs/TheTextArea";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { navigate} from "rakkasjs";
import { FormHeader } from "@/components/form/inputs/FormHeader";
import { SherpaProjectsCreate, SherpaProjectsResponse, SherpaProjectsUpdate} from "@/lib/pb/db-types";
import { useMutation } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/async";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { SubmitButton } from "@/components/form/inputs/SubmitButton";
import { TheStringListInput } from "@/components/form/inputs/StringListInput";

interface ProjectFormProps {
project?:SherpaProjectsResponse|null
updating?:boolean;

}

export function ProjectForm({project,updating}: ProjectFormProps) {

  const { user_query, page_ctx } = useUser();
  const user = user_query?.data
const create_mutation = useMutation({
    mutationFn: async (vars: SherpaProjectsCreate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_projects").create(vars),
      );
    },
  });
  const update_mutation = useMutation({
    mutationFn: async (vars: SherpaProjectsUpdate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_projects")
          .update(project?.id!, vars),
      );
    },
  });
// const query = api.profile.getOne.useQuery({ id: router.query.id as string });
function getId(){
  if(updating && project?.id && project?.id.length > 5){
    return project.id
  }

}
const { handleChange, input, setError, setInput, validateInputs } =
  useFormHook<Omit<SherpaProjectsResponse,"id"|"created"|"updated">>({
    initialValues: {
        name:project?.name??"",
        description:project?.description??"",
        libraries:project?.libraries??"",
        languages:project?.languages??"",
        repo_url:project?.repo_url??"",
        image_url:project?.image_url??"",
        user:project?.user??user?.id!,
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
        .then((res) =>{ 
        }).catch((error) =>
          toast(error.message, { type: "error", autoClose: false })
        );
    } else {
      create_mutation
        .mutateAsync(input)
        .then((res) => {
          if(res.data){
            toast("Project added successfully", { type: "success" })
            navigate("/dashboard/project");
          }
          if(res.error){
            toast(res.error.message, { type: "error", autoClose: false })
          }
          })
        .catch((error) =>
          toast(error.message, { type: "error", autoClose: false })
        );
    }
  }
}

  return (
    <div className="flex h-full w-full  flex-col items-center justify-center rounded-md border p-2 shadow shadow-accent">
      <div className="sticky top-10 flex w-full justify-end px-5">
        <Edit
          className={editing ? "h-6 w-6 text-accent" : "h-6 w-6"}
          onClick={() => setEditing(!editing)}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full flex-col items-center justify-center gap-4"
      >
        <FormHeader editing={editing} updating={updating} name="Project" />

        <TheTextInput
          field_key={"name"}
          field_name={"Name"}
          value={input["name"]}
          onChange={handleChange}
          editing={editing}
        />
        <TheTextAreaInput
          field_name={"Description"}
          field_key="description"
          value={input["description"]}
          className="min-h-[100px]"
          onChange={handleChange}
          editing={editing}
        />

        <TheTextInput
          field_key={"repo_url"}
          field_name={"Github Url"}
          value={input["repo_url"]}
          type="url"
          onChange={handleChange}
          editing={editing}
        />

        {/* image */}
        <ThePicUrlInput
          img_url={input.image_url ?? ""}
          className=""
          editing={editing}
          setInputImage={(url) =>
            setInput((prev) => {
              return {
                ...prev,
                image_url: url ?? "",
              };
            })
          }
        />
        {/* <TheTextInput
          field_key={"image_url"}
          field_name={"Image Url"}
          value={input["image_url"]}
          type="url"
          onChange={handleChange}
          editing={editing}
        /> */}

        <div className=" flex w-full flex-wrap items-center justify-center gap-5 lg:flex-row">
          <TheStringListInput
            editing={editing}
            field_name="Languages"
            field_key="languages"
            input={input}
            setInput={setInput}
          />

          <TheStringListInput
            editing={editing}
            field_name="Libraries"
            field_key="libraries"
            input={input}
            setInput={setInput}
          />
        </div>

        {create_mutation?.data && "error" in create_mutation?.data && (
          <div className="rounded-lg border p-2 text-error">
            {create_mutation?.data?.error?.message}
          </div>
        )}
        {update_mutation?.data && "error" in update_mutation?.data && (
          <div className="rounded-lg border p-2 text-error">
            {update_mutation?.data?.error?.message}
          </div>
        )}

        {editing && (
          <div className="flex w-full items-center justify-center">
            <SubmitButton
              loading={create_mutation.isPending || update_mutation.isPending}
              label={updating ? "Update" : "Create"}
            />
          </div>
        )}
      </form>
    </div>
  );
}
