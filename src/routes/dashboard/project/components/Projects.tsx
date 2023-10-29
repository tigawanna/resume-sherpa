import { Plus } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { Link, navigate, usePageContext, useSSQ } from "rakkasjs";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { tryCatchWrapper } from "@/utils/async";
import { useSearchWithQuery } from "@/utils/hooks/search";
import { useQuery } from "@tanstack/react-query";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { numberToArray } from "@/utils/helpers/others";

interface ProjectsProps {}

export function Projects({}: ProjectsProps) {
  const page_ctx = usePageContext();
  const { debouncedValue, isDebouncing, keyword, setKeyword } =
    useSearchWithQuery();
  const page_number = parseInt(page_ctx.url.searchParams.get("p") ?? "1") ?? 1;

  const query = useQuery({
    queryKey: ["sherpa_projects", debouncedValue, page_number],

    queryFn: async () => {
      // console.log("page arams  ====== ",pageParam)
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_projects")
          .getList(page_number, 12, {
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

  const error = query?.data?.error;
  const data = query?.data?.data?.items;
  const total_pages = query?.data?.data?.totalPages;
  const pages_arr = numberToArray(total_pages!);
  function goToPage(page: number) {
    page_ctx.url.searchParams.set("p", page.toString());
    navigate(page_ctx.url);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-start py-3 gap-5 pb-5">
      {/* header+ search bar + add new project link */}
      <div className="sticky top-[5%] flex flex-wrap w-full items-center justify-evenly p-2 gap-3">
        <h2 className="text-2xl font-bold hidden sm:flex">Projects</h2>
        <div className=" relative flex md:min-w-[50%] min-w-[70%]  items-center justify-center gap-1">
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

      {(!data || (data && data?.length === 0)) && !error && (
        <div className="flex h-full  w-full items-center justify-center p-2">
          <div className="rounded-lg border p-2 text-info">
            no matches found
          </div>
        </div>
      )}

      {error && (
        <div className="flex h-full  w-full items-center justify-center p-2">
          <PBReturnedUseQueryError error={error} />
        </div>
      )}
      {/* projects list */}
      <div className="flex  w-full h-full flex-col justify-between items-center gap-2 px-5">
        <div className="flex w-full flex-wrap items-center justify-start px-7 gap-2">
          {data &&
            data.map((project) => {
              if (project) {
                return <ProjectCard key={project?.id} item={project} />;
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
