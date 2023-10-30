import { SherpaContentResponse } from "@/lib/pb/db-types";
import { tryCatchWrapper } from "@/utils/async";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { InfiniteData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ListResult } from "pocketbase";
import { PageProps } from "rakkasjs"
export default function Page({}:PageProps) {
    const { user_query, page_ctx } = useUser()
      
const query = useInfiniteQuery<ListResult<SherpaContentResponse>, Error, InfiniteData<ListResult<SherpaContentResponse>, number>, string[],number>({
        queryKey: ["contents"],
        initialPageParam: 1,
        queryFn: async ({ pageParam, }) => {
          return await page_ctx.locals.pb
            ?.collection("sherpa_content")
            .getList(pageParam, 50, {
              sort: "-created",
            });
        },

        getNextPageParam: (lastPage, allPages) => {
          // console.log({ lastPage, allPages });
          return lastPage.page + 1;
        },
      });

// console.log("query  ===== ",query)
return (
<div className="w-full h-full min-h-screen flex items-center justify-center">
  {JSON.stringify(query)}
</div>
)}
