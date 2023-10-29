import { HackathonForm } from "./components/HackathonForm";


interface NewHackathonPageProps {}

export default function NewHackathonPage({}: NewHackathonPageProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2">
      <div className="flex w-[95%] flex-col gap-3 p-1 md:w-[80%] md:p-5 lg:w-[60%]">
        <HackathonForm />
      </div>
    </div>
  );
}
