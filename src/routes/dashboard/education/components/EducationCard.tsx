import { DeleteConfirm } from "@/components/modal/DeleteConfirm";
import { SherpaEducationResponse } from "@/lib/pb/db-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, usePageContext } from "rakkasjs";
import { toast } from "react-toastify";

interface EducationCardProps {
  item:SherpaEducationResponse;

}

export function EducationCard({ item }: EducationCardProps) {
  
const page_ctx = usePageContext();
const qc = useQueryClient();
const delete_mutation = useMutation({
  mutationFn: async (vars: { id: string }) => {
    await page_ctx.locals.pb?.collection("sherpa_education").delete(vars.id);
  },
  onSuccess(data, variables, context) {
    qc.invalidateQueries({ queryKey: ["sherpa_education"] });
    toast("Education entry deleted successfully", { type: "success" });
  },
  onError(error, variables, context) {
    toast(error.message, { type: "error", autoClose: false });
  },
});

function handleDelete(id: string) {
  delete_mutation.mutate({ id });
}
  const modal_id = "delete_education_modal";
  return (
    <div
      key={item.id}
      className="flex w-full flex-col justify-center gap-1 rounded-md border p-2 shadow-sm
      shadow-accent hover:border-accent sm:w-[45%] lg:w-[30%] "
    >
      <div className="flex gap-2 items-start justify-between w-full">
      <Link
        href={`/dashboard/education/${item?.id}`}
        className=" hover:text-accent max-w-[90%] rounded-lg"
      >  <h3 className="text-2xl font-bold">{item.school}</h3>
        <h3 className="text-lg">{item.field}</h3>
        <h3 className="">{item.qualification}</h3>
      </Link>
        <DeleteConfirm
          is_loading={delete_mutation.isPending}
          handleDelete={() => handleDelete(item?.id!)}
          modal_id={modal_id}
        />
      </div>

      <div className=" flex w-[90%] items-center justify-between border-t border-t-accent text-sm">
        <h3>From : {new Date(item?.from)?.toISOString().split("T")[0]}</h3>
        <h3>To : {new Date(item?.to)?.toISOString().split("T")[0]}</h3>
      </div>


    </div>
  );
}
