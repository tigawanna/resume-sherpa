import { TJobApplicationInputType } from "@/routes/api/helpers/prisma/job-application";
import { useEffect } from "react";
import { CoverLetterEditor } from "./editor/CoverLetterEditor";




interface CoverLetterFormProps {
  setCoverLetter: (letter: string) => void;
  application_input: TJobApplicationInputType;
  updating?: boolean;
}

export function CoverLetterForm({application_input,setCoverLetter,updating}:CoverLetterFormProps){
  useEffect(() => {
    if (
      !application_input?.cover_letter ||(
        application_input?.cover_letter &&
          application_input?.cover_letter.length < 10)
    ) {
      application_input.cover_letter =
        application_input +
        '\n\n' +
        '### Job Description \n' +
        application_input.description;
    }
  },[])
return (
 <div className='w-full h-full min-h-[200px] flex items-center justify-center'>
    <CoverLetterEditor application_input={application_input} 
        setCoverLetter={setCoverLetter} updating={updating}/>
</div>
);
}
