import { useFormHook } from '@/components/form/useForm';
import { narrowOutError, tryCatchWrapper } from '@/utils/async';
import { useMultiStepForm } from '@/utils/hooks/useMultiStepForm';
import { JobBasicInfoForm } from './JobBasicInfoForm';
import { CoverLetterForm } from './cover-letter/CoverLetterForm';
import { handleJobApplicationSubmit } from './helpers/submit';
import { ResumeForm } from './resume/ResumeForm';
import { ResumeMultiStepForm } from './resume/steps/ResumeMutiStepForm';
import { SherpaJobApplicationCreate, SherpaJobApplicationResponse, SherpaJobApplicationUpdate } from '@/lib/pb/db-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TJobApplicationInputType } from '@/routes/api/helpers/prisma/job-application';
import { useUser } from '@/utils/hooks/tanstack-query/useUser';



interface MainJobApplicationFormProps {
    default_value?:SherpaJobApplicationResponse|null;
    updating?: boolean;
    editing?: boolean;
}

export function MainJobApplicationForm({
    default_value,
    editing = true,
    updating = false,
}: MainJobApplicationFormProps) {

  const { user_query: user, page_ctx } = useUser();

  const create_mutation = useMutation({
    mutationFn: async (vars: SherpaJobApplicationCreate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_job_application").create(vars),
      );
    },
  });
  const update_mutation = useMutation({
    mutationFn: async (vars: SherpaJobApplicationUpdate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_job_application")
          .update(default_value?.id!, vars),
      );
    },
  });

    const query = useQuery({
      queryKey: ["sherpa_resume",default_value?.resume],
      queryFn:async()=>{
        tryCatchWrapper(page_ctx.locals.pb?.collection("sherpa_resume").getOne(default_value?.resume??""))
      },
      enabled: !!default_value?.resume && !!user?.data?.id,
    });
 

    const { handleChange, input, setError, setInput, validateInputs } =
        useFormHook<Omit<SherpaJobApplicationResponse,"id"|"created"|"updated">>({
            initialValues: {
                user: default_value?.user?? user?.data?.id!,
                resume: default_value?.resume ?? undefined,
                title: default_value?.title ?? '',
                description: default_value?.description ?? '',
                posting_url: default_value?.posting_url ?? '',
                cover_letter: default_value?.cover_letter ?? '',
             },
        });

    function setResume(resume: string) {
        setInput((prev) => {
            return {
                ...prev,
                resume,
            };
        });
    }
    function setCoverLetter(letter: string) {
        setInput((prev) => {
            return {
                ...prev,
                cover_letter:letter,
            };
        });
    }

    const resume_input = narrowOutError(query.data);

      const {
        steps,
        currentStepIndex,
        step,
        isFirstStep,
        isLastStep,
        back,
        next,
        goTo,
      } = useMultiStepForm([
        {
          title: 'Job Basic Info',
          component: (
            <div className="flex w-full flex-col gap-3 p-2 md:w-[80%] md:p-5 lg:w-[60%] border rounded-md shadow shadow-accent">
              <JobBasicInfoForm
              create_mutation={create_mutation}
              update_mutation={update_mutation}
                editing={editing}
                input={input}
                updating={updating}
                isLoading={
                  create_mutation.isPending || update_mutation.isPending
                }
                setInput={setInput}
                handleSubmit={(e) =>
                  handleJobApplicationSubmit({
                    create_mutation,
                    update_mutation,
                    editing,
                    input,
                    updating,
                  })
                }
                handleChange={handleChange}
              />
            </div>
          ),
        },
        // {
        //   title: 'Resume',
        //   component: (
        //     <>
        //       {resume_input ? (
        //         <ResumeForm
        //           resume_input={resume_input}
        //           application_input={input}
        //           setResume={setResume}
        //           updating={updating}
        //         />
        //       ) : (
        //         <ResumeMultiStepForm
        //           setResume={setResume}
        //           application_input={input}
                 
        //         />
        //       )}
        //     </>
        //   ),
        // },
        // {
        //   title: 'Cover Letter',
        //   component: (
        //     <>
        //       <CoverLetterForm
        //         application_input={input}
        //         setCoverLetter={setCoverLetter}
        //         updating={updating}
        //       />
        //     </>
        //   ),
        // },
      ]);



    return (
      <div className="w-full h-full flex items-center justify-center gap-3 p-3">
    <div className='card card-bordered w-full p-2 min-h-[70vh] flex flex-col gap-3 items-stretch justify-between '>
        {/* multistep tabs */}
        <div className="flex w-full flex-wrap items-center gap-3 ">
        {steps.map((item, index) => {
          const base_style = "btn btn-sm btn-outline";
          return (
            <button
              key={index}
              className={
                index === currentStepIndex
                  ? base_style + "border-accent text-accent"
                  : base_style
              }
              onClick={() => goTo(index)}
            >
              {item?.title}
            </button>
          );
        })}
      </div>
            {/* multiste progress indicator */}
        <div className="absolute right-[4%] top-[4%]">
          {currentStepIndex + 1} / {steps.length}
        </div>
               {/* current multi step component */}
        <h2 className="text-xl font-bold">{step?.title}</h2>
        <div className='w-full flex items-center justify-center'>
        {step?.component}

        </div>
        {/* multi step bottom next prev buttons  */}
        <div className="mt-4 flex justify-end gap-2 ">
          {!isFirstStep && (
            <button
              type="button"
              onClick={back}
              className="btn btn-outline btn-sm text-sm"
            >
              Back
            </button>
          )}
          <button type="submit" className="btn btn-outline btn-sm text-sm">
            {isLastStep ? "Finish" : "Next"}
          </button>
        </div>
      </div>
        </div>
    );
}
