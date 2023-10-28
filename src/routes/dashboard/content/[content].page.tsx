import { PageProps, usePageContext } from "rakkasjs";
import { ContentForm } from "./components/ContentForm";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { useQuery } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/async";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";

export default function ContentPage({params}:PageProps) {
  const page_ctx = usePageContext()
  const {} = useUser()

    const query = useQuery({
      queryKey: ["content", params.content],
      queryFn: () => {
        return tryCatchWrapper(
          page_ctx.locals.pb?.collection("sherpa_content").getOne(params.content),
        );
      },
    })

    if ( query.data?.error || query.error) {
      <PBReturnedUseQueryError error={query.data?.error??query.error} />;
    }

  if (!query.data) {
    return (
      <div className="flex h-full  w-full items-center justify-center p-2">
        <div className="rounded-lg border p-2 text-3xl text-warning">
          no matches found
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-[95%] flex-col gap-3 p-1 md:w-[80%] md:p-5 lg:w-[60%]">
        <ContentForm default_value={query.data.data} updating={true} />
      </div>
    </div>
  );
}


