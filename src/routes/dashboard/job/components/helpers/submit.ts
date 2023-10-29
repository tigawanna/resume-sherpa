import { SherpaJobApplicationCreate, SherpaJobApplicationUpdate } from "@/lib/pb/db-types";
import { UseMutationResult } from "@tanstack/react-query";
import { ClientResponseError } from "pocketbase";
import { toast } from "react-toastify";
import { TypedRecord } from "typed-pocketbase";

interface ISubmitJobApplication{
updating?: boolean;
editing: boolean;
    create_mutation: UseMutationResult<
        {
            data: TypedRecord<
                {
                    user: string;
                    title: string;
                    description: string;
                    posting_url: string;
                    cover_letter?: string | undefined;
                    resume?: string | undefined;
                    id: string;
                    created: string;
                    updated: string;
                },
                {}
            > | null;
            error: ClientResponseError | null;
        },
        Error,
        SherpaJobApplicationCreate,
        unknown
    >;
    update_mutation: UseMutationResult<
        {
            data: TypedRecord<
                {
                    user: string;
                    title: string;
                    description: string;
                    posting_url: string;
                    cover_letter?: string | undefined;
                    resume?: string | undefined;
                    id: string;
                    created: string;
                    updated: string;
                },
                {}
            > | null;
            error: ClientResponseError | null;
        },
        Error,
        SherpaJobApplicationUpdate,
        unknown
    >;
input: any
}
export function handleJobApplicationSubmit({create_mutation,editing,update_mutation,updating,input}:ISubmitJobApplication){
    return function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        e.stopPropagation();

        if (editing) {
            if (updating) {
                update_mutation
                    .mutateAsync(input)
                    .then((res) => {
                        if (res.error) {
                            toast(res.error.message, {
                                type: "error",
                                autoClose: false,
                            });
                        }
                        if (res.data) {
                            toast("JobAplication updated successfully", {
                                type: "success",
                            });

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
                            toast(res.error.message, {
                                type: "error",
                                autoClose: false,
                            });
                        }
                        if (res.data) {
                            toast("JobAplication added successfully", {
                                type: "success",
                            });

                        }
                    
                    })
                    .catch((error) =>
                        toast(error.message, { type: 'error', autoClose: false }),
                    );
            }
        }
    }

}


