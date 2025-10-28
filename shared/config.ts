import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { ipcLink } from "trpc-electron/renderer";
import type { AppRouter } from "./routers/_app";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {},
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [ipcLink()],
});

export default trpc;
