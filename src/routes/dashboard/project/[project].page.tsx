import { PageProps } from "rakkasjs";
import { ProjectForm } from "./components/ProjectForm";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { useQuery } from "@tanstack/react-query";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { tryCatchWrapper } from "@/utils/async";


export default function OneProject({ meta, url,params}: PageProps) {
  const {page_ctx} = useUser();
  const query = useQuery({
      queryKey: ["sherpa_projects", params.project],
      queryFn: () => {
        return tryCatchWrapper(
          page_ctx.locals.pb
            ?.collection("sherpa_projects")
            .getOne(params.project),
        );
      },
    });



  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {query.isRefetching && (
        <span className="loading loading-infinity loading-lg text-warning"></span>
      )}
      {(query.data?.error || query.error)?
      <PBReturnedUseQueryError error={query.data?.error ?? query.error} />:
      <div className="flex w-[95%] flex-col gap-3 p-1 md:w-[80%] md:p-5 lg:w-[60%]">
        <ProjectForm project={query?.data?.data} updating={true} />
      </div>
      
      }
    </div>
  );
}
