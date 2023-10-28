import { Loader } from "lucide-react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";



interface SubmitButtonProps {
    loading:boolean;
    disabled?:boolean
    className?:string
    action?:()=>void;
    label?:ReactNode
}

export function SubmitButton({disabled,className,loading,action,label="Submit"}:SubmitButtonProps){
return (
  <button
    aria-disabled={disabled ?? loading}
    disabled={disabled ?? loading}
    className={twMerge(
    loading?"btn btn-sm h-auto btn-outline btn-disabled brightness-90":"btn btn-sm h-auto btn-outline", className)}
    onClick={()=>action&&action()}
  >
    {label}
  {loading&&<Loader className="animate-spin"/>}
  </button>
);
}
