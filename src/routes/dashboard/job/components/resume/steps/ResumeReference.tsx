import { Check, Edit, Plus, X } from "lucide-react";
import { ResumeFields } from "./ResumeMutiStepForm";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { useFormHook } from "@/components/form/useForm";
import { closeModal, TheFormModal } from "@/components/modal/TheFormModal";


interface ResumeReferenceProps {
  user_id: string;
  input: ResumeFields;
  setInput: React.Dispatch<React.SetStateAction<ResumeFields>>;

}

type ResumeReferences = ResumeFields["references"]
type ResumeReferece = ResumeReferences[number];
export function ResumeReference({user_id,input,setInput}:ResumeReferenceProps){



const handleRemoveItem = (name:string) => {
  setInput((prev)=>{
    const filtered = prev.references.filter(item=>item.name!==name)
    return { ...prev,references:filtered };
  })
};



return (
  <div className="flex h-full w-full flex-col items-center justify-center">
    <ResumeReferenceModal
      setInput={setInput}
      label={<Plus className="h-10 w-10 hover:text-accent" />}
      updating={false}
    />

    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {input.references.map((item) => {
        return (
          <div
            key={item.name}
            className="flex w-full flex-col justify-center gap-1 rounded-md border 
            p-2 hover:border-accent sm:w-[45%] lg:w-[30%] "
          >
            <div className=" flex w-full items-center justify-end gap-2">
              <X
                className="h-6 w-6 text-error"
                onClick={() => handleRemoveItem(item.name)}
              />
              {/* <ResumeReferenceModal
                setInput={setInput}
                label={<Edit className="h-5 w-5" />}
                updating={true}
                defaults={item}
              /> */}
            </div>
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <h3 className="">{item.company}</h3>
            <h3 className="text-sm">{item.contact}</h3>
          </div>
        );
      })}
    </div>
  </div>
);
}


interface ResumeReferenceModalProps {
  defaults?: ResumeReferece;
  label: React.ReactNode;
  setInput: React.Dispatch<React.SetStateAction<ResumeFields>>;
  updating:boolean
}

export function ResumeReferenceModal({defaults,label,setInput,updating=false}:ResumeReferenceModalProps){
      const {
        handleChange,
        input: innerInput,
        setInput: setInnerInput,
      } = useFormHook<ResumeReferece>({
        initialValues: {
          name:defaults?.name??"",
          company:defaults?.company??"",
          contact:defaults?.contact??"",
        },
      });

      const findSome = (input_arr: ResumeReferences, name: string) => {
        return input_arr.some((val) => {
          return val.name === name;
        });
      };
      const handleUpdateOne = (name: string, input: ResumeReferece) => {
        setInput((prev) => {
          const filtered = prev.references.filter((item) => item.name !== name);
          return { ...prev, references: [...filtered, input] };
        });
        setInnerInput({ name: "", company: "", contact: "" });
      };
      const handleAddItem = ({ company, contact, name }: ResumeReferece) => {
        setInput((prev) => {
          if (findSome(prev.references, name) || name.length < 2 || company.length < 2 || contact.length < 2) {
            return prev;
          }
          return {
            ...prev,
            references: [...prev.references, { company, contact, name }],
          };
        });
         setInnerInput({ name: "", company: "", contact: "" });
         closeModal("referee_form_modal");
      };

      const handleUpdateItem = ({ company, contact, name }: ResumeReferece) => {
        setInput((prev) => {
          if (
            findSome(prev.references, name) ||
            name.length < 2 ||
            company.length < 2 ||
            contact.length < 2
          ) {
            return prev;
          }
          return {
            ...prev,
            references: [...prev.references, { company, contact, name }],
          };
        });
      };
return (

    <TheFormModal
      label={label}
      id="referee_form_modal"
    >
      <TheTextInput<ResumeReferece>
        field_key={"name"}
        field_name="Name"
        onChange={handleChange}
        value={innerInput.name}
      />
      <TheTextInput<ResumeReferece>
        field_key={"company"}
        field_name="Company"
        onChange={handleChange}
        value={innerInput.company}
      />
      <TheTextInput<ResumeReferece>
        field_key={"contact"}
        field_name="Contact"
        onChange={handleChange}
        value={innerInput.contact}
        description="phone or email , comma separate if both"
      />
      <Check
        className="h-10 w-10 text-success"
        onClick={() => {updating?handleUpdateOne(innerInput.name,innerInput):handleAddItem(innerInput)}}
      />
    </TheFormModal>

);
}
