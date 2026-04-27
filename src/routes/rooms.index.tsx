import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { LocationToggle, StatusBadge } from "@/components/multaqa/LocationToggle";
import { Button } from "@/components/ui/button";
import { rooms as initialRooms, type Location, type RoomType, type Status } from "@/lib/multaqa/data";
import { Users, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/rooms/")({
  head: () => ({
    meta: [
      { title: "Browse Rooms — Multaqa" },
      { name: "description", content: "Private offices, meeting rooms, and phone booths in Nablus and Ramallah." },
    ],
  }),
  component: RoomsPage,
});

const roomTypes: RoomType[] = ["Private Office", "Meeting Room", "Phone Booth"];

function RoomsPage() {
  const [location, setLocation] = useState<Location>("Nablus");
  const [type, setType] = useState<RoomType | "All">("All");
  const [statuses, setStatuses] = useState<Record<string, Status>>(() =>
    Object.fromEntries(initialRooms.map((r) => [r.id, r.status])),
  );
  useEffect(() => {
    const t = setInterval(() => {
      setStatuses((prev) => {
        const ids = Object.keys(prev);
        const id = ids[Math.floor(Math.random() * ids.length)];
        const cur = prev[id];
        if (cur === "Maintenance") return prev;
        return { ...prev, [id]: cur === "Available" ? "Reserved" : "Available" };
      });
    }, 8000);
    return () => clearInterval(t);
  }, []);
  const rooms = useMemo(
    () => initialRooms.map((r) => ({ ...r, status: statuses[r.id] ?? r.status })),
    [statuses],
  );

  const filtered = useMemo(
    () =>
      rooms.filter((r) => {
        if (r.adminOnly) return false;
        if (r.location !== location) return false;
        if (type !== "All" && r.type !== type) return false;
        return true;
      }),
    [rooms, location, type],
  );

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy">Browse Rooms</h1>
            <p className="text-sm text-muted-foreground mt-1">Private offices, meeting rooms, and phone booths.</p>
          </div>
          <LocationToggle value={location} onChange={setLocation} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 mb-6 flex flex-wrap items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase">Type:</span>
          {(["All", ...roomTypes] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t as RoomType | "All")}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                type === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-navy font-semibold">No rooms available right now.</p>
            <p className="text-sm text-muted-foreground mt-1">Browse our desks instead.</p>
            <Button asChild className="mt-4 bg-primary hover:bg-primary/90"><Link to="/desks">Browse Desks</Link></Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <Link
                key={r.id}
                to="/rooms/$roomId"
                params={{ roomId: r.id }}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={r.image} alt={r.name} loading="lazy" width={1024} height={768} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-3 right-3"><StatusBadge status={r.status} /></div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-navy">{r.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-navy-tint text-navy">{r.type}</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" /> Up to {r.capacity} {r.capacity === 1 ? "person" : "people"}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">From </span>
                      <span className="font-bold text-navy">{r.pricePerHour} ILS</span>
                      <span className="text-muted-foreground">/hr</span>
                    </div>
                    <span className="text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-xl bg-navy-tint border border-navy/10 p-6 text-center">
          <p className="text-navy font-semibold">Need something custom? Booking for a team?</p>
          <p className="text-sm text-muted-foreground mt-1">We can help arrange adjacent desks or extended room bookings.</p>
          <Button variant="outline" className="mt-3 border-navy text-navy">Contact Us</Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
