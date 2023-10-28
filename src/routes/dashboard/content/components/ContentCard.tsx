import { DeleteConfirm } from "@/components/modal/DeleteConfirm";
import { SherpaContentResponse } from "@/lib/pb/db-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, usePageContext } from "rakkasjs";
import { toast } from "react-toastify";

interface ContentCardProps {
  item: SherpaContentResponse;

}

export function ContentCard({ item }: ContentCardProps) {
const page_ctx = usePageContext()
const qc = useQueryClient()
  const delete_mutation = useMutation({
    mutationFn: async (vars: { id: string }) => {
      await page_ctx.locals.pb?.collection("sherpa_content").delete(vars.id)
    },
    onSuccess(data, variables, context) {
      qc.invalidateQueries({ queryKey: ["sherpa_content"] });
      toast("content deleted successfully", { type: "success" });
    },
    onError(error, variables, context) {
      toast(error.message, { type: "error", autoClose: false });
    }
  })

  function handleDelete(id: string) {
    delete_mutation.mutate({ id })
  }

  const modal_id = "delete_content_mmodal";
  return (
    <div
      key={item.id}
      className="flex w-full flex-col justify-between gap-2 rounded-md border p-2 shadow-sm
      shadow-accent hover:border-accent sm:w-[45%] lg:w-[30%] sm:h-[180px]"
    >
      <div className="flex justify-between items-start gap-3">
        <Link
          href={`/dashboard/content/${item?.id}`}
          className="hover:text-accent w-full max-w-[90%] rounded-lg "
        >
          <h3 className="text-xl font-bold line-clamp-2">{item.title}</h3>
          <p className="text-sm line-clamp-3">{item.description}</p>
        </Link>
        <DeleteConfirm
          is_loading={delete_mutation.isPending}
          handleDelete={() => handleDelete(item?.id!)}
          modal_id={modal_id}
        />
      </div>

      <div className=" flex items-center justify-between text-sm border-t pt-1">
        <h3 className="border border-accent rounded-lg  w-fit px-2">
          {item.type}
        </h3>
        <h3>{new Date(item?.created).toDateString()}</h3>
      </div>
    </div>
  );
}
