import {  useState } from "react";
import { PageProps} from "rakkasjs";
import { AddFromGithub } from "./components/github/AddFromGithub";
import { ProjectForm } from "./components/ProjectForm";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { SherpaProjectsCreate } from "@/lib/pb/db-types";


export default function NewProject({params}: PageProps) {
const {user_query:{data:user}}=useUser()
const [project, setProject] = useState<SherpaProjectsCreate>({

    description: "",
    languages:"",
    repo_url: "",
    image_url: "",
    name: "",
    libraries:"",
    user: user?.id!,
    image: "",
  });

  const modal_id = "add_project_from_github";
  return (
    <div className="flex h-full  w-full flex-col items-center justify-center">
      <div className="flex w-[95%] flex-col gap-3 p-1 md:w-[80%] md:p-5 lg:w-[60%]">
        <div className="sticky right-[4%] top-[10%]  flex w-full  items-center justify-start ">
          {user && (
            <AddFromGithub
              project={project}
              modal_id={modal_id}
              profile={user}
              setProject={setProject}
            />
          )}
        </div>

        <ProjectForm
          // @ts-expect-error
          project={project}
          key={
            project?.name +
            project?.languages +
            project?.libraries +
            project?.repo_url
          }
        />
      </div>
    </div>
  );
}
