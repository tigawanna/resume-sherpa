import { Spinner } from "@/components/navigation/loaders/Spinner";
import { pb } from "@/lib/pb/client";
import { tryCatchWrapper } from "@/utils/async";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PageProps } from "rakkasjs";
import { toast } from "react-toastify";
export default function UserPage({}: PageProps) {
  const query = useQuery({
    queryFn: () => {
      return tryCatchWrapper(
        pb.collection("sherpa_user").getOne("nxp5xkv38p1elvc"),
      );
    },
    queryKey: ["user"],
  });

  const muttion = useMutation({
    mutationFn: () => {
      return tryCatchWrapper(
        pb
          .collection("sherpa_user")
          .authWithPassword("boys@email.com", "pass_word"),
      );
    },
    onSuccess(data, variables, context) {
        if(data.data){
            // document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
            toast("Logged in", { type: "success" });
        }
        if(data.error){
            toast("Errr logging in "+data.error.message, { type: "error" });
        }
    },
    onError: (error:any) => {
      toast("Errr logging in "+error.message, { type: "error" });
    },
  });
  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center">
      {query.isFetching && <Spinner />}
      {query.data?.error && <div>{query.data.error.message}</div>}
      {query.data?.data && (
        <div className="flex flex-col gap-2 text-accent">
          {query.data?.data?.email}
        </div>
      )}
      <button className="btn" onClick={() => muttion.mutate()}>
        login
      </button>
    </div>
  );
}
