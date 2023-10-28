import { Plus } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { Link, usePageContext, useSSQ } from "rakkasjs";
import { Spinner } from "@/components/navigation/loaders/Spinner";
import { Suspense, useState } from "react";
import { useDebouncedValue } from "@/utils/hooks/debounce";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { ReturnedUseQueryEror } from "@/components/error/ReturnedUseQueryEror";
import { tryCatchWrapper } from "@/utils/async";
import { useSearchWithQuery } from "@/utils/hooks/search";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";


interface ProjectsProps {}

export function Projects({}: ProjectsProps) {
const page_ctx= usePageContext()
const { debouncedValue, isDebouncing, keyword, setKeyword } = useSearchWithQuery();
const query = useInfiniteQuery({
  queryKey: ["sherpa_projects", debouncedValue],
  initialPageParam: 1,
  queryFn: async ({ pageParam }) => {
    // console.log("page arams  ====== ",pageParam)
    return tryCatchWrapper(
      page_ctx.locals.pb?.collection("sherpa_projects").getList(pageParam, 2, {
        sort: "-created",
        filter: `name~"${debouncedValue}"`,
      }),
    );
  },

  getNextPageParam: (lastPage, allPages) => {
    if (lastPage?.data) {
      if (lastPage?.data?.totalPages > lastPage?.data?.page) {
        return lastPage?.data?.page + 1;
      }
    }
  },
});
  
  function handleChange(e: any) {
    setKeyword(e.target.value);
  }
  const projects = query.data;

    const error = query?.data?.pages
      ?.flatMap((page) => page?.error)
      ?.filter((item) => item && item !== null);
    const data = query?.data?.pages
      ?.flatMap((page) => page?.data?.items)
      ?.filter((item) => item);

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

      {error && error?.length > 0 && (
        <div className="flex h-full  w-full items-center justify-center p-2">
          <PBReturnedUseQueryError error={error[0]} />
        </div>
      )}
      {/* projects list */}

      <div className="flex w-full flex-wrap items-center justify-start px-7 gap-2">
        {data &&
          data.map((project) => {
            if (project) {
              return <ProjectCard key={project?.id} item={project} />;
            }
          })}
      </div>

      <button
        onClick={() => query.fetchNextPage()}
        disabled={!query.hasNextPage || query.isFetchingNextPage}
        className="btn btn-sm btn-outline"
      >
        {query.isFetchingNextPage
          ? "Loading more..."
          : query.hasNextPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
}
