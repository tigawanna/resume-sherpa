import { Spinner } from '@/components/navigation/loaders/Spinner';
import { SherpaJobApplicationResponse } from '@/lib/pb/db-types';
import { TJobApplicationInputType,jobApplicationApi,} from '@/routes/api/helpers/prisma/job-application';
import { TResumeInputType, resumeApi} from '@/routes/api/helpers/prisma/resume';
import { useMutationFetcher } from '@/utils/async';
import Cherry from 'cherry-markdown';
import { Save } from 'lucide-react';
import { useMutation, usePageContext } from 'rakkasjs';
import { toast } from 'react-toastify';

interface ResumeEditorControlsProps {
  cherry: Cherry | null;
  setResume: (resume: string) => void;
  resume_input?: TResumeInputType;
  application_input: Omit<SherpaJobApplicationResponse,"id"|"created"|"updated">;
  updating?: boolean;
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

export function ResumeEditorControls({
  cherry,
  application_input,
  setResume,
  resume_input,
  updating,
}: ResumeEditorControlsProps) {
  const page_ctx = usePageContext();
  const qc = page_ctx.queryClient;
  const { userId } = qc.getQueryData('user') as LuciaUser;

  const ai_resume_mutation = useMutation<AiResumeResponse, AiGeneratorInput>(
    (vars) => {
      // return resumeApi.addNew({ input: vars });
      return useMutationFetcher(
        page_ctx,
        '/api/ai/resume',
        { input: vars, user_id: userId! },
        'POST',
      );
    },
  );

  const create_mutation = useMutation<
    Awaited<ReturnType<typeof resumeApi.addNew>>,
    TResumeInputType
  >((vars) => {
    // return resumeApi.addNew({ input: vars });
    return useMutationFetcher(
      page_ctx,
      '/api/resume',
      { input: vars, user_id: userId! },
      'POST',
    );
  });

  const update_mutation = useMutation<
    Awaited<ReturnType<typeof resumeApi.updateOne>>,
    TResumeInputType & { id: string }
  >((vars) => {
    // resumeApi.updateOne({ input: vars, user_id: userId! });
    return useMutationFetcher(
      page_ctx,
      '/api/resume',
      { input: vars, user_id: userId! },
      'PUT',
    );
  });

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

  function aiGenerateresume() {
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
          toast(`Generating Resume  failed : ${res.error.message}`, {
            type: 'error',
          });
          return;
        }
        // succefull response
        cherry?.setMarkdown(res?.output);
        toast(`AI Resume generated`, {
          type: 'success',
        });
      })
      .catch((error: any) => {
        toast(`Generating Resume  failed : ${error.message}`, { type: 'error' });
      });
  }

  function saveResume() {
    const markdown = cherry?.getMarkdown();
    if (!markdown) return;
    cherry && setResume(markdown);
    if (updating) {
      update_mutation.mutateAsync({
        id: resume_input?.id!,
        body: markdown,
        userId: userId!,
        jobAplicationId: application_input.id,
      });
    }
    create_mutation
      .mutateAsync({
        body: markdown,
        userId: userId!,
        jobAplicationId: application_input.id,
      })
      .then((res) => {
        if (res && !('error' in res)) {
          if (res?.id) {
            update_job_application_mutation
              .mutateAsync({
                id: application_input?.id ?? '',
                resume: res.body,
                resumeId: res?.id,
              })
              .then((res) => {
                if (res && 'error' in res) {
                  toast(`Adding Resume to Job application failed`, {
                    type: 'error',
                  });
                  return;
                }
                toast(
                  `Resume added to Job application ${res.id} successfully`,
                  {
                    type: 'success',
                  },
                );
              });
          }
        }
        if (res && 'error' in res) {
          return toast(`Creating Resume  failed`, { type: 'error' });
        }
      })
      .catch((error) => {
        toast(`Creating Resume  failed`, { type: 'error' });
      });
  }

  const is_saving =
    create_mutation.isLoading ||
    update_job_application_mutation.isLoading ||
    update_mutation.isLoading;
  return (
    <div className="w-full flex gap-1">
      
      <button
        className="btn btn-outline btn-sm text-xs font-normal rounded-full hover:text-accent"
        about={'save content'}
        data-tip={'save content'}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          saveResume();
        }}
      >
        {is_saving ? <Spinner size="30px" /> : <Save className="w-5 h-5" />}
      </button>

      <button
        className="btn btn-outline btn-sm text-xs font-normal rounded-full hover:text-accent"
        about={'save content'}
        data-tip={'save content'}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          aiGenerateresume();
        }}
      >
        {ai_resume_mutation.isLoading ? <Spinner size="40px" /> : 'AI generate'}
      </button>
    </div>
  );
}
