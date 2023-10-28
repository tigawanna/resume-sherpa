import { artificialDelay } from "@/utils/async";
import {  Link, useLocation, usePageContext } from "rakkasjs";
import { Button } from "../../shadcn/ui/button";
import { Loader, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "../../shadcn/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

import { useUser } from "@/utils/hooks/tanstack-query/useUser";




interface CurrentUserSectionProps {
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CurrentUserSection({setOpen}:CurrentUserSectionProps){
 const { user_query,user_mutation } = useUser();
 const user = user_query?.data;


  async function logoutUser() {
    await artificialDelay(2000);
    user_mutation.mutate()
}



  const location = useLocation();

if(!user){
    return (
      <div className="w-full h-full flex items-center justify-center">
        {location.current.pathname !== "/auth" && (
          <Link
            href="/auth"
            className="w-[80%] btn btn-sm btn-outline text-xs hover:text-blue-600 mx-1 my-2"
            onClick={() => setOpen?.(false)}
           >
            Login
          </Link>
        )}
      </div>
    );
}  
return (
  <div className="w-full h-full flex flex-col items-center justify-center">
    <div className="w-full h-full flex flex-col items-center justify-start p-3 gap-2">
      <Avatar className="h-28 w-28">
        <AvatarImage src={user?.avatar} alt="@user" className="rounded-lg" />
        <AvatarFallback>{user?.username?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center items-center space-y-1">
        <p className="text-sm font-medium leading-none">{user?.username}</p>
        <p className="text-xs leading-none text-muted-foreground">
          {user?.email}
        </p>
      </div>
    </div>

    <span className="w-full flex items-center justify-center">
      <Button
        onClick={() => logoutUser()}
        variant={"ghost"}
        className="w-[80%] btn btn-sm btn-outline btn-error text-xs"
        size={"sm"}
        disabled={user_mutation.isPending}
      >
        Log out
        {user_mutation.isPending ? (
          <Loader className="w-4 h-4  animate-spin" />
        ) : (
          <LogOut className="w-4 h-4 ml-2" />
        )}
      </Button>
    </span>
  </div>
);
}
