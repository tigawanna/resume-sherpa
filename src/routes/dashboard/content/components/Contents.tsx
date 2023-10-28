import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { Plus } from "lucide-react";
import { Link, usePageContext } from "rakkasjs";
import { ContentCard } from "./ContentCard";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { useInfiniteQuery } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/async";
import { useSearchWithQuery } from "@/utils/hooks/search";

interface ContentsProps {}

export function Contents({}: ContentsProps) {
const page_ctx = usePageContext();

  const { debouncedValue, isDebouncing, keyword, setKeyword } = useSearchWithQuery();
   const query = useInfiniteQuery({
    queryKey: ["sherpa_content", debouncedValue],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      // console.log("page arams  ====== ",pageParam)
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_content").getList(pageParam,2, {
          sort: "-created",
          filter: `title~"${debouncedValue}"`,
        }),
      );
    },

    getNextPageParam: (lastPage, allPages) => {
      if(lastPage?.data){
        if(lastPage?.data?.totalPages > lastPage?.data?.page){
          return lastPage?.data?.page  + 1;
        }
      }
    },
  });

  if (query.error) {
    return <PBReturnedUseQueryError error={query?.error} />;
  }

  function handleChange(e: any) {
    setKeyword(e.target.value);
  }

  const error = query?.data?.pages
    ?.flatMap((page) => page?.error)
    ?.filter((item) => item && item !== null);
  const data = query?.data?.pages
    ?.flatMap((page) => page?.data?.items)
    ?.filter((item) => item);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start py-3 gap-5 pb-5">
      {/* header + search bar + add new link */}
      <div className="sticky top-[5%] flex w-full flex-wrap items-center justify-evenly gap-3 p-2">
        <h3 className="text-2xl font-bold hidden sm:flex">Content</h3>
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
        <Link
          href={`/dashboard/content/new`}
          className="btn btn-sm btn-outline h-auto"
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

      {/* contents */}

      <div className="flex w-full flex-wrap items-center justify-center px-7 gap-2">
        {data &&
          data.map((item) => {
            if (item) {
              return <ContentCard item={item} key={item?.id} />;
            }
          })}
      </div>
      <button
        onClick={() => query.fetchNextPage()}
        disabled={!query.hasNextPage || query.isFetchingNextPage}
        className="btn btn-sm btn-outline">
        {query.isFetchingNextPage
          ? "Loading more..."
          : query.hasNextPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
}
