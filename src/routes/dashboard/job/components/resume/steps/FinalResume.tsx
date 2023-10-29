import { ResumeForm } from '../ResumeForm';
import { ResumeFields } from './ResumeMutiStepForm';
import { SherpaJobApplicationResponse } from '@/lib/pb/db-types';

interface FinalResumeProps {

  resume_fields: ResumeFields;
  application_input: Omit<SherpaJobApplicationResponse,"id"|"created"|"updated">;
  setResume: (resume: string) => void;
  handleChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export function FinalResume({
  resume_fields,
  setResume,
  application_input,
}: FinalResumeProps) {
  return (
    <div className="w-full  h-full flex flex-col items-center justify-center">
      <ResumeForm
        application_input={application_input}
        setResume={setResume}
        resume_fields={resume_fields}
 
      />
    </div>
  );
}
