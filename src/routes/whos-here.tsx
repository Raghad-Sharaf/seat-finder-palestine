import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { LocationToggle } from "@/components/multaqa/LocationToggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { todaysMembers, type Location } from "@/lib/multaqa/data";
import { useAuth } from "@/lib/multaqa/auth";

export const Route = createFileRoute("/whos-here")({
  head: () => ({ meta: [{ title: "Who's in the space today — Multaqa" }] }),
  component: WhosHere,
});

function WhosHere() {
  const { user } = useAuth();
  const [location, setLocation] = useState<Location>("Nablus");
  const [showName, setShowName] = useState(true);

  if (!user) return <Navigate to="/login" />;

  const members = todaysMembers.filter((m) => m.location === location);
  const today = new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-10 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-navy">Who's in the space today</h1>
            <p className="text-sm text-muted-foreground mt-1">Today, {today}</p>
          </div>
          <LocationToggle value={location} onChange={setLocation} />
        </div>

        <div className="rounded-lg bg-navy-tint border border-navy/10 px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm text-navy font-semibold">{members.length} members in the space today</span>
          <div className="flex items-center gap-2">
            <Switch id="show-name" checked={showName} onCheckedChange={setShowName} />
            <Label htmlFor="show-name" className="text-sm text-navy">Show my name today</Label>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {members.map((m, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${m.anonymous ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                {m.anonymous ? "?" : m.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-navy">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
