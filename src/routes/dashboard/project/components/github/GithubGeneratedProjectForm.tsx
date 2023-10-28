import { Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import { TProjectInputType, projectApi} from "@/routes/api/helpers/prisma/projects";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { TheTextAreaInput } from "@/components/form/inputs/TheTextArea";
import { TheListInput } from "@/components/form/inputs/ListInput";
import { usePageContext, useSSM } from "rakkasjs";
import { SherpaProjectsCreate, SherpaProjectsResponse } from "@/lib/pb/db-types";
import { useMutation } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/async";
import { TheStringListInput } from "@/components/form/inputs/StringListInput";


interface GithubGeneratedProjectFormProps {
  generated_project: SherpaProjectsResponse;
  direct_create?: boolean;
  addProjectTList?: (project: SherpaProjectsResponse) => void;
  setProjectToGenerate: React.Dispatch<React.SetStateAction<string>>;
  project: SherpaProjectsResponse;
  setProject: React.Dispatch<React.SetStateAction<SherpaProjectsResponse>>;
  modal_id: string;
}

export function GithubGeneratedProjectForm({
  generated_project,
  project,
  setProject,
  setProjectToGenerate,
  addProjectTList,
  direct_create,
  modal_id,
}: GithubGeneratedProjectFormProps) {
  const [generatedProject, setGeneratedProject] = useState(generated_project);
  const page_ctx = usePageContext();
  const qc = page_ctx.queryClient;

  // const create_mutation = useSSM<
  //   Awaited<ReturnType<typeof projectApi.addNew>>,
  //   SherpaProjectsResponse
  // >(async (ctx, vars) => {
  //   return await projectApi.addNew({ input: vars });
  // });

  const create_mutation = useMutation({
    mutationFn: async (vars: SherpaProjectsCreate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_projects").create(vars),
      );
    },
  });

  function handleCreateproject() {
    if (direct_create) {
      create_mutation
        .mutateAsync(project)
        .then(() => toast("Project added successfully", { type: "success" }))
        .catch((error: any) =>
          toast(error.message, { type: "error", autoClose: false })
        );
    }
    qc.invalidateQueries("projects");
    setProject((prev) => {
      return generatedProject;
    });

    addProjectTList && addProjectTList(generatedProject);
    setProjectToGenerate("");
    const hidden_checkbox = document.getElementById(
      modal_id
    ) as HTMLInputElement;
    if (hidden_checkbox && hidden_checkbox.type === "checkbox") {
      hidden_checkbox.checked = false;
    }
  }

  function handleRejectproject() {
    setProjectToGenerate("");
    const hidden_checkbox = document.getElementById(
      modal_id
    ) as HTMLInputElement;
    if (hidden_checkbox && hidden_checkbox.type === "checkbox") {
      hidden_checkbox.checked = false;
    }
  }
  return (
    <div className="flex h-full w-full flex-col  items-center justify-center gap-4">
      <div className=" flex w-[90%] flex-col items-center justify-center gap-4 p-2 text-success">
        <div className="flex w-full  items-center">
          <h3 className="w-full text-2xl font-bold">{generatedProject.name}</h3>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <TheTextInput
            field_key={"name"}
            field_name="name"
            val={generatedProject.name}
            editing={true}
            onChange={(e) => {
              setGeneratedProject({
                ...generatedProject,
                name: e.target.value,
              });
            }}
          />
          <TheTextInput
            field_key={"repoUrl"}
            field_name="Repository Url"
            val={generatedProject.repo_url}
            editing={true}
            onChange={(e) => {
              setGeneratedProject({
                ...generatedProject,
                repo_url: e.target.value,
              });
            }}
          />
          <TheTextAreaInput
            field_key={"description"}
            field_name="Description"
            value={generatedProject.description}
            editing={true}
            onChange={(e) => {
              setGeneratedProject({
                ...generatedProject,
                description: e.target.value,
              });
            }}
          />

          <TheStringListInput
            editing={true}
            field_name="Languages"
            field_key="languages"
            input={generatedProject}
            setInput={setGeneratedProject}
          />
          <TheStringListInput
            editing={true}
            field_name="Libraries"
            field_key="libraries"
            input={generatedProject}
            setInput={setGeneratedProject}
          />
        </div>
      </div>

      <span className="flex w-full items-center justify-evenly gap-4">
        <button
          type="button"
          onClick={() => handleCreateproject()}
          className="btn btn-outline"
        >
          <Check className="h-6 w-6 text-success" />
        </button>
        <button
          onClick={() => handleRejectproject()}
          className="btn btn-outline"
        >
          <X className="h-6 w-6 text-error" />
        </button>
      </span>
    </div>
  );
}
