import AutoForm, { AutoFormSubmit } from "@/components/shadcn/ui/auto-form";
import { TCreateUserprops, pb } from "@/lib/pb/client";
import { tryCatchWrapper } from "@/utils/async";
import { navigate, useMutation } from "rakkasjs";
import { signupformSchema } from "./auth";
import { toast } from "react-toastify";

interface SignUpFormProps {}

export function SignUpForm({}: SignUpFormProps) {
  const mutation = useMutation((vars:TCreateUserprops)=>{
    return tryCatchWrapper(pb.collection("sherpa_user").create(vars));

  },{
    onSuccess(data) {
    if (data && data?.data) {
        toast("Account created", { type: "success" });
      if (data?.data?.verified) navigate("/auth/dashboard");
      else navigate("/auth/verify");
    }
    if (data && data?.error) {
        toast(data.error.message, { type: 'error', autoClose: false })
    }
  },})
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AutoForm
        className="w-[95%] md:w-[70%] lg:w-[50%] "
        onSubmit={(vars) => mutation.mutateAsync(vars)}
        // Pass the schema to the form
        formSchema={signupformSchema}
        // You can add additional config for each field
        // to customize the UI
        fieldConfig={{
          password: {
            inputProps: {
              type: "password",
            },
          },
          passwordConfirm: {
            inputProps: {
              type: "password",
            },
          },
        }}
      >
        <div className="w-full flex flex-col items-center gap-2">
        <AutoFormSubmit
          className={
            mutation.isLoading
              ? "btn-sm btn-outline  w-[60%] brightness-50"
              : "btn-sm btn-outline w-[60%]"
          }
          disabled={mutation.isLoading}
        >
          Signup {mutation.isLoading && "..."}
        </AutoFormSubmit>

        </div>
      </AutoForm>
    </div>
  );
}
