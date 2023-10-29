import { PageProps } from "rakkasjs";
import { ProfileComponenst } from "./components/profile/ProfileComponent";


export default function DashboadPage({}: PageProps) {
return (
    <div className="w-full h-full min-h-screen bg-base-200 flex flex-col gap-5">
       <ProfileComponenst/>
     </div>
  );
}
