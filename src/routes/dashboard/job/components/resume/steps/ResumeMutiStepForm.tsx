import { useFormHook } from "@/components/form/useForm";
import { useMultiStepForm } from "@/utils/hooks/useMultiStepForm";
import { usePageContext} from "rakkasjs";
import { FinalResume } from "./FinalResume";
import { ResumeBasicDetails } from "./ResumeBasicDetails";
import { ResumeEducation } from "./ResumeEducation";
import { ResumeExperience } from "./ResumeExperience";
import { ResumeHackathons } from "./ResumeHackathons";
import { ResumeProjects } from "./ResumeProjects";
import { ResumeReference } from "./ResumeReference";
import { ResumeTechnologies } from "./ResumeTechnologies";
import { SherpaJobApplicationResponse } from "@/lib/pb/db-types";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";




interface MultiStepResumeFormProps {
    setResume(values: string): void;
    application_input: Omit<SherpaJobApplicationResponse,"id"|"created"|"updated">;
    
}

export interface ResumeFields {
  name: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  github_username: string;
  linkedin_username: string;
  country: string;
  city: string;
  skills: string;
  languages: string;
  libraries: string;
  projects: {
    id: string;
    name: string;
    description: string;
    languages: string;
    libraries: string;
  }[];
  education: {
    id: string;
    field: string;
    from: string;
    to: string;
    qualification: string;
    school: string;
  }[];
  hackathons: {
    id: string;
    name: string;
    description: string;
    technologies: string;
  }[];
  content: {
    id: string;
    title: string;
    type: string;
  }[];
  experience: {
    id: string;
    position: string;
    company: string;
    from: string;
    to: string;
  }[];
  references: {
    name: string;
    company: string;
    contact: string;
  }[];
}



export function ResumeMultiStepForm({setResume,application_input}: MultiStepResumeFormProps) {
const { user_query: user, page_ctx } = useUser()
const user_id=user?.data?.id??""





const { handleChange, input, setError, setInput, validateInputs } =
      useFormHook<ResumeFields>({
        initialValues: {
          name: "",
          email: "",
          phone: "",
          country: "",
          city: "",
          summary: "",
          website: "",
          github_username: "",
          linkedin_username: "",
          projects: [],
          skills:"",
          languages: "",
          libraries: "",
          hackathons: [],
          content: [],
          references: [],
          education: [],
          experience:[]
        },
      });

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
      title: "Basics",
      component: (
        <ResumeBasicDetails
          user_id={user_id}
          input={input}
          setInput={setInput}
          handleChange={handleChange}
        />
      ),
    },
    {
      title: "Projects",
      component: (
        <ResumeProjects
          user_id={user_id}
          input={input}
          setInput={setInput}
          handleChange={handleChange}
        />
      ),
    },
    {
      title: "Technologies",
      component: (
        <ResumeTechnologies
          user_id={user_id}
          input={input}
          setInput={setInput}
          handleChange={handleChange}
        />
      ),
    },

    {
      title: "Education",
      component: (
        <ResumeEducation
          user_id={user_id}
          input={input}
          setInput={setInput}
          handleChange={handleChange}
        />
      ),
    },
    {
      title: "Experience",
      component: (
        <ResumeExperience
          user_id={user_id}
          input={input}
          setInput={setInput}
          handleChange={handleChange}
        />
      ),
    },
    {
      title: "Hackathons",
      component: (
        <ResumeHackathons
          user_id={user_id}
          input={input}
          setInput={setInput}
          handleChange={handleChange}
        />
      ),
    },
    {
      title: "References",
      component: (
        <ResumeReference
          user_id={user_id}
          input={input}
          setInput={setInput}

        />
      ),
    },
    {
      title: "Finally",
      component: (
        <FinalResume
          resume_fields={input}
          application_input={application_input}
          setResume={setResume}
        />
      ),
    },
    // <StepTwo<typeof input> input={input} setInput={setInput} />,
  ]);


//   useEffect(() => {
//  if(!query.data) return
//  if(query?.data && !("error" in query.data)){
//    const resume = query?.data
//     application_input.resume=resume.body 
//   }
 

//   }, [query.data]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLastStep) return next();
    // alert("Successful Account Creation");
  }

  // console.log("inpu == ", input); 
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">Create Resume </h1>
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

      <form
        onSubmit={onSubmit}
        className="card card-bordered w-full p-5  min-h-[70vh] flex flex-col items-stretch justify-between"
      >
        <div className="absolute right-[4%] top-[4%]">
          {currentStepIndex + 1} / {steps.length}
        </div>
        <h2 className="text-xl font-bold">{step?.title}</h2>
        {step?.component}
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
      </form>
    </div>
  );
}
