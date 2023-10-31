import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { useDebouncedValue } from "@/utils/hooks/debounce";
import { Plus, X } from "lucide-react";
import { Link, usePageContext } from "rakkasjs";
import { useState } from "react";
import { ResumeFields } from "./ResumeMutiStepForm";
import { useQuery } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/async";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { SherpaProjectsResponse } from "@/lib/pb/db-types";


interface ResumeProjectsProps {
  user_id: string;
  input: ResumeFields;
  setInput: React.Dispatch<React.SetStateAction<ResumeFields>>;
  handleChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}
export function ResumeProjects({user_id,input,setInput}:ResumeProjectsProps){
  const page_ctx = usePageContext();
  const [keyword, setKeyword] = useState("");
  const { debouncedValue, isDebouncing } = useDebouncedValue(keyword, 2000);
  const query = useQuery({
      queryKey: ["sherpa_projects", debouncedValue],

      queryFn: async () => {
        // console.log("page arams  ====== ",pageParam)
        return tryCatchWrapper(
          page_ctx.locals.pb
            ?.collection("sherpa_projects")
            .getList(1,12,{
              sort: "-created",
              filter: `name~"${debouncedValue}"`,
            }),
        );
      },
    });

    if (query.error) {
      return <PBReturnedUseQueryError error={query?.error} />;
    }

  function handleChange(e: any) {
    setKeyword(e.target.value);
  }



  const isSelected = (id?: string) => {
    if(id){
      return input.projects.some((val) => {
         return val.id === id;
       });
      }
      return false
  };

  const handleAddItem = ({
   id,
   name,
   description,
   languages,
  libraries,
  }: SherpaProjectsResponse) => {
    setInput((prev) => {
      if (id && prev.projects.some((val) =>val.id === id)) {
        return prev;
      }
      return {
        ...prev,
        projects: [
          ...prev.projects,
          {
            id: id as string,
            name,
            description,
            languages: languages ?? "",
            libraries: libraries ?? "",
          },
        ],
      };
    });
  };
  const handleRemoveItem = ({ id }: SherpaProjectsResponse) => {
      setInput((prev) => {
          const filtered = prev.projects.filter((item) => item.id !== id);
          return { ...prev, projects: filtered };
      });
  };

const projects = query.data?.data?.items
return (
  <div className="flex h-full w-full flex-col items-center justify-center">
    {/* header+ search bar + add new project link */}
    <div className="sticky top-[5%] flex w-full flex-wrap items-center justify-evenly gap-3 p-2">
      <div className=" relative flex min-w-[70%] items-center  justify-center gap-1 md:min-w-[50%]">
        <TheTextInput
          label_classname="hidden"
          value={keyword}
          field_key={"keyword"}
          placeholder="Search for project"
          field_name="Search"
          onChange={handleChange}
        />
        {(query.isRefetching || isDebouncing) && (
          <div className="absolute  flex w-full items-center justify-center gap-3 p-2">
            <span className="loading loading-infinity loading-lg text-warning"></span>
          </div>
        )}
      </div>
      <Link
        href={`/dashboard/project/new`}
        className="btn btn-outline sticky right-[3%] top-[3%]"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>

    {!projects && (
      <div className="flex h-full  w-full items-center justify-center p-2">
        <div className="rounded-lg border p-2 text-info">no matches found</div>
      </div>
    )}
 
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {projects &&
        projects.map((item) => {
          return (
            <div
              key={item.id}
              className="sm:2-[45%] card  max-h-[400px] min-h-[100px] 
             w-[95%] border  bg-base-100 shadow-xl hover:border-accent md:w-[30%]"
            >
              <div className=" flex w-full items-center justify-end p-2">
                {isSelected(item.id) ? (
                  <X
                    className="h-6 w-6 text-error"
                    onClick={() => handleRemoveItem(item)}
                  />
                ) : (
                  <Plus
                    className="h-6 w-6 text-success"
                    onClick={() => handleAddItem(item)}
                  />
                )}
              </div>
              <div className="flex w-full flex-col gap-1 p-2">
                <h2 className="card-title">{item.name}</h2>
                <p className="line-clamp-3 text-sm">{item.description}</p>


              </div>
            </div>
          );
        })}
    </div>

  </div>
);
}
