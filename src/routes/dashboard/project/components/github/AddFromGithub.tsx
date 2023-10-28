import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { TheFormModal } from "@/components/modal/TheFormModal";
import { GithubIcon } from "lucide-react";
import { Suspense, useState } from "react";
;import { SherpaProjectsResponse, SherpaUserResponse } from "@/lib/pb/db-types";


interface AddFromGithubProps {
modal_id: string;
project: SherpaProjectsResponse;
setProject: React.Dispatch<React.SetStateAction<SherpaProjectsResponse>>;
profile:SherpaUserResponse
}

export function AddFromGithub({modal_id,profile,project,setProject}:AddFromGithubProps){
const [keyword, setKeyword] = useState('');
  function handleChange(e: any) {
    setKeyword(e.target.value);
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
      <TheTextInput
        value={keyword}
        field_key={"keyword"}
        field_name="Search"
        onChange={handleChange}
        />

    </div>
    {/* <Suspense fallback={<SkeletonLoader items={9}/>}>
    <SearchGithubprojects
      project={project}
      github_username={profile?.github_username ?? ""}
      setProject={setProject}
      modal_id={modal_id}
      keyword={keyword}
    />
    </Suspense> */}
    </div>
  </TheFormModal>
);
}
