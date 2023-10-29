import { PageProps } from "rakkasjs";
import { Experience } from "./components/Experiences";


export default function ExperiencePage({}:PageProps) {

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-2 relative">
      <Experience />
      </div>
  )
}
