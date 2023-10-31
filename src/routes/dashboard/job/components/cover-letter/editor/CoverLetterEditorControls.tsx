import { Spinner } from "@/components/navigation/loaders/Spinner";
import { SherpaJobApplicationResponse, SherpaJobApplicationUpdate } from "@/lib/pb/db-types";
import { ApiRouteResponse } from "@/lib/rakkas/utils/types";
import { apiRouteTryCatchWrapper, tryCatchWrapper, useMutationFetcher } from "@/utils/async";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { useMutation } from "@tanstack/react-query";
import Cherry from "cherry-markdown";
import { Save } from "lucide-react";
import {  usePageContext } from "rakkasjs";
import { toast } from "react-toastify";


interface CoverLetterEditorControlsProps {
  setCoverLetter: (letter: string) => void;
  application_input: SherpaJobApplicationResponse;
  updating?: boolean;
  cherry: Cherry | null;
}

export interface AiGeneratorInput {
  job: string;
  resume: string;
}
export interface AiGeneratorResponse {
  output: string;
  original_response: any;
}
export type AiResumeResponse = ApiRouteResponse<AiGeneratorResponse>;

export function CoverLetterEditorControls({
  cherry,
  application_input,
  setCoverLetter,
  updating,
}: CoverLetterEditorControlsProps) {

const { user_query, page_ctx } = useUser();
const user = user_query?.data;

  const update_job_application_mutation = useMutation({
    mutationFn: (vars: { id: string; data: SherpaJobApplicationUpdate }) => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_job_application")
          .update(vars.id, vars.data),
      );
    },
  });

  const ai_letter_mutation = useMutation({
    mutationFn: (vars: AiGeneratorInput) => {
      return apiRouteTryCatchWrapper(
        useMutationFetcher<AiResumeResponse>(
          page_ctx,
          "/api/ai/letter",
          vars,
          "POST",
        ),
      )
    },
  });

  function saveCoverLetter() {
    const markdown = cherry?.getMarkdown();
    if (!markdown || !application_input?.id) return;
    cherry && setCoverLetter(markdown);
    update_job_application_mutation
      .mutateAsync({

        id: application_input?.id ?? '',
        data:{
          cover_letter: markdown,
          user:user?.id!,

        }
      })
      .then((res) => {
        if (res.error) {
          toast(`Adding cover letter to Job application failed`, {
            type: 'error',
          });
          return;
        }
        if(res.data){
          toast(`Cover letter added to Job application ${res.data.id} successfully`, {
            type: 'success',
          });

        }
      });
  }

  function aiGenerateCoverLetter() {
    const resume = cherry?.getMarkdown();
    if (!resume) {
      return;
    }
    const input = {
      job: application_input.description,
      resume
    };
    // console.log('input  ==== ', input);
    // return
    ai_letter_mutation
      .mutateAsync(input)
      .then((res) => {
        //    if mutaio errored
        if (res.error) {
          toast(`Generating cover letter  failed : ${res.error.message}`, {
            type: 'error',
          });
          return;
        }
        if(res.data){
          // succefull response
          cherry?.setMarkdown(res?.data?.data?.output??"");
          toast(`AI Cover letter generated`, {
            type: 'success',
          });

        }
      })
      .catch((error: any) => {
        toast(`Generating Resume  failed : ${error.message}`, { type: 'error' });
      });
  }

  return (
    <div className="w-full flex gap-1">
      <button
        className="btn btn-outline btn-sm text-xs font-normal rounded-full hover:text-accent"
        about={'save content'}
        data-tip={'save content'}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          saveCoverLetter();
        }}
      >
        {update_job_application_mutation.isPending ? (
          <Spinner size="30px" />
        ) : (
          <Save className="w-5 h-5" />
        )}
      </button>

      <button
        className="btn btn-outline btn-sm text-xs font-normal rounded-full hover:text-accent"
        about={'save content'}
        data-tip={'save content'}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
            aiGenerateCoverLetter();
        }}
      >
        {ai_letter_mutation.isPending ? <Spinner size="40px" /> : 'AI generate'}
      </button>
    </div>
  );
}
