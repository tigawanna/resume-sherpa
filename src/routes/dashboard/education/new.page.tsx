import { EducationForm } from "./components/EducationForm";


export default function NewEducationPage({}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2">
      <div className="flex w-[95%] flex-col gap-3 p-1 md:w-[80%] md:p-5 lg:w-[60%]">
        <EducationForm />
      </div>
    </div>
  );
}
