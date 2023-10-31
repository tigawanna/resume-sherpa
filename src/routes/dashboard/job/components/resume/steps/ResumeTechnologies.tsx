import { useEffect } from "react";
import { ResumeFields } from "./ResumeMutiStepForm";
import { TheStringListInput } from "@/components/form/inputs/StringListInput";
import { useQuery } from "@tanstack/react-query";
import { tryCatchWrapper } from "@/utils/async";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";

interface ResumeTechnologiesProps {
  user_id: string;
  input: ResumeFields;
  setInput: React.Dispatch<React.SetStateAction<ResumeFields>>;
  handleChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}
export function ResumeTechnologies({
    user_id,
    input,
    setInput,
}: ResumeTechnologiesProps) {
    const {page_ctx} = useUser()
  const query = useQuery({
    queryKey: ["resume", user_id],
    queryFn: async () => {
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_projects").getList(1, 50),
      );
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  

useEffect(() => {
    if (query.data?.data ) {
        const packagesAndLanguages = query.data.data.items.reduce(
            (
                acc: {
                    languages: Set<string>;
                    libraries: Set<string>;
                },
                item,
            ) => {
                item?.languages?.split(",")?.forEach((language) =>
                    acc.languages.add(language),
                );
                item?.libraries?.split(",")
                  .forEach((library) => acc.libraries.add(library));
                return acc;
            },
            { languages: new Set<string>(), libraries: new Set<string>() },
        );

        setInput((prev) => ({
            ...prev,
            languages: Array.from(packagesAndLanguages.languages).join(","),
            libraries: Array.from(packagesAndLanguages.libraries).join(","),
        }));
    }
}, [query.data]);



    return (
      <div className="flex h-full flex-col w-full items-center justify-center gap-2 p-2">
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <TheStringListInput
            editing={true}
            field_key={"languages"}
            field_name="Languages"
            input={input}
            setInput={setInput}
          />
          <TheStringListInput
            editing={true}
            field_key={"libraries"}
            field_name="Libraries"
            input={input}
            setInput={setInput}
          />
        </div>
      </div>
    );
}
