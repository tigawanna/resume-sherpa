import { Spinner } from "@/components/navigation/loaders/Spinner";
import { SherpaJobApplicationResponse } from "@/lib/pb/db-types";
import { useMutationFetcher } from "@/utils/async";
import Cherry from "cherry-markdown";
import { Save } from "lucide-react";
import { useMutation, usePageContext } from "rakkasjs";
import { toast } from "react-toastify";


interface CoverLetterEditorControlsProps {
  setCoverLetter: (letter: string) => void;
  application_input: SherpaJobApplicationResponse;
  updating?: boolean;
  cherry: Cherry | null;
}

export interface AiGeneratorInput {
  user_id: string;
  job: string;
  resume: string;
}
export interface AiGeneratorResponse {
  output: string;
  original_response: any;
}
export type AiResumeResponse = AiGeneratorResponse | ReturnedError;

export function CoverLetterEditorControls({
  cherry,
  application_input,
  setCoverLetter,
  updating,
}: CoverLetterEditorControlsProps) {

  const page_ctx = usePageContext();
  const qc = page_ctx.queryClient;
  const { userId } = qc.getQueryData('user') as LuciaUser;

  const update_job_application_mutation = useMutation<
    Awaited<ReturnType<typeof jobApplicationApi.updateOne>>,
    Partial<TJobApplicationInputType> & { id: string }
  >((vars) => {
    // return jobApplicationApi.updateOne({ input: vars, user_id: userId! });
    return useMutationFetcher(
      page_ctx,
      '/api/job',
      { input: vars, user_id: userId! },
      'PUT',
    );
  });

  const ai_resume_mutation = useMutation<AiResumeResponse, AiGeneratorInput>(
    (vars) => {
      // return resumeApi.addNew({ input: vars });
      return useMutationFetcher(
        page_ctx,
        '/api/ai/letter',
        { input: vars, user_id: userId! },
        'POST',
      );
    },
  );

  function saveCoverLetter() {
    const markdown = cherry?.getMarkdown();
    if (!markdown || !application_input?.id) return;
    cherry && setCoverLetter(markdown);
    update_job_application_mutation
      .mutateAsync({
        id: application_input?.id ?? '',
        cover_letter: markdown,
        userId: userId!,
      })
      .then((res) => {
        if (res && 'error' in res) {
          toast(`Adding cover letter to Job application failed`, {
            type: 'error',
          });
          return;
        }
        toast(`Cover letter added to Job application ${res.id} successfully`, {
          type: 'success',
        });
      });
  }

  function aiGenerateCoverLetter() {
    const resume = cherry?.getMarkdown();
    if (!resume) {
      return;
    }
    const input = {
      job: application_input.description,
      resume,
      user_id: userId!,
    };
    // console.log('input  ==== ', input);
    // return
    ai_resume_mutation
      .mutateAsync(input)
      .then((res) => {
        //    if mutaio errored
        if (res && 'error' in res) {
          toast(`Generatin Resume  failed : ${res.error.message}`, {
            type: 'error',
          });
          return;
        }
        // succefull response
        cherry?.setMarkdown(res?.output);
        toast(`AI Cover letter generated`, {
          type: 'success',
        });
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
        {update_job_application_mutation.isLoading ? (
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
        {ai_resume_mutation.isLoading ? <Spinner size="40px" /> : 'AI generate'}
      </button>
    </div>
  );
}
