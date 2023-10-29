import { DeleteConfirm } from '@/components/modal/DeleteConfirm';
import { SherpaJobApplicationResponse } from '@/lib/pb/db-types';
import { dateToString } from '@/utils/helpers/others';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { Link, usePageContext } from 'rakkasjs';
import { toast } from 'react-toastify';

interface JobApplicationCardProps {
  item:SherpaJobApplicationResponse
 
}

export function JobApplicationCard({ item }: JobApplicationCardProps) {

const page_ctx = usePageContext();
const qc = useQueryClient();
const delete_mutation = useMutation({
  mutationFn: async (vars: { id: string }) => {
    await page_ctx.locals.pb?.collection("sherpa_job_application").delete(vars.id);
  },
  onSuccess(data, variables, context) {
    qc.invalidateQueries({ queryKey: ["sherpa_job_application"] });
    toast("Job application  deleted successfully", { type: "success" });
  },
  onError(error, variables, context) {
    toast(error.message, { type: "error", autoClose: false });
  },
});

function handleDelete(id: string) {
  delete_mutation.mutate({ id });
}

  const modal_id = 'delete_education_modal';
  return (
    <div
      key={item.id}
      className="flex w-[95%] flex-col justify-center gap-1 rounded-md border p-2 shadow-sm
      shadow-accent hover:border-accent sm:w-[45%] lg:w-[30%]"
    >
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/job/${item.id}`}
          key={item.id}
          about="view job application"
          className="flex w-full flex-col justify-center gap-1 rounded-md hover:text-accent
            p-2  "
        >
          <h3 className="text-xl font-bold">{item.title}</h3>
          <p className="line-clamp-2 text-sm">{item.description}</p>
        </Link>
        <div className="flex items-start h-full">
          <DeleteConfirm
            is_loading={delete_mutation.isPending}
            handleDelete={() => handleDelete(item.id)}
            modal_id={modal_id}
          />
        </div>
      </div>

      <Link
        href={item.posting_url ?? ''}
        target="_blank"
        prefetch={'never'}
        className="hover:brightness-75 hover:text-blue-600 flex gap-2 items-center w-full overflow-clip hover:overflow-visible"
      >
        {item.posting_url}
        <ExternalLink className="w-4 h-4" />
      </Link>
      <div className=" flex items-center justify-between text-sm border-t">
        <h3>On : {dateToString(item.created)}</h3>
      </div>
    </div>
  );
}
