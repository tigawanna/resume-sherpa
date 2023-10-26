import { TheCountryFields } from "@/components/form/TheCountryFields";
import { ThePicUrlInput } from "@/components/form/ThePicUrlInput";
import { TheStringListInput } from "@/components/form/inputs/StringListInput";
import { TheTextAreaInput } from "@/components/form/inputs/TheTextArea";
import { TheTextInput } from "@/components/form/inputs/TheTextInput";
import { Edit, Loader } from "lucide-react";
import { title } from "radash";
import { Button } from "react-day-picker";

interface UpdateprofileFormProps {

}

export function UpdateprofileForm({}:UpdateprofileFormProps){
return (
  <div className="w-full h-full flex items-center justify-center">
    <form
      onSubmit={handleSubmit}
      className="m-1 flex h-full w-full flex-col items-center justify-center"
    >
      <div className="flex w-full justify-end px-5 sticky top-10 z-50 ">
        <Edit
          className={editing ? "h-6 w-6 text-accent" : "h-6 w-6"}
          onClick={() => setEditing(!editing)}
        />
      </div>
      <div
        className="flex justify-start items-center md:items-start h-full w-full flex-wrap gap-10
          rounded-lg"
      >
        {/* avatar */}
        <ThePicUrlInput
          container_classname="sm:w-fit sm:max-w-[35%] "
          img_url={input.avatar ?? ""}
          editing={editing}
          setInputImage={(url) =>
            setInput((prev) => {
              return {
                ...prev,
                avatar: url ?? "",
              };
            })
          }
        />

        <div className="flex h-full min-w-[90%] sm:min-w-[50%] flex-col items-center gap-5">
          {/* text fields */}
          <div className="flex w-full flex-col items-center justify-center gap-2 ">
            {text_fields.map((field) => {
              return (
                <TheTextInput
                  key={field}
                  field_key={field}
                  val={input[field]}
                  // input={input}
                  field_name={title(field)}
                  className="input input-bordered input-sm w-full  "
                  label_classname="font-thin"
                  onChange={handleChange}
                  editing={editing}
                />
              );
            })}
          </div>
        </div>

        <div className="flex h-full w-full  flex-wrap items-center justify-center  gap-5">
          <TheCountryFields
            editing={editing}
            country={{
              city: input.city,
              country: input.country,
              phone: input.phone,
            }}
            setInput={(value) =>
              setInput((prev) => {
                return {
                  ...prev,
                  country: value.country,
                  phone: value.phone,
                  city: value.city,
                };
              })
            }
          />

          <TheStringListInput
            editing={editing}
            field_name="Skills"
            field_key="skills"
            input={input}
            setInput={setInput}
          />
        </div>

        {/* text area fields */}
        <div className="flex w-full flex-col items-center justify-center gap-1 ">
          {text_area_fields.map((field) => {
            return (
              <TheTextAreaInput
                className="min-h-[200px]"
                field_key={field}
                key={field}
                value={input[field]}
                // input={input}
                field_name={title(field)}
                onChange={handleChange}
                label_classname=""
                editing={editing}
              />
            );
          })}
        </div>

        {editing && (
          <div className="flex w-full items-center justify-center">
            <Button
              type="submit"
              className="btn btn-sm btn-outline min-w-[50%]"
              variant={"ghost"}
              size={"sm"}
            >
              {mutation.isLoading ? (
                <Loader className="h-6 w-6 animate-spin" />
              ) : (
                <div></div>
              )}
              Save
            </Button>
          </div>
        )}
      </div>
    </form>
  </div>
);
}
