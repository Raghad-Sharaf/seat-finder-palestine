import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { bookings } from "@/lib/multaqa/data";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/my-bookings/$bookingId/modify")({
  head: () => ({ meta: [{ title: "Modify booking — Multaqa" }] }),
  component: ModifyBooking,
});

const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i);
const fmt = (h: number) => `${String(h).padStart(2, "0")}:00`;

function parseSlot(slot: string): { start: number | null; end: number | null } {
  const m = slot.match(/(\d{1,2}):\d{2}\s*[–-]\s*(\d{1,2}):\d{2}/);
  if (!m) return { start: null, end: null };
  return { start: parseInt(m[1], 10), end: parseInt(m[2], 10) };
}

function ModifyBooking() {
  const { bookingId } = useParams({ from: "/my-bookings/$bookingId/modify" });
  const navigate = useNavigate();
  const booking = bookings.find((b) => b.id === bookingId);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const maxDate = useMemo(() => { const d = new Date(today); d.setMonth(d.getMonth() + 1); return d; }, []);

  const initialSlot = parseSlot(booking?.timeSlot ?? "");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startHour, setStartHour] = useState<number | null>(initialSlot.start);
  const [endHour, setEndHour] = useState<number | null>(initialSlot.end);

  if (!booking) return <div className="p-8 text-center">Booking not found. <Link to="/my-bookings" className="text-primary">Back</Link></div>;

  const hours = startHour != null && endHour != null && endHour > startHour ? endHour - startHour : 0;
  const newDateStr = date ? date.toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" }) : booking.date;
  const newSlot = hours > 0 ? `${fmt(startHour!)} – ${fmt(endHour!)}` : booking.timeSlot;
  const dateChanged = date && newDateStr !== booking.date;
  const timeChanged = newSlot !== booking.timeSlot;
  const hasChanges = !!dateChanged || timeChanged;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-10 py-8">
        <Link to="/my-bookings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to bookings
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-navy">Modify booking</h1>
          <p className="text-sm text-muted-foreground">{booking.itemName} · Ref {booking.ref}</p>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-5 items-start">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-primary" /> Pick a new date
              </h2>
              <p className="text-xs text-muted-foreground mb-3">Currently set to {booking.date}.</p>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={{ before: today, after: maxDate }}
                  fromDate={today}
                  toDate={maxDate}
                  className="p-2 pointer-events-auto"
                />
              </div>
              {date && (
                <p className="mt-3 text-sm text-navy font-medium">New date: {newDateStr}</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" /> Pick a new time
              </h2>
              <p className="text-xs text-muted-foreground mb-4">Currently set to {booking.timeSlot}.</p>
              <div className="space-y-5">
                <div>
                  <Label className="text-navy text-sm">Start time</Label>
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {HOURS.slice(0, -1).map((h) => {
                      const sel = startHour === h;
                      return (
                        <button
                          key={h}
                          onClick={() => {
                            setStartHour(h);
                            if (endHour != null && endHour <= h) setEndHour(null);
                          }}
                          className={`px-2 py-2 rounded-md border text-sm transition-colors ${
                            sel ? "bg-navy border-navy text-navy-foreground" : "border-border text-navy hover:border-primary"
                          }`}
                        >
                          {fmt(h)}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label className="text-navy text-sm">End time</Label>
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {HOURS.slice(1).map((h) => {
                      const disabled = startHour == null || h <= startHour;
                      const sel = endHour === h;
                      return (
                        <button
                          key={h}
                          disabled={disabled}
                          onClick={() => setEndHour(h)}
                          className={`px-2 py-2 rounded-md border text-sm transition-colors ${
                            disabled
                              ? "bg-muted/50 border-border text-muted-foreground/50 cursor-not-allowed"
                              : sel
                              ? "bg-success border-success text-success-foreground"
                              : "border-border text-navy hover:border-primary"
                          }`}
                        >
                          {fmt(h)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {hours > 0 && (
                <p className="mt-4 text-sm text-navy font-medium">{hours} hour{hours > 1 ? "s" : ""} per day</p>
              )}
            </div>
          </div>

          {/* Right summary card */}
          <aside>
            <div className="rounded-xl border border-border bg-card p-5 sticky top-24">
              <h3 className="font-bold text-navy">Booking summary</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-navy">{booking.itemName}</div>
                    <div className="text-xs text-muted-foreground">{booking.location}</div>
                  </div>
                </div>
                <div className="border-t border-border pt-3 space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className={`font-medium ${dateChanged ? "text-primary" : "text-navy"}`}>{newDateStr}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className={`font-medium ${timeChanged ? "text-primary" : "text-navy"}`}>{newSlot}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Ref</span><span className="font-mono text-xs text-navy">{booking.ref}</span></div>
                </div>
              </div>

              <Button
                className="w-full h-11 mt-5 bg-primary hover:bg-primary/90 disabled:opacity-50"
                disabled={!hasChanges}
                onClick={() => {
                  if (date) booking.date = newDateStr;
                  if (hours > 0) booking.timeSlot = newSlot;
                  toast.success("Booking updated", { description: `${newDateStr} · ${newSlot}` });
                  navigate({ to: "/my-bookings" });
                }}
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 mt-2 border-navy/20 text-navy"
                onClick={() => navigate({ to: "/my-bookings" })}
              >
                Keep Original
              </Button>
              {!hasChanges && (
                <p className="mt-3 text-xs text-muted-foreground text-center">Pick a new date or time to enable Save.</p>
              )}
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
