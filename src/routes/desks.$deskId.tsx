import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { StatusBadge, ZoneBadge } from "@/components/multaqa/LocationToggle";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getDesk, locationAddress } from "@/lib/multaqa/data";
import { Check, X, MessageCircle, Star, MapPin, ArrowLeft, ChevronLeft, ChevronRight, Info } from "lucide-react";

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
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = desk.images && desk.images.length ? desk.images : [desk.image];

  const typeExplanation: Record<string, string> = {
    "Flex Desk": "Flex Desk — any open desk in the shared area. First-come within your booked slot.",
    "Hot Desk": "Hot Desk — any available desk for the day. Pick what's free when you arrive.",
    "Dedicated Desk": "Dedicated Desk — your own assigned desk, reserved for your use only.",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Link to="/desks" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to desks
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden border border-border bg-muted aspect-[16/10] group">
              <img src={photos[photoIdx]} alt={`${desk.name} — photo ${photoIdx + 1}`} className="h-full w-full object-cover" width={1024} height={640} />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/85 backdrop-blur-sm shadow flex items-center justify-center text-navy hover:bg-background"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/85 backdrop-blur-sm shadow flex items-center justify-center text-navy hover:bg-background"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPhotoIdx(i)}
                        aria-label={`Go to photo ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${i === photoIdx ? "w-6 bg-white" : "w-2 bg-white/60"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {photos.length > 1 && (
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {photos.map((p, i) => (
                  <button key={i} onClick={() => setPhotoIdx(i)} className={`h-16 w-20 shrink-0 rounded-md overflow-hidden border-2 transition ${i === photoIdx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    <img src={p} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-navy">{desk.name}</h1>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-sm px-2 py-1 rounded-full bg-navy-tint text-navy inline-flex items-center gap-1 hover:bg-navy/10 transition-colors">
                    {desk.type} <Info className="h-3 w-3 opacity-70" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="text-sm max-w-xs">
                  {typeExplanation[desk.type]}
                </PopoverContent>
              </Popover>
              <ZoneBadge zone={desk.zone} />
              <StatusBadge status={desk.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {locationAddress[desk.location]}
            </p>

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
