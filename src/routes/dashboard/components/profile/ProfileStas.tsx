import { usePageContext } from "rakkasjs";
import { ProfileStatsCards } from "./ProfileStatsCards";

interface StatsCardsProps {
user_id:string
}

export function ProfileStats({user_id}:StatsCardsProps){
const model_keys = [
  "education",
  "experience",
  "project",
  "hackathon",
  "user",
  "content",
  "internship",
  "jobApplication",
  "resume",
] as const;
const page_ctx = usePageContext()

return (
 <div className='w-full h-full flex flex-wrap items-center justify-center gap-5 p-2'>
{model_keys.map((item)=>{
  return(
    <ProfileStatsCards model={item} page_ctx={page_ctx} user_id={user_id} key={item}/>
  )
})}
 </div>
);
}
