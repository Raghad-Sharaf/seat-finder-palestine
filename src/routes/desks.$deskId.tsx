import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { StatusBadge, ZoneBadge } from "@/components/multaqa/LocationToggle";
import { Button } from "@/components/ui/button";
import { getDesk, locationAddress } from "@/lib/multaqa/data";
import { Wifi, Check, X, MessageCircle, Star, MapPin, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/desks/$deskId")({
  head: ({ params }) => {
    const d = getDesk(params.deskId);
    return {
      meta: [
        { title: d ? `${d.name} — Multaqa` : "Desk — Multaqa" },
        { name: "description", content: d ? `Book ${d.name} at Multaqa ${d.location}. ${d.zone} zone, from ${d.pricePerHour} ILS/hr.` : "Desk details" },
      ],
    };
  },
  component: DeskDetail,
  notFoundComponent: () => <div className="p-8 text-center">Desk not found</div>,
});

function DeskDetail() {
  const { deskId } = useParams({ from: "/desks/$deskId" });
  const desk = getDesk(deskId);
  if (!desk) throw notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Link to="/desks" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to desks
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border border-border bg-muted aspect-[16/10]">
              <img src={desk.image} alt={desk.name} className="h-full w-full object-cover" width={1024} height={640} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-navy">{desk.name}</h1>
              <span className="text-sm px-2 py-1 rounded-full bg-muted text-muted-foreground">{desk.type}</span>
              <ZoneBadge zone={desk.zone} />
              <StatusBadge status={desk.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {locationAddress[desk.location]}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-tint border border-primary/20 text-sm">
              <Wifi className="h-4 w-4 text-primary" />
              <span className="font-semibold text-navy">WiFi: {desk.wifi}</span>
              <span className="text-muted-foreground">— {desk.wifi === "Fast" ? "200+ Mbps fiber" : desk.wifi === "Good" ? "100 Mbps" : "50 Mbps"}</span>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-navy mb-3">Zone</h2>
              <p className="text-sm text-muted-foreground">
                {desk.zone === "Deep Work"
                  ? "Deep Work Zone — No talking. Quiet keyboards welcome. Perfect for heads-down focus."
                  : "Calls Allowed Zone — Take calls and join Zoom meetings without disturbing others."}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-navy mb-3">Amenities</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {desk.amenities.map((a) => (
                  <div key={a.label} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                    {a.available ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-muted-foreground/50" />}
                    <span className={a.available ? "text-navy text-sm" : "text-muted-foreground text-sm line-through"}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-navy mb-3">Reviews</h2>
              <div className="space-y-3">
                {desk.reviews.map((r, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-navy text-sm">{r.author}</div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r.rating }).map((_, k) => (
                          <Star key={k} className="h-3.5 w-3.5 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">"{r.comment}"</p>
                    <div className="mt-1 text-xs text-muted-foreground">{r.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky booking sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="text-sm text-muted-foreground">From</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-navy">{desk.pricePerHour}</span>
                <span className="text-muted-foreground">ILS / hour</span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Half-day</span><span className="font-semibold text-navy">{desk.priceHalfDay} ILS</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Full day</span><span className="font-semibold text-navy">{desk.priceFullDay} ILS</span></div>
              </div>
              <Button
                asChild
                disabled={desk.status !== "Available"}
                className="mt-6 w-full h-11 bg-success hover:bg-success/90 text-success-foreground disabled:opacity-50"
              >
                <Link to="/booking/$itemType/$itemId" params={{ itemType: "desk", itemId: desk.id }}>
                  {desk.status === "Available" ? "Book This Desk" : "Currently Reserved"}
                </Link>
              </Button>
              <Button variant="outline" className="mt-2 w-full h-10 border-navy/20 text-navy">
                <MessageCircle className="mr-2 h-4 w-4" /> Contact via WhatsApp
              </Button>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                Free cancellation up to 2 hours before your booking starts.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
