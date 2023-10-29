import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { Spinner } from "@/components/navigation/loaders/Spinner";
import { useDebouncedValue } from "@/utils/hooks/debounce";
import { Plus, X } from "lucide-react";
import { Link, usePageContext,  } from "rakkasjs";
import { Suspense, useState } from "react";
import { ResumeFields } from "./ResumeMutiStepForm";
import { useQuery } from "@tanstack/react-query";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { tryCatchWrapper } from "@/utils/async";
import { SherpaExperienceResponse } from "@/lib/pb/db-types";


interface ResumeExperienceProps {
  user_id: string;
  input: ResumeFields;
  setInput: React.Dispatch<React.SetStateAction<ResumeFields>>;
  handleChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}
export function ResumeExperience({user_id,input,setInput}:ResumeExperienceProps){
const page_ctx = usePageContext()
 const [keyword, setKeyword] = useState("");
 const { debouncedValue, isDebouncing } = useDebouncedValue(keyword, 2000);
 
  const query = useQuery({
    queryKey: ["sherpa_experience", debouncedValue],

    queryFn: async () => {
      // console.log("page arams  ====== ",pageParam)
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_experience")
          .getList(1, 12, {
            sort: "-created",
            filter: `company~"${debouncedValue}"||position~"${debouncedValue}"||description~"${debouncedValue}"`,
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




const isSelected=(id?:string)=>{
  return id&&input.experience.some((val) =>val.id === id);
}
const handleAddItem = ({ id,position,company,from,to }:SherpaExperienceResponse) => {
  setInput((prev)=>{
    if (
      prev.experience.some((val) => {
        return val.id === id;
      })
    ){
      return prev
    }
      return {
        ...prev,
      experience: [
          ...prev.experience,
          { position,company,from,to,id:id! },
        ],
      };
  })
};
const handleRemoveItem = (id?:string) => {
  if(!id) return
  setInput((prev)=>{
    const filtered = prev.experience.filter(item=>item.id!==id)
    return { ...prev,experience:filtered };
  })
};


 const data = query.data?.data?.items
 

return (
  <div className="flex h-full w-full flex-col items-center justify-center">
    <div className="sticky top-[5%] flex w-full flex-wrap items-center justify-evenly gap-3 p-2">
      <div className=" relative flex min-w-[70%] items-center  justify-center gap-1 md:min-w-[50%]">
        <TheTextInput
          label_classname="hidden"
          value={keyword}
          field_key={"keyword"}
          placeholder="Search"
          field_name="Search"
          onChange={handleChange}
        />
        {(query.isRefetching || isDebouncing) && (
          <div className="absolute  flex w-full items-center justify-center gap-3 p-2">
            <span className="loading loading-infinity loading-lg text-warning"></span>
          </div>
        )}
      </div>
      <Link href={`/dashboard/experience/new`} className="btn btn-outline">
        <Plus className="h-6 w-6" />
      </Link>
    </div>

    {!data && (
      <div className="flex h-full  w-full items-center justify-center p-2">
        <div className="rounded-lg border p-2 text-info">no matches found</div>
      </div>
    )}
    {/* experiences */}

    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {data&&data?.map((item) => {
        return (
          <div
            key={item.id}
            className="flex w-full flex-col justify-center gap-1 rounded-md border 
          p-2 hover:border-accent sm:w-[45%] lg:w-[30%] "
          >
            <div className=" flex w-full items-center justify-end">
              {isSelected(item.id) ? (
                <X
                  className="h-6 w-6 text-error"
                  onClick={() => handleRemoveItem(item?.id!)}
                />
              ) : (
                <Plus
                  className="h-6 w-6 text-success"
                  onClick={() => handleAddItem(item)}
                />
              )}
            </div>
            <h3 className="text-2xl font-bold">{item?.company}</h3>
            <h3 className="text-lg">{item?.position}</h3>
            <p className="line-clamp-3">{item?.description}</p>
            <div className=" flex items-center justify-between text-sm">
              <h3>From : {new Date(item.from).toISOString().split("T")[0]}</h3>
              <h3>To : {new Date(item.to).toISOString().split("T")[0]}</h3>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
}
