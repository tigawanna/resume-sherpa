import { ReturnedUseQueryEror } from "@/components/error/ReturnedUseQueryEror";
import { educationApi } from "@/routes/api/helpers/prisma/education";
import { PageProps, usePageContext, useQueryClient, useSSQ } from "rakkasjs";
import { EducationForm } from "./components/EducationForm";
import { useQuery } from "@tanstack/react-query";
import { PBReturnedUseQueryError } from "@/components/error/PBReturnedUseQueryEror";
import { tryCatchWrapper } from "@/utils/async";


export default function EducationPage({params}:PageProps) {
  const page_ctx = usePageContext();
  const query = useQuery({
    queryKey: ["sherpa_education", params.education],
    queryFn: () => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_education")
          .getOne(params.education),
      );
    },
  });

  console.log("query.dta  ==== ",query.data)
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
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-[95%] flex-col gap-3 p-1 md:w-[80%] md:p-5 lg:w-[60%]">
        <EducationForm
          default_value={query?.data?.data}
          updating={true}
      
        />
      </div>
    </div>
  );
}


