import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/tanstack-react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@my-better-t-app/api/routers/index";
import { toast } from "sonner";

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(error.message, {
				action: {
					label: "retry",
					onClick: () => {
						queryClient.invalidateQueries();
					},
				},
			});
		},
	}),
});

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
	links: [
		httpBatchLink({
			url: "/api/trpc",
		}),
	],
});
