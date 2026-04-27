import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({ component: () => (
  <div>
    <h1 className="text-2xl font-bold text-navy">Analytics</h1>
    <div className="mt-6 rounded-xl border border-dashed border-border p-12 text-center">
      <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-3 font-semibold text-navy">Coming soon</p>
      <p className="text-sm text-muted-foreground mt-1">Detailed booking analytics, occupancy trends, and revenue reports.</p>
    </div>
  </div>
)});
