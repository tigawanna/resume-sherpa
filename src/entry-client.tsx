/* eslint-disable no-var */
import { startClient } from "rakkasjs";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TypedPocketBase } from "typed-pocketbase";
import PocketBase from 'pocketbase'
import { Schema } from "./lib/pb/db-types";




const queryClient = new QueryClient({

  defaultOptions: {
    queries: {
      suspense: true,
      staleTime: 100,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

function setQueryData(data: Record<string, unknown>) {
  for (const [key, value] of Object.entries(data)) {
    queryClient.setQueryData(JSON.parse(key), value, { updatedAt: Date.now() });
  }
}
declare global {
  var $TQD: Record<string, unknown> | undefined;
  var $TQS: typeof setQueryData;
}

// Insert data that was already streamed before this point
setQueryData(globalThis.$TQD ?? {});
// Delete the global variable so that it doesn't get serialized again
delete globalThis.$TQD;
// From now on, insert data directly
globalThis.$TQS = setQueryData;

startClient({
  hooks: {
    wrapApp(app) {
      return (
        <QueryClientProvider client={queryClient}>{app}</QueryClientProvider>
      );
    },
    beforeStart() {
      // Do something before starting the client
    },
    extendPageContext(ctx) {
        ctx.locals.test = "CLIENT EXTEND PAGE CONTEXT";
        console.log("CKLIENT POCKETBASE INSTANCE ",ctx.locals.pb);
   
        if (!ctx.locals.pb){
          ctx.locals.pb = new PocketBase(
            import.meta.env.RAKKAS_PB_URL,
          ) as TypedPocketBase<Schema>;
          const model = ctx.locals.pb.authStore.model
          console.log(
            "CKLIENT POCKETBASE INSTANCE AUTH STORE EMAIL========== ",
            model?.email
          );
          // ctx.locals.pb.authStore.loadFromCookie(
          //   ctx.request.headers.get("cookie") || ""
          // );
      }
             console.log(
               "CKLIENT POCKETBASE INSTANCE INITED AFTER",
               ctx.locals.pb,
             );
      // Add properties to the page context,
      // especially to ctx.locals.
      // Extensions added here will only be
      // available on the client-side.
    },
  },
});
