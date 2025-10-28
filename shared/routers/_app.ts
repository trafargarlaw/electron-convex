import { publicProcedure, router } from "@/trpc";
import { windowRouter } from "./window";

export const appRouter = router({
  // Window related helpers (toast, controls)
  window: windowRouter,
  // Tracking related helpers
  version: publicProcedure.query(async () => {
    return "version 0.0.1";
  }),
});

export type AppRouter = typeof appRouter;
