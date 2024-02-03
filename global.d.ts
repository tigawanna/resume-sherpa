import { TypedPocketBase } from "typed-pocketbase";
import { Schema } from "src/lib/pb/db-types";

declare module "rakkasjs" {
    interface PageLocals {
        /** My application-specific stuff */
        test: string;
        pb: TypedPocketBase<Schema>;
    }
    interface ServerSideLocals {
        /** My application-specific stuff */
        test: string;
        pb: TypedPocketBase<Schema>;
    }
}



// declare interface ApiRouteResponse<T> {
//     data:T|null,
//     error: {
//         message: string;
//         original_error: string,

//     }|null
// }
declare interface ReturnedError {
    error: {
        message: string;
        original_error: string,

    }
}
