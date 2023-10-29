import { PageProps, usePageContext} from "rakkasjs";
import { ExperienceForm } from "./components/ExperienceForm";
import { useQuery } from "@tanstack/react-query";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { tryCatchWrapper } from "@/utils/async";


export default function ExperiencePage({params}:PageProps) {
  const page_ctx = usePageContext();
  const query = useQuery({
    queryKey: ["sherpa_experience", params.experience],
    queryFn: () => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_experience")
          .getOne(params.experience),
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
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2">
      <div className="flex w-[95%] flex-col gap-3 p-1 md:w-[80%] md:p-5 lg:w-[60%]">
        <ExperienceForm default_value={query?.data?.data} updating={true} />
      </div>
    </div>
  );
}


