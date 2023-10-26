import { Spinner } from "@/components/navigation/loaders/Spinner";
import { pb } from "@/lib/pb/client";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
	const query =  useQuery({
    queryFn: () => {
      return pb.collection("sherpa_user").listAuthMethods();
    },
	queryKey: ["authMethods"],
  });
	return (
		<main className="flex flex-col items-center w-full min-h-screen h-full">
			{query.isFetching && (
				<Spinner/>
			)}
				<h1>Hello world!</h1>
			{query.data && (
			<div className="flex flex-col gap-2">
				{query.data.authProviders.map((provider) => {
					return (
						<h2 key={provider.name}>{provider.name}</h2>
					);
				})}
			</div>
			)}
		</main>
	);
}
