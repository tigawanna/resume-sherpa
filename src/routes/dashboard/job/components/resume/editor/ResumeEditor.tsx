import { Spinner } from '@/components/navigation/loaders/Spinner';
import { TJobApplicationInputType } from '@/routes/api/helpers/prisma/job-application';
import { TResumeInputType } from '@/routes/api/helpers/prisma/resume';
import Cherry from 'cherry-markdown';
import { ClientSuspense} from 'rakkasjs';
import { lazy } from 'react';
import { ResumeEditorControls } from './ResumeEditorControls';
import { SherpaJobApplicationResponse } from '@/lib/pb/db-types';

interface ResumeEditorProps {
  html_string?: string;
  setResume: (resume: string) => void;
  resume_input?: TResumeInputType;
  application_input: Omit<SherpaJobApplicationResponse,"id"|"created"|"updated">;
  updating?: boolean;
}

export function ResumeEditor({
  html_string,
  setResume,
  resume_input,
  application_input,
  updating = false,
}: ResumeEditorProps) {

  const CherryMarkdownEditor = lazy(
    () => import('@/components/editor/CherryMarkdownEditor'),
  );

  return (
    <div className="flex min-h-[200px] flex-col h-full w-full items-center justify-center gap-1">
      <ClientSuspense fallback={<Spinner size="100px" />}>
        <CherryMarkdownEditor
          input_string={html_string ?? ''}
          custom_element={(cherry: Cherry | null) => {
            return (
              <ResumeEditorControls
                cherry={cherry}
                application_input={application_input}
                setResume={setResume}
                resume_input={resume_input}
                updating={updating}
              />
            );
          }}
        />
      </ClientSuspense>
    </div>
  );
}
