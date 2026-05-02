import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { Button } from "@/components/ui/button";
import { bookings } from "@/lib/multaqa/data";
import { ArrowLeft, Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/my-bookings/$bookingId/modify")({
  head: () => ({ meta: [{ title: "Modify booking — Multaqa" }] }),
  component: ModifyBooking,
});

const SLOTS = ["09:00 – 10:00", "10:00 – 11:00", "11:00 – 12:00", "13:00 – 14:00", "14:00 – 15:00", "15:00 – 16:00", "16:00 – 17:00"];

function ModifyBooking() {
  const { bookingId } = useParams({ from: "/my-bookings/$bookingId/modify" });
  const navigate = useNavigate();
  const booking = bookings.find((b) => b.id === bookingId);
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });

  const [date, setDate] = useState<string>(dates[1].toDateString());
  const [slot, setSlot] = useState<string>(booking?.timeSlot ?? SLOTS[0]);
  const [error, setError] = useState("");

  if (!booking) return <div className="p-8 text-center">Booking not found. <Link to="/my-bookings" className="text-primary">Back</Link></div>;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/my-bookings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to bookings
        </Link>
        <div className="rounded-xl border border-border bg-card p-6">
          <h1 className="text-2xl font-bold text-navy">Modify booking</h1>
          <p className="text-sm text-muted-foreground">{booking.itemName} · Ref {booking.ref}</p>

          <div className="mt-6">
            <h2 className="text-sm font-bold text-navy flex items-center gap-2 mb-3"><CalendarIcon className="h-4 w-4 text-primary" /> Date</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dates.map((d) => {
                const k = d.toDateString();
                const sel = date === k;
                return (
                  <button key={k} onClick={() => setDate(k)} className={`flex flex-col items-center min-w-[60px] p-2 rounded-lg border ${sel ? "bg-primary border-primary text-primary-foreground" : "border-border text-navy hover:border-primary"}`}>
                    <span className="text-xs uppercase">{d.toLocaleDateString("en", { weekday: "short" })}</span>
                    <span className="text-lg font-bold">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-bold text-navy flex items-center gap-2 mb-3"><Clock className="h-4 w-4 text-primary" /> Time slot</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SLOTS.map((s) => {
                const unavailable = s === "11:00 – 12:00";
                const sel = slot === s;
                return (
                  <button key={s} disabled={unavailable} onClick={() => { setSlot(s); setError(""); }} className={`p-2.5 rounded-lg border text-sm font-medium ${unavailable ? "bg-muted/50 border-border text-muted-foreground/50 line-through" : sel ? "bg-success border-success text-success-foreground" : "border-border text-navy hover:border-primary"}`}>
                    {s}
                  </button>
                );
              })}
            </div>
            {error && <p className="mt-2 text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
          </div>

          <div className="mt-8 flex gap-3">
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                const d = new Date(date);
                const formatted = d.toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" });
                booking.date = formatted;
                booking.timeSlot = slot;
                navigate({ to: "/my-bookings" });
              }}
            >
              Save Changes
            </Button>
            <Button variant="outline" asChild><Link to="/my-bookings">Keep Original</Link></Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
