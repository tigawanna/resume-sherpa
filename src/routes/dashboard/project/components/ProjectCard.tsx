import { DeleteConfirm } from '@/components/modal/DeleteConfirm';
import { SherpaProjectsResponse, SherpaUserResponse } from '@/lib/pb/db-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from '@unpic/react';
import { Link, usePageContext, useSSM } from 'rakkasjs';
import { toast } from 'react-toastify';

interface ProjectCardProps {
  item: SherpaProjectsResponse;
}

export function ProjectCard({ item}: ProjectCardProps) {
const page_ctx = usePageContext();
const qc = useQueryClient();
const delete_mutation = useMutation({
  mutationFn: async (vars: { id: string }) => {
    await page_ctx.locals.pb?.collection("sherpa_projects").delete(vars.id);
  },
  onSuccess(data, variables, context) {
    qc.invalidateQueries({ queryKey: ["sherpa_projects"] });
    toast("content deleted successfully", { type: "success" });
  },
  onError(error, variables, context) {
    toast(error.message, { type: "error", autoClose: false });
  },
});

function handleDelete(id: string) {
  delete_mutation.mutate({ id });
}

  const modal_id = 'delete_project_modal';
  return (
    <div
      key={item.id}
      className="flex w-full flex-col justify-center gap-1 rounded-md border p-1 shadow-sm
      shadow-accent hover:border-accent sm:w-[45%] lg:w-[30%] relative "
    >
      <Link
        href={`/dashboard/project/${item.id}`}
        key={item.id}
        className="hover:bg-base-300 hover:text-accent w-full rounded-lg"
      >
        <h2 className="text-xl font-bold p-2">{item.name}</h2>
        <figure className="h-full w-full ">
          <Image
            src={item.image_url ?? "https://picsum.photos/id/4/500/333"}
            alt={item.name}
            loading="lazy"
            layout="fullWidth"
            height={200}
            className="h-auto w-full"
          />
        </figure>
      </Link>
      <div className="flex w-full items-start justify-between gap-1">
        <p className="line-clamp-2 px-2 py-1 text-sm">{item.description}</p>
        <div className="w-fit">
          <DeleteConfirm
            is_loading={delete_mutation.isPending}
            handleDelete={() => handleDelete(item.id)}
            modal_id={modal_id}
          />
        </div>
      </div>
    </div>
  );
}
