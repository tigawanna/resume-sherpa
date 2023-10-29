import { Plus } from "lucide-react";
import { EducationCard } from "./EducationCard";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { Link, navigate, usePageContext} from "rakkasjs";
import { useQuery } from "@tanstack/react-query";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { tryCatchWrapper } from "@/utils/async";
import { numberToArray } from "@/utils/helpers/others";
import { useSearchWithQuery } from "@/utils/hooks/search";

interface EducationsProps {

}

export function Educations({}:EducationsProps){
  
  const page_ctx = usePageContext();
  const { debouncedValue, isDebouncing, keyword, setKeyword } =
    useSearchWithQuery();
  const page_number = parseInt(page_ctx.url.searchParams.get("p") ?? "1") ?? 1;
  const query = useQuery({
    queryKey: ["sherpa_education", debouncedValue, page_number],

    queryFn: async () => {
      // console.log("page arams  ====== ",pageParam)
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_education")
          .getList(page_number, 12, {
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

  const error = query?.data?.error;
  const data = query?.data?.data?.items;
  const total_pages = query?.data?.data?.totalPages;
  const pages_arr = numberToArray(total_pages!);
  function goToPage(page: number) {
    page_ctx.url.searchParams.set("p", page.toString());
    navigate(page_ctx.url);
  }

return (
  <div className="flex h-full w-full flex-col items-center  gap-2 pb-5">
    {/* header + search bar + add new link */}
    <div className="sticky top-[5%]   flex w-full flex-wrap items-center justify-evenly gap-3 p-2">
      <h3 className="text-2xl font-bold hidden md:flex">Education</h3>
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

    <div className="flex  w-full h-full flex-col justify-between items-center gap-2 px-5">
      <div className="flex  w-full flex-wrap   gap-2">
        {data &&
          data.map((item) => {
            if (item) {
              return <EducationCard item={item} key={item.id} />;
            }
          })}
      </div>
      <div className="join">
        {pages_arr.map((item) => {
          return (
            <button
              key={item}
              onClick={() => goToPage(item)}
              className={
                item === page_number
                  ? "join-item btn btn-sm btn-active"
                  : "join-item btn btn-sm"
              }
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
}
