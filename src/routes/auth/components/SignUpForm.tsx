import { Button } from "@/components/shadcn/ui/button";
import { OAuthproviders } from "./OAuthProviders";
import { Link, navigate, usePageContext } from "rakkasjs";
import { ActionErrorData } from "@/lib/rakkas/utils/actions";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { TSignupformSchema } from "./auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormHook } from "@/components/form/useForm";
import { useState } from "react";
import { toast } from "react-toastify";
import { tryCatchWrapper } from "@/utils/async";
import { SherpaUserCreate } from "@/lib/pb/db-types";
import { Loader } from "lucide-react";

interface SignupFormProps {
  actionData: ActionErrorData<Partial<TSignupformSchema>>;
}

export function SignUpForm({ actionData }: SignupFormProps) {
  const show_form = true;
  const [show, setShow] = useState(false);
  const page_ctx = usePageContext();
  const qc = useQueryClient();

  const { handleChange, input, setError, setInput, validateInputs } =
    useFormHook<TSignupformSchema & Partial<SherpaUserCreate>>({
      initialValues: {
        password: "",
        username: "",
        passwordConfirm: "",
        email: "",
      },
    });
  const mutation = useMutation({
    mutationFn: (vars:typeof input) => {
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_user").create(input),
      );
    },
    onError(error: any) {
      toast(error.message, { type: "error", autoClose: false });
    },
    onSuccess(data) {
      if (data && data?.data) {
        qc.invalidateQueries({ queryKey: ["sherpa_user"] });
        toast("Welcome" + data?.data?.username, {
          type: "success",
        });
        navigate("/dashboard");
      }
      if (data && data?.error) {
        toast(data.error.message, { type: "error", autoClose: false });
      }
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate(input);
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
            <h1 className="text-2xl font-bold">Sign Up</h1>

            <TheTextInput
              field_key={"email"}
              field_name="Email"
              required
              val={input.email}
              onChange={handleChange}
            />
            <TheTextInput
              field_key={"username"}
              field_name="Useranme"
              required
              min={4}
              val={input.username}
              onChange={handleChange}
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
              field_key={""}
              field_name="passwordConfirm"
              type={show ? "text" : "password"}
              required
              min={8}
              onChange={handleChange}
              val={input.passwordConfirm}
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
              Sign Up{" "}
              {mutation.isPending && <Loader className="animate-spin" />}
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
          Already have an account ?{" "}
          <Link href="/auth" className="text-accent">
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
