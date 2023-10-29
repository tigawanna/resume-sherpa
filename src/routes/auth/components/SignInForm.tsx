import { Link, navigate } from "rakkasjs";
import { OAuthproviders } from "./OAuthProviders";
import { Button } from "@/components/shadcn/ui/button";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailPasswordLogin } from "@/lib/pb/client";
import { toast } from "react-toastify";
import { useFormHook } from "@/components/form/useForm";
import { useState } from "react";
import { Loader } from "lucide-react";

interface SignInFormProps {

}

export function SignInForm({  }: SignInFormProps) {
  const [show,setShow]=useState(false)
  const qc = useQueryClient();
  const show_form=true
    const { handleChange, input, setError, setInput, validateInputs } =
      useFormHook<{ usernameOrEmail: string; password: string }>({
        initialValues: {
          password:"",
          usernameOrEmail:"",
        },
      });
  const mutation = useMutation(
    {
      mutationFn:(vars: { usernameOrEmail: string; password: string }) => {
        return emailPasswordLogin(vars.usernameOrEmail, vars.password);
      },
      onError(error: any) {
        toast(error.message, { type: "error", autoClose: false });
      },
      onSuccess(data) {
        if (data && data?.data) {
          qc.invalidateQueries({queryKey:["sherpa_user"]})
          toast("Welcome back " + data?.data?.record?.username, {
            type: "success",
          });
          navigate("/dashboard");
        }
        if (data && data?.error) {
          toast(data.error.message, { type: "error", autoClose: false });
        }
      },
    },
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutation.mutate(input)
  }
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center p-5 gap-5">
      <div className="w-full h-full md:w-[60%] lg:w-[40%] flex flex-col gap-4">
        {show_form && (
          <form
            className="w-full h-full  flex flex-col items-center justify-center gap-4"
            // method="POST"
            onSubmit={handleSubmit}
          >
            <h1 className="text-2xl font-bold">Sign In</h1>

            <TheTextInput
              field_key={"usernameOrEmail"}
              field_name="usernameOrEmail"
              onChange={handleChange}
              required
              val={input.usernameOrEmail}
            />

            <TheTextInput
              field_key={"password"}
              field_name="password"
              type={show ? "text" : "password"}
              required
              min={8}
              onChange={handleChange}
              val={input.password}
            />
            <TheTextInput
              field_key={"show"}
              field_name={"show password"}
              onChange={(e) => setShow(e.target.checked)}
              type="checkbox"
              className="h-5 border-none w-5"
              container_classname="border-none flex flex-row gap-3"
              label_classname="min-w-fit "
            />
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-sm btn-outline min-w-[50%]"
              variant={"ghost"}
              size={"sm"}
            >
              {" "}
              Sign in {mutation.isPending&&<Loader className="animate-spin"/>}
            </Button>

          </form>
        )}
        {show_form && (
          <div className="w-full flex items-center justify-center">
            <span className="w-full border-t" />
            <span className="bg-background px-2 text-muted-foreground min-w-fit">
              Or continue with
            </span>
            <span className="w-full border-t" />
          </div>
        )}
        <OAuthproviders />
      </div>
      {show_form && (
        <p className=" text-sm">
          New here ? Create an account ?{" "}
          <Link href="/auth/signup" className="text-accent">
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
}
