import trpc, { queryClient, trpcClient } from "@shared/config";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createHashHistory,
  createRouter,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/ui/theme-provider";
import "./index.css";
import { routeTree } from "./routeTree.gen";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { ConvexReactClient } from "convex/react";

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 1000 * 60 * 5,
  defaultPreloadDelay: 500,
  history: hashHistory,
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string,
  {
    expectAuth: true,
  }
);

function App() {
  return (
    <StrictMode>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ConvexBetterAuthProvider client={convex} authClient={authClient}>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
            </QueryClientProvider>
          </trpc.Provider>
        </ConvexBetterAuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
