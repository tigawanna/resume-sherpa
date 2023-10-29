import { PageProps } from "rakkasjs";
import { Hackathons } from "./components/Hackathons";

export default function HackathonPage({params}:PageProps) {
return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-2 relative">
      <Hackathons />
      </div>
  )
}
