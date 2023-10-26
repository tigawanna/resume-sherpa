import { useQuery } from "@tanstack/react-query";
import { PageProps, usePageContext } from "rakkasjs";

export default function HomePage({}:PageProps) {
	const page_ctx  = usePageContext();
	console.log("page_ctx    ==================  ",page_ctx.locals);
	
	const pb = page_ctx.locals.pb;
	
	const query =  useQuery({
    queryFn: () => {
      return pb.collection("sherpa_user").listAuthMethods();
    },
	queryKey: ["authMethods"],
  });
	const user_query =  useQuery({
    queryFn: () => {
      return pb.authStore.model
    },
	queryKey: ["user"],
  });

	return (
    <main className="flex flex-col items-center w-full min-h-screen h-full gap-3">
      {/* {query.isFetching && (
				<Spinner/>
			)} */}
      <h1 className="text-6xl font-bold">Hello world!</h1>
      {user_query.data && (
        <h3 className="text-4xl font-bold text-accent ">
          {user_query?.data?.email}
        </h3>
      )}
     <h3 className="text-xl font-bold underline">Available Auth Providers </h3>
      {query.data && (
        <div className="flex flex-col gap-2  rounded-lg">
          {query.data.authProviders.map((provider) => {
            return <h2 key={provider.name} className="border border-accent p-1 px-2 rounded-lg">{provider.name}</h2>;
          })}
        </div>
      )}

    </main>
  );
}
