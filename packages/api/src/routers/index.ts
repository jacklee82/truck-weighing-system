import { publicProcedure, router } from "../index";
import { weighingRouter } from "./weighing-raw";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	weighing: weighingRouter,
});
export type AppRouter = typeof appRouter;
