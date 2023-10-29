import { Spinner } from "@/components/navigation/loaders/Spinner";
import { TJobApplicationInputType } from "@/routes/api/helpers/prisma/job-application";
import { ClientSuspense } from "rakkasjs";
import { lazy } from "react";
import Cherry from "cherry-markdown";
import { CoverLetterEditorControls } from "./CoverLetterEditorControls";

const CherryMarkdownEditor = lazy(
  () => import('@/components/editor/CherryMarkdownEditor'),
);

interface CoverLetterEditorProps {
  setCoverLetter: (letter: string) => void;
  application_input: TJobApplicationInputType;
  updating?: boolean;
}

export function CoverLetterEditor({application_input,setCoverLetter,updating}:CoverLetterEditorProps){

    return (
    <div className="flex min-h-[200px] flex-col h-full w-full items-center justify-center gap-1">
      <ClientSuspense fallback={<Spinner size="100px" />}>
        <CherryMarkdownEditor
          input_string={application_input.cover_letter ?? ''}
          custom_element={(cherry: Cherry | null) => {
            return (
              <CoverLetterEditorControls
              cherry={cherry}
              application_input={application_input}
              updating={updating}
              setCoverLetter={setCoverLetter}
            />
            );
          }}
        />
      </ClientSuspense>
    </div>
);
}
