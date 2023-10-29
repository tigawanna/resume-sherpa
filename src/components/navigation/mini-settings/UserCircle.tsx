import { UserCircle2 } from "lucide-react";
import { useUser } from "@/utils/hooks/tanstack-query/useUser";

interface UserCircleProps {}

export function UserCircle({}: UserCircleProps) {
 const {user_query} = useUser();
 const user = user_query?.data
  return (
    <div className="w-7 h-7 flex items-center justify-center rounded-full">
      {user?.email ? (
        <img
          src={
            "https://tigawanna-portfolio.vercel.app/_next/image?url=%2Fgithub.jpg&w=384&q=75"
          }
          alt="avatar"
          className="w-7 h-7 rounded-full object-cover"
        />
      ) : (
        <UserCircle2 className="w-7 h-7 rounded-full" />
      )}
    </div>
  );
}
