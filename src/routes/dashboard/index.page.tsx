import { PageProps, usePageContext } from "rakkasjs";
import { ProfileComponenst } from "./components/profile/profile-sections/ProfileComponent";
import { Suspense } from "react";
import { Spinner } from "@/components/navigation/loaders/Spinner";



export default function DashboadPage({}: PageProps) {

  // console.log("user in dashboard page", user);
  return (
    <div className="w-full h-full min-h-screen bg-base-200 flex flex-col gap-5">
      {/* <ProfileForm user={user} updating={true}/> */}
      {/* {user.id&&<ProfileStats user_id={user.id}/>} */}
      <Suspense fallback={<Spinner size="100px"/>}>
        </Suspense>
      <ProfileComponenst/>
      </div>
  );
}
