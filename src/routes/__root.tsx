import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <main className="flex flex-col h-screen font-sansb">
        <div className="h-10 w-full [app-region:drag]"></div>
        <Outlet />
      </main>
    </>
  );
}
