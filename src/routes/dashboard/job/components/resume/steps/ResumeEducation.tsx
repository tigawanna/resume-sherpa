import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { Spinner } from "@/components/navigation/loaders/Spinner";
import { useDebouncedValue } from "@/utils/hooks/debounce";
import { Plus, X } from "lucide-react";
import { Link, usePageContext } from "rakkasjs";
import { Suspense, useState } from "react";
import { ResumeFields } from "./ResumeMutiStepForm";
import { useQuery } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/async";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { SherpaEducationResponse } from "@/lib/pb/db-types";
import { dateToString } from "@/utils/helpers/others";



interface ResumeEducationProps {
  user_id: string;
  input: ResumeFields;
  setInput: React.Dispatch<React.SetStateAction<ResumeFields>>;
  handleChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}
export function ResumeEducation({user_id,input,setInput}:ResumeEducationProps){
const page_ctx = usePageContext()
const [keyword, setKeyword] = useState("");
const { debouncedValue, isDebouncing } = useDebouncedValue(keyword, 2000);

  const query = useQuery({
    queryKey: ["sherpa_education", debouncedValue],

    queryFn: async () => {
      // console.log("page arams  ====== ",pageParam)
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_education")
          .getList(1, 12, {
            sort: "-created",
            filter: `school~"${debouncedValue}"||qualification~"${debouncedValue}"||field~"${debouncedValue}"`,
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


const isSelected=(id?:string)=>id&&input.education.some((val) => val.id === id)

const handleAddItem = ({ id,field,from,to,qualification,school }: SherpaEducationResponse) => {
  setInput((prev)=>{
    if (
      prev.education.some((val) => {
        return val.id === id;
      })
    ){
      return prev
    }
      return {
        ...prev,
        education: [
          ...prev.education,
          { id:id as string, field, from, to, qualification, school },
        ],
      };
  })
};
const handleRemoveItem = (id?:string) => {
  if(!id) return
  setInput((prev)=>{
    const filtered = prev.education.filter(item=>item.id!==id)
    return { ...prev, education:filtered };
  })
};

const data = query?.data?.data?.items

return (
  <div className="flex h-full w-full flex-col items-center justify-center">
    {/* header + search bar + add new link */}
    <div className="sticky top-[5%] flex w-full flex-wrap items-center justify-evenly gap-3 p-2">
      <div className=" relative flex min-w-[70%] items-center  justify-center gap-1 md:min-w-[50%]">
        <TheTextInput
          label_classname="hidden"
          val={keyword}
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

      <Link href={`/dashboard/education/new`} className="btn btn-outline">
        <Plus className="h-6 w-6" />
      </Link>
    </div>
    {!data && (
      <div className="flex h-full  w-full items-center justify-center p-2">
        <div className="rounded-lg border p-2 text-info">no matches found</div>
      </div>
    )}
    {/* education */}

    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {data &&
        data.map((item) => {
          return (
            <div
              key={item.id}
              className="flex w-full flex-col justify-center gap-1 rounded-md border 
          p-2 hover:border-accent sm:w-[45%] lg:w-[30%] "
            >
              <div className=" flex w-full items-center justify-end">
                {isSelected(item?.id) ? (
                  <X
                    className="h-6 w-6 text-error"
                    onClick={() => handleRemoveItem(item?.id)}
                  />
                ) : (
                  <Plus
                    className="h-6 w-6 text-success"
                    onClick={() => handleAddItem(item)}
                  />
                )}
              </div>

              <h3 className="text-2xl font-bold">{item.school}</h3>
              <h3 className="text-lg">{item.field}</h3>
              <h3 className="">{item.qualification}</h3>
              {/* <div className=" flex items-center justify-between text-sm">
                <h3>From : {item.from.toISOString().split("T")[0]}</h3>
                <h3>To : {item.to.toISOString().split("T")[0]}</h3>
              </div> */}
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
