import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs";
import { SingleViewResumeTemplate } from "./SingleViewResumeTemplate";
import { SplitViewResumeTemplate } from "./SplitViewResumeTemplate";
import { ResumeFields } from "../steps/ResumeMutiStepForm";


interface ResumeTemplatesTabProps {
  resume_fields: ResumeFields;
}

export function ResumeTemplatesTab({resume_fields}:ResumeTemplatesTabProps){
return (
 <div className='w-full h-full flex flex-col items-center justify-center'>
    <h2>HTML VIEW</h2>
    <Tabs defaultValue="account" className="w-full h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="single">Single View</TabsTrigger>
        <TabsTrigger value="split">Split View</TabsTrigger>
      </TabsList>
      <TabsContent value="single">
        <h2>Recomended Format (good with ATS)</h2>
        <SingleViewResumeTemplate resume_fields={resume_fields}/>
      </TabsContent>
      <TabsContent value="split">
        <h2>Compact Format (ATS might struggle)</h2>
    <SplitViewResumeTemplate resume_fields={resume_fields}/>
      </TabsContent>
    </Tabs>
 </div>
);
}
