import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { TheFormModal } from "@/components/modal/TheFormModal";
import { GithubIcon } from "lucide-react";
import { Suspense, useState } from "react";
;import { SherpaProjectsCreate, SherpaProjectsResponse, SherpaUserResponse } from "@/lib/pb/db-types";
import { SkeletonLoader } from "@/components/navigation/loaders/SkeletonLoader";
import { SearchGithubprojects } from "./SearchGithubprojects";


interface AddFromGithubProps {
modal_id: string;
project: SherpaProjectsCreate;
setProject: React.Dispatch<React.SetStateAction<SherpaProjectsCreate>>;
profile:SherpaUserResponse
}

export function AddFromGithub({modal_id,profile,project,setProject}:AddFromGithubProps){
const [keyword, setKeyword] = useState('')
const [github_username,setGithubUsername]=useState(profile?.github_username)
  function handleChange(e: any) {
    setKeyword(e.target.value);
  }
  function handleGithubUsernameChange(e:any){
    setGithubUsername(e.target.value)
  }
  return (
  <TheFormModal
    id={modal_id}
    close_on_bg_click={true}
    label={
      <span className="btn btn-outline flex gap-2 ">
        <h3> add from github</h3>
        <GithubIcon className="h-6 w-6" />
      </span>
    }
  >
    <div>
    <div className=" relative flex w-full items-center justify-center">
{      !(github_username||github_username==="")?<TheTextInput
        value={github_username}
        field_key={"github"}
        field_name="Github Username"
        onChange={handleChange}
        />:
      <TheTextInput
        value={keyword}
        field_key={"keyword"}
        field_name="Search"
        onChange={handleChange}
        />}

    </div>
    <Suspense fallback={<SkeletonLoader items={9}/>}>
      {(github_username||github_username==="") &&
    <SearchGithubprojects
      project={project}
      setProject={setProject}
      github_username={github_username??""}
      modal_id={modal_id}
      keyword={keyword}
    />}
    </Suspense>
    </div>
  </TheFormModal>
);
}
