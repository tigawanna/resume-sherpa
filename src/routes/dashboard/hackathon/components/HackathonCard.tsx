import { DeleteConfirm } from "@/components/modal/DeleteConfirm";
import { SherpaHackathonResponse } from "@/lib/pb/db-types";
import { dateToString } from "@/utils/helpers/others";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { Link, usePageContext, useSSM } from "rakkasjs";
import { toast } from "react-toastify";

interface HackathonCardProps {
  item: SherpaHackathonResponse
}

export function HackathonCard({ item}: HackathonCardProps) {

const page_ctx = usePageContext();
const qc = useQueryClient();
const delete_mutation = useMutation({
  mutationFn: async (vars: { id: string }) => {
    await page_ctx.locals.pb?.collection("sherpa_hackathon").delete(vars.id);
  },
  onSuccess(data, variables, context) {
    qc.invalidateQueries({ queryKey: ["sherpa_hackathon"] });
    toast("Hackathon entry deleted successfully", { type: "success" });
  },
  onError(error, variables, context) {
    toast(error.message, { type: "error", autoClose: false });
  },
});

function handleDelete(id: string) {
  delete_mutation.mutate({ id });
}

  const modal_id = "delete_hackathon_modal";
  return (
    <div
      key={item.id}
      className="flex w-full flex-col justify-center gap-1 rounded-md border shadow-sm shadow-accent
      p-2 hover:border-accent sm:w-[45%] lg:w-[30%] "
    >
      <div className="flex  ">
        <Link
          href={`/dashboard/hackathon/${item?.id}`}
          className="hover:text-accent max-w-[90%]"
        >
          <h3 className="text-2xl font-bold w-full">{item?.name}</h3>
          <h3 className="line-clamp-2 w-full text-sm">{item?.description}</h3>
        </Link>
        <DeleteConfirm
          is_loading={delete_mutation.isPending}
          handleDelete={() => handleDelete(item?.id!)}
          modal_id={modal_id}
        />
      </div>

      <div className="flex w-full flex-wrap gap-2 p-1">
        {item?.technologies &&
          item?.technologies
            ?.split(",")
            ?.slice(0, 5)
            .map((tech) => (
              <h2
                key={tech}
                className="rounded-xl border border-accent px-2 text-xs"
              >
                {tech}
              </h2>
            ))}
      </div>

      <div className=" flex w-[90%] items-center justify-between border-t border-t-accent text-sm">
        <h3>From : {dateToString(item.from)}</h3>
        <h3>To : {dateToString(item.to)}</h3>
      </div>
    </div>
  );
}
