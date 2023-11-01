import {
  SherpaJobApplicationResponse,
  SherpaJobApplicationUpdate,
  SherpaResumeCreate,
  SherpaResumeResponse,
  SherpaResumeUpdate,
} from "@/lib/pb/db-types";
import { ApiRouteResponse } from "@/lib/rakkas/utils/types";
import {
  apiRouteTryCatchWrapper,
  tryCatchWrapper,
  useMutationFetcher,
} from "@/utils/async";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";
import { useMutation } from "@tanstack/react-query";
import Cherry from "cherry-markdown";
import { Loader, Save, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

interface ResumeEditorControlsProps {
  cherry: Cherry | null;
  setResume: (resume: string) => void;
  resume_input?: SherpaResumeResponse;
  application_input: SherpaJobApplicationResponse;
  updating?: boolean;
}

export interface AiGeneratorInput {
  job: string;
  resume: string;
}
export interface AiGeneratorData {
  output: string;
  original_response: any;
}
export type AiResumeResponse = ApiRouteResponse<AiGeneratorData>;

export function ResumeEditorControls({
  cherry,
  application_input,
  setResume,
  resume_input,
  updating,
}: ResumeEditorControlsProps) {
  const { user_query, page_ctx } = useUser();
  const user = user_query?.data;
  const ai_resume_mutation = useMutation({
    mutationFn: (vars: AiGeneratorInput) => {
      return apiRouteTryCatchWrapper(
        useMutationFetcher<AiResumeResponse>(
          page_ctx,
          "/api/ai/resume",
          vars,
          "POST",
        ),
      );
    },
  });

  const create_mutation = useMutation({
    mutationFn: (vars: SherpaResumeCreate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_resume").create(vars),
      );
    },
  });

  const update_mutation = useMutation({
    mutationFn: (vars: { id: string; data: SherpaResumeUpdate }) => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_resume")
          .update(vars.id, vars.data),
      );
    },
  });
  const update_job_application_mutation = useMutation({
    mutationFn: (vars: { id: string; data: SherpaJobApplicationUpdate }) => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_job_application")
          .update(vars.id, vars.data),
      );
    },
  });

  function aiGenerateresume() {
    const resume = cherry?.getMarkdown();
    if (!resume) {
      return;
    }
    const input = {
      job: application_input.description,
      resume,
    };
    // console.log('input  ==== ', input);
    // return
    ai_resume_mutation
      .mutateAsync(input)
      .then((res) => {
        console.log("setMarkdown  ===== ", res);
        if (res?.data?.data) {
          cherry?.setMarkdown(res.data?.data?.output ?? "");
          toast(`AI Resume generated`, {
            type: "success",
          });
        }
        //    if mutaio errored
        if (res.data?.error) {
          toast(`Generating Resume  failed : ${res?.data?.error?.message}`, {
            type: "error",
          });
          return;
        }
        // succefull response
      })
      .catch((error: any) => {
        toast(`Generating Resume  failed : ${error.message}`, {
          type: "error",
        });
      });
  }

  function saveResume() {
    const markdown = cherry?.getMarkdown();
    if (!markdown) return;
    cherry && setResume(markdown);
    if (updating) {
      update_mutation.mutateAsync({
        id: resume_input?.id!,
        data: {
          body: markdown,
          user: user?.id!,
          job_application: application_input.id!,
        },
      });
    }
    create_mutation
      .mutateAsync({
        body: markdown,
        user: user?.id!,
        job_application: application_input.id!,
      })
      .then((res) => {
        if (res?.data) {
          if (res?.data.id) {
            update_job_application_mutation
              .mutateAsync({
                id: application_input?.id ?? "",
                data: {
                  resume: res.data.body,
                },
              })
              .then((res) => {
                if (res.error) {
                  toast(`Adding Resume to Job application failed`, {
                    type: "error",
                  });
                  return;
                }
                if (res.data) {
                  toast(
                    `Resume added to Job application ${res?.data?.id} successfully`,
                    {
                      type: "success",
                    },
                  );
                }
              });
          }
        }
        if (res.error) {
          return toast(`Creating Resume  failed`, { type: "error" });
        }
      })
      .catch((error) => {
        toast(`Creating Resume  failed`, { type: "error" });
      });
  }

  const is_saving =
    create_mutation.isPending ||
    update_job_application_mutation.isPending ||
    update_mutation.isPending;
  return (
    <div className="w-full flex gap-1">
      <button
        className="md:tooltip hover:md:tooltip-open md:tooltip-top btn-outline btn-sm text-xs font-normal rounded-full hover:text-accent"
        about={"save content"}
        data-tip={"save content"}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          saveResume();
        }}
      >
        {is_saving ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
      </button>

      <button
        className="md:tooltip hover:md:tooltip-open md:tooltip-top btn btn-sm
         btn-outline font-normal rounded-full hover:text-accent"
        about={"save content"}
        data-tip={"save content"}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          aiGenerateresume();
        }}
      >
        <div className="flex gap-2 items-center justify-center">
          AI generate <Sparkles />
          {ai_resume_mutation.isPending && (
            <Loader className="animate-spin h-4 w-4" />
          )}
        </div>
      </button>
    </div>
  );
}
