import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Authenticated>
        <div>Authenticated</div>
      </Authenticated>

      <Unauthenticated>
        <div>Unauthenticated</div>
      </Unauthenticated>
    </div>
  );
}
