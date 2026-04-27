import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { StatusBadge } from "@/components/multaqa/LocationToggle";
import { Button } from "@/components/ui/button";
import { getRoom, locationAddress } from "@/lib/multaqa/data";
import { Check, X, MessageCircle, Users, MapPin, ArrowLeft, Star, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/rooms/$roomId")({
  head: ({ params }) => {
    const r = getRoom(params.roomId);
    return {
      meta: [
        { title: r ? `${r.name} — Multaqa` : "Room — Multaqa" },
        { name: "description", content: r ? `Book ${r.name} at Multaqa ${r.location}. Fits up to ${r.capacity} people.` : "Room details" },
      ],
    };
  },
  component: RoomDetail,
});

function RoomDetail() {
  const { roomId } = useParams({ from: "/rooms/$roomId" });
  const room = getRoom(roomId);
  if (!room || room.adminOnly) throw notFound();
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = room.images && room.images.length ? room.images : [room.image];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Link to="/rooms" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to rooms
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden border border-border bg-muted aspect-[16/10]">
              <img src={photos[photoIdx]} alt={`${room.name} — photo ${photoIdx + 1}`} className="h-full w-full object-cover" width={1024} height={640} />
              {photos.length > 1 && (
                <>
                  <button onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/85 backdrop-blur-sm shadow flex items-center justify-center text-navy hover:bg-background">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/85 backdrop-blur-sm shadow flex items-center justify-center text-navy hover:bg-background">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {photos.map((_, i) => (
                      <button key={i} onClick={() => setPhotoIdx(i)} aria-label={`Go to photo ${i + 1}`} className={`h-2 rounded-full transition-all ${i === photoIdx ? "w-6 bg-white" : "w-2 bg-white/60"}`} />
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
              <h1 className="text-3xl font-bold text-navy">{room.name}</h1>
              <span className="text-sm px-2 py-1 rounded-full bg-navy-tint text-navy">{room.type}</span>
              <StatusBadge status={room.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {locationAddress[room.location]}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-tint border border-primary/20">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-bold text-navy">Fits up to {room.capacity} {room.capacity === 1 ? "person" : "people"}</span>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-navy mb-3">Equipment</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {room.equipment.map((e) => (
                  <div key={e.label} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                    {e.available ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-muted-foreground/50" />}
                    <span className={e.available ? "text-navy text-sm" : "text-muted-foreground text-sm line-through"}>{e.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-navy mb-3">Reviews</h2>
              <div className="space-y-3">
                {room.reviews.map((r, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-navy text-sm">{r.author}</div>
                      <div className="flex gap-0.5">
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

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="text-sm text-muted-foreground">From</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-navy">{room.pricePerHour}</span>
                <span className="text-muted-foreground">ILS / hour</span>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Half-day</span><span className="font-semibold text-navy">{room.priceHalfDay} ILS</span></div>
              </div>
              <Button
                asChild
                disabled={room.status !== "Available"}
                className="mt-6 w-full h-11 bg-success hover:bg-success/90 text-success-foreground disabled:opacity-50"
              >
                <Link to="/booking/$itemType/$itemId" params={{ itemType: "room", itemId: room.id }}>
                  {room.status === "Available" ? "Book This Room" : "Currently Reserved"}
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
