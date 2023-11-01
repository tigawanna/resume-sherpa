import { PageProps, usePageContext} from "rakkasjs"
import { MainJobApplicationForm } from "./components/MainJobApplicationForm";
import { useQuery } from "@tanstack/react-query";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { tryCatchWrapper } from "@/utils/async";

export default function JobApplicationPage({params}:PageProps) {
  const page_ctx = usePageContext();
  const query = useQuery({
    queryKey: ["sherpa_job_application", params.job],
    queryFn: () => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_job_application")
          .getOne(params.job),
      );
    },
  });

  if (query.data?.error || query.error) {
    <PBReturnedUseQueryError error={query.data?.error ?? query.error} />;
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
    <div className="flex h-full w-full items-center justify-center">
        <MainJobApplicationForm default_value={query.data?.data} updating={true} />
    </div>
  );
}
