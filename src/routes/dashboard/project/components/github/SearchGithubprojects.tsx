import { Suspense, useState } from "react";
import { GithubGeneratedProjectForm } from "./GithubGeneratedProjectForm";
import { useDebouncedValue } from "@/utils/hooks/debounce";
import { useQuery, useSSM } from "rakkasjs";
import { githubApi } from "@/routes/api/helpers/github/github";
import { RepositoryResponse } from "@/routes/api/helpers/github/types";
import { SherpaProjectsCreate, SherpaProjectsResponse } from "@/lib/pb/db-types";



interface SearchGithubprojectsProps {
  github_username: string;
  keyword: string;
  modal_id: string;
  project: SherpaProjectsCreate;
  setProject: React.Dispatch<React.SetStateAction<SherpaProjectsCreate>>;
  direct_create?: boolean;
  addProjectTList?: (project: SherpaProjectsCreate) => void;
}

export function SearchGithubprojects({
  github_username,
  setProject,
  keyword,
  project,
  addProjectTList,
  modal_id,
  direct_create = false,
}: SearchGithubprojectsProps) {

  const [projectToGenerate, setProjectToGenerate] = useState("");
  const { debouncedValue, isDebouncing } = useDebouncedValue(keyword, 2000);


 const query = useQuery("github-projects"+debouncedValue, () =>
      githubApi.searchRepoByName({
        owner: github_username,
        keyword: debouncedValue,
      })
    );
  


const create_project_from_github_mutation = useSSM<
  Awaited<ReturnType<typeof githubApi.getProjectFromGithub>>,
  RepositoryResponse
>((ctx, vars) => {
  return githubApi.getProjectFromGithub({
    owner: github_username,
    repo: vars.name,
  });
});



  function handleSelectProject(repo: RepositoryResponse) {
    setProjectToGenerate(repo.name as string);
    create_project_from_github_mutation.mutateAsync(repo);
  }




  if (create_project_from_github_mutation.data) {
    return (
      <GithubGeneratedProjectForm
        project={project}
        // @ts-expect-error
        generated_project={create_project_from_github_mutation.data}
        modal_id={modal_id}
        setProject={setProject}
        setProjectToGenerate={setProjectToGenerate}
        addProjectTList={addProjectTList}
        direct_create={direct_create}
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col  items-center justify-center gap-2">
      <div className=" relative flex w-full items-center justify-center">
        {(isDebouncing || query.isRefetching) && (
          <div className="absolute top-[20%] flex w-full items-center justify-center p-2">
            <span className="loading loading-infinity loading-lg text-warning"></span>
          </div>
        )}
      </div>

      {query.error && (
        <div className="flex w-full items-center justify-center p-2">
          <div className="rounded-lg border p-2 text-error">
            {query.error.message}
          </div>
        </div>
      )}

      <div className="flex w-full flex-wrap  items-center justify-center gap-2">
        {query.data && "error" in query.data && (
          <div className="rounded-lg border p-2 text-error">
            {query.data.error.message}
          </div>
        )}
        {query.data &&
          !("error" in query.data) &&
          query.data?.items?.map((project) => {
            return (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project)}
                className="card relative min-h-[100px] w-[95%] cursor-pointer border bg-base-100 shadow-xl  hover:border-accent "
              >
                <div className="flex w-full flex-col gap-1 p-2">
                  <div className="flex w-full  items-center">
                    <h3 className="w-full text-2xl font-bold">
                      {project.name}
                    </h3>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center">
                    {project?.description !== "" && (
                      <div className="flex w-full items-center justify-center">
                        <p className="line-clamp-3 w-full">
                          {project.description}
                        </p>
                      </div>
                    )}
                  </div>
                  {projectToGenerate === project.name &&
                    create_project_from_github_mutation.isLoading && (
                      <div className=" absolute flex h-full w-full items-center justify-center bg-base-200 bg-opacity-70">
                        <span className="loading loading-infinity loading-lg text-accent"></span>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
