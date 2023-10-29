import { TheListInput } from "@/components/form/inputs/ListInput";
import { projectApi } from "@/routes/api/helpers/prisma/projects";
import { useSSQ } from "rakkasjs";
import { useEffect } from "react";
import { ResumeFields } from "./ResumeMutiStepForm";
import { TheStringListInput } from "@/components/form/inputs/StringListInput";

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
    
  
  const query = useSSQ(
        (ctx) => {
            // return projectApi.findByName({
            //     user_id: user_id!,
            //     item_name: debouncedValue,
            // });
            return projectApi.getAll({
              user_id: user_id!,
            });
        },
        { refetchOnWindowFocus: true, refetchOnMount: true },
    );

useEffect(() => {
    if (query.data && !('error' in query.data)) {
        const packagesAndLanguages = query.data.reduce(
            (
                acc: {
                    languages: Set<string>;
                    libraries: Set<string>;
                },
                item,
            ) => {
                item.languages.forEach((language) =>
                    acc.languages.add(language),
                );
                item.libraries.forEach((library) => acc.libraries.add(library));
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
