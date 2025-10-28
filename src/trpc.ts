import type { Context } from "@shared/context";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<Context>().create({
  isServer: true,
});

export const router = t.router;
export const publicProcedure = t.procedure;
