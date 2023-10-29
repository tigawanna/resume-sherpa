import { FormHeader } from '@/components/form/inputs/FormHeader';
import { SubmitButton } from '@/components/form/inputs/SubmitButton';
import { TheTextInput } from '@/components/form/inputs/TheTextInput';
import { useFormHook } from '@/components/form/useForm';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/ui/select';
import { SherpaEducationCreate, SherpaEducationResponse, SherpaEducationUpdate } from '@/lib/pb/db-types';
import { tryCatchWrapper } from '@/utils/async';
import { dateToString } from '@/utils/helpers/others';
import { useUser } from '@/utils/hooks/tanstack-query/useUser';
import { useMutation } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import { navigate } from 'rakkasjs';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface EducationFormProps {
  default_value?:SherpaEducationResponse|null;
  updating?: boolean;

}

export function EducationForm({
  default_value,
  updating,

}: EducationFormProps) {
  


  const { user_query: user, page_ctx } = useUser();
  const create_mutation = useMutation({
    mutationFn: async (vars: SherpaEducationCreate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb?.collection("sherpa_education").create(vars),
      );
    },
  });
  const update_mutation = useMutation({
    mutationFn: async (vars: SherpaEducationUpdate) => {
      return tryCatchWrapper(
        page_ctx.locals.pb
          ?.collection("sherpa_education")
          .update(default_value?.id!, vars),
      );
    },
  });
  const { handleChange, input, setError, setInput, validateInputs } =
    useFormHook<Omit<SherpaEducationResponse,"id"|"created"|"updated">>({
      initialValues: {
        school: default_value?.school ?? '',
        field: default_value?.field ?? '',
        user: default_value?.user ?? user?.data?.id!,
        from: dateToString(default_value?.from) ?? dateToString(new Date()),
        to: dateToString(default_value?.to) ?? dateToString(new Date()),
        qualification: default_value?.qualification ?? 'Certificate',
      },
    });

  const [editing, setEditing] = useState(!updating);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (editing) {
      if (updating) {
        update_mutation
          .mutateAsync(input)
          .then((res) => {
              if (res.error) {
                toast(res.error.message, { type: "error", autoClose: false });
              }
              if (res.data) {
                toast("Education updated successfully", { type: "success" });
            }
          })
          .catch((error) =>
            toast(error.message, { type: 'error', autoClose: false }),
          );
      } else {
        create_mutation
          .mutateAsync(input)
          .then((res) => {
              if (res.error) {
                toast(res.error.message, { type: "error", autoClose: false });
              }
              if (res.data) {
                toast("Education saved successfully", { type: "success" });
                navigate('/dashboard/education');
                }
      
          })
          .catch((error) =>
            toast(error.message, { type: 'error', autoClose: false }),
          );
      }
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 border p-2 shadow shadow-accent">
      <div className="flex w-full justify-end px-5">
        <Edit
          className={editing ? "h-6 w-6 text-accent" : "h-6 w-6"}
          onClick={() => setEditing(!editing)}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full flex-col items-center justify-center gap-2"
      >
        <FormHeader editing={editing} updating={updating} name="Education" />
        <TheTextInput<SherpaEducationResponse>
          field_key={"school"}
          val={input["school"]}
          // input={input}
          field_name={"institution"}
          className="input input-bordered input-sm w-full  "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />
        <TheTextInput<SherpaEducationResponse>
          field_key={"field"}
          val={input["field"]}
          // input={input}
          field_name={"Field of study"}
          className="input input-bordered input-sm w-full  "
          label_classname="text-base capitalize"
          onChange={handleChange}
          editing={editing}
        />
        {/* "Certificate" | "Bachelors" | "Masters" | "PhD" | */}
        <div className="w-full">
          <Select
            defaultValue={input["qualification"]}
            onValueChange={(e) => {
              setInput((prev) => {
                return {
                  ...prev,
                  qualification: e as SherpaEducationResponse["qualification"],
                };
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Education Qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"Certificate"}>Certificate</SelectItem>
                <SelectItem value={"Diploma"}>Diploma</SelectItem>
                <SelectItem value={"Masters"}>Masters</SelectItem>
                <SelectItem value={"PhD"}>PhD</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex  w-full flex-col  items-center justify-evenly gap-2 sm:flex-row">
          <TheTextInput<SherpaEducationResponse>
            field_key={"from"}
            val={dateToString(input["from"])}
            type="date"
            // input={input}
            field_name={"From"}
            className="input input-bordered input-sm w-full  "
            label_classname="text-base capitalize"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInput((prev) => {
                return {
                  ...prev,
                  from: dateToString(e.target.value)
                };
              });
            }}
            editing={editing}
          />
          <TheTextInput<SherpaEducationResponse>
            field_key={"to"}
            val={dateToString(input["to"])}
            type="date"
            // input={input}
            field_name={"To"}
            className="input input-bordered input-sm w-full  "
            label_classname="text-base capitalize"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInput((prev) => {
                return { ...prev, to:dateToString(e.target.value) };
              });
            }}
            editing={editing}
          />
        </div>
        {editing && (
          <div className="flex w-full items-center justify-center">
            <SubmitButton
              loading={create_mutation.isPending || update_mutation.isPending}
            />
          </div>
        )}
      </form>
    </div>
  );
}
