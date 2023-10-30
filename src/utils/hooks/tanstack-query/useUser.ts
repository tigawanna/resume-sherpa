import { SherpaUserResponse } from "@/lib/pb/db-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePageContext } from "rakkasjs";

export function useUser(){
    const qc = useQueryClient()
    const page_ctx = usePageContext()
    const locals  = page_ctx.locals
    const mutation = useMutation({
        mutationFn: async() => {
            return locals.pb?.authStore.clear();
        },
        onSuccess:()=>{
            qc.invalidateQueries({ queryKey: ['sherpa_user'] })
            window?.location&&window?.location.reload();
        }
    })
    
    const query = useQuery({
        queryKey: ['sherpa_user'],
        queryFn:()=>{
            return locals.pb?.authStore.model as SherpaUserResponse
        },
        refetchOnWindowFocus:true,
        refetchOnMount:true
    });

    return { user_query:query, user_mutation:mutation,page_ctx,logout:mutation.mutate} 
}
