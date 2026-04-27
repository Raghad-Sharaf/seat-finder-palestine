import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { LocationToggle, StatusBadge, ZoneBadge } from "@/components/multaqa/LocationToggle";
import { Button } from "@/components/ui/button";
import { desks, type Location, type Zone, type DeskType } from "@/lib/multaqa/data";
import { Wifi, MonitorIcon, ArmchairIcon, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/desks/")({
  head: () => ({
    meta: [
      { title: "Browse Desks — Multaqa" },
      { name: "description", content: "Browse coworking desks in Nablus and Ramallah. Filter by zone, type, and amenities." },
    ],
  }),
  component: DesksPage,
});

const zones: Zone[] = ["Deep Work", "Calls Allowed"];
const types: DeskType[] = ["Flex Desk", "Hot Desk", "Dedicated Desk"];
const amens = ["Window", "Monitor", "Standing Desk"];

function DesksPage() {
  const [location, setLocation] = useState<Location>("Nablus");
  const [zone, setZone] = useState<Zone | "All">("All");
  const [type, setType] = useState<DeskType | "All">("All");
  const [amenity, setAmenity] = useState<string | "All">("All");

  const filtered = useMemo(() => {
    return desks.filter((d) => {
      if (d.location !== location) return false;
      if (zone !== "All" && d.zone !== zone) return false;
      if (type !== "All" && d.type !== type) return false;
      if (amenity !== "All") {
        const map: Record<string, string> = { Window: "Window seat", Monitor: "External monitor", "Standing Desk": "Standing desk" };
        if (!d.amenities.find((a) => a.label === map[amenity] && a.available)) return false;
      }
      return true;
    });
  }, [location, zone, type, amenity]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy">Browse Desks</h1>
            <p className="text-sm text-muted-foreground mt-1">Find your perfect spot. Available now.</p>
          </div>
          <LocationToggle value={location} onChange={setLocation} />
        </div>

        {/* Filter bar */}
        <div className="rounded-xl border border-border bg-card p-4 mb-6 flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <FilterPills label="Zone" options={["All", ...zones]} value={zone} onChange={(v) => setZone(v as Zone | "All")} />
          <FilterPills label="Type" options={["All", ...types]} value={type} onChange={(v) => setType(v as DeskType | "All")} />
          <FilterPills label="Amenity" options={["All", ...amens]} value={amenity} onChange={setAmenity} />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-navy font-semibold">No desks match your filters.</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setZone("All"); setType("All"); setAmenity("All"); }}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((d) => (
              <Link
                key={d.id}
                to="/desks/$deskId"
                params={{ deskId: d.id }}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={d.image} alt={d.name} loading="lazy" width={1024} height={768} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <ZoneBadge zone={d.zone} />
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={d.status} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-navy">{d.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{d.type}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Wifi className="h-3 w-3" />{d.wifi}</span>
                    {d.amenities.find((a) => a.label === "Window seat")?.available && (
                      <span className="inline-flex items-center gap-1"><ArmchairIcon className="h-3 w-3" />Window</span>
                    )}
                    {d.amenities.find((a) => a.label === "External monitor")?.available && (
                      <span className="inline-flex items-center gap-1"><MonitorIcon className="h-3 w-3" />Monitor</span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">From </span>
                      <span className="font-bold text-navy">{d.pricePerHour} ILS</span>
                      <span className="text-muted-foreground">/hr</span>
                    </div>
                    <span className="text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function FilterPills({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}:</span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              value === o ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
