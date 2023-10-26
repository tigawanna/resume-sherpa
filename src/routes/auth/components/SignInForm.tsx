import AutoForm, { AutoFormSubmit } from "@/components/shadcn/ui/auto-form";
import { navigate, useMutation } from "rakkasjs"
import { toast } from "react-toastify";
import { signinformSchema } from "./auth";
import { emailPasswordLogin } from "@/lib/pb/client";
import { Spinner } from "@/components/navigation/loaders/Spinner";
export function SigninForm() {
    
  const mutation = useMutation(
      (vars: { usernameOrEmail: string; password: string }) => {
          return emailPasswordLogin(vars.usernameOrEmail, vars.password);
      },
      {
        onError(error:any) {
          toast(error.message, { type: "error", autoClose: false });
        },
        onSuccess(data) {
          if (data && data?.data) {
            toast("Welcome back "+data?.data?.record?.username, { type: "success" });
            navigate("/dashboard");
          }
          if (data && data?.error) {
            toast(data.error.message, { type: "error", autoClose: false });
          }
        },
      },
    );
return (
  <div className="w-full h-full flex items-center justify-center">
    <AutoForm
      className="w-[90%] md:w-[70%] lg:w-[50%] "
      onSubmit={(vars) => mutation.mutateAsync(vars)}
      // Pass the schema to the form
      formSchema={signinformSchema}
      // You can add additional config for each field
      // to customize the UI
      fieldConfig={{
        password: {
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
              ? "btn-sm btn-outline  w-[60%] animate-pulse"
              : "btn-sm btn-outline w-[60%]"
          }
          disabled={mutation.isLoading}
        >
          Signin {mutation.isLoading && <Spinner/>}
        </AutoFormSubmit>
      </div>
    </AutoForm>
  </div>
);}
