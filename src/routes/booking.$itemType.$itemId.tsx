import { createFileRoute, Link, useParams, useNavigate, notFound } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { getDesk, getRoom } from "@/lib/multaqa/data";
import { useAuth } from "@/lib/multaqa/auth";
import { Check, Info, Banknote, Calendar as CalendarIcon, Clock, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/booking/$itemType/$itemId")({
  component: BookingFlow,
});

// Spaces open 8:00 – 18:00. Users pick any start and end on the hour.
const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 8..18
const fmt = (h: number) => `${String(h).padStart(2, "0")}:00`;

function BookingFlow() {
  const params = useParams({ from: "/booking/$itemType/$itemId" });
  const navigate = useNavigate();
  const { user } = useAuth();

  const item =
    params.itemType === "desk"
      ? getDesk(params.itemId)
      : getRoom(params.itemId);
  if (!item) throw notFound();

  const [step, setStep] = useState<1 | 2>(1);
  const [dates, setDates] = useState<Date[]>([]);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);
  const [email, setEmail] = useState(user?.email ?? "");
  const [conflictError, setConflictError] = useState<string | null>(null);

  const isDesk = params.itemType === "desk";
  const desk = isDesk ? (item as ReturnType<typeof getDesk>)! : null;
  const room = !isDesk ? (item as ReturnType<typeof getRoom>)! : null;

  // Pricing: hourly × hours × number of days. Cap at full-day price per day.
  const hours = startHour != null && endHour != null && endHour > startHour ? endHour - startHour : 0;
  const dayCount = dates.length;
  const fullDayPrice = desk?.priceFullDay ?? room?.priceHalfDay ? (desk?.priceFullDay ?? (room!.priceHalfDay * 2)) : 0;
  const pricePerDay = hours >= 8 && fullDayPrice ? fullDayPrice : hours * item.pricePerHour;
  const price = pricePerDay * (dayCount || 1);

  // Calendar bounds: from today up to +1 month
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const maxDate = useMemo(() => { const d = new Date(today); d.setMonth(d.getMonth() + 1); return d; }, []);

  // Earliest selected date governs the cash deadline (deadline = earliest date + 3 days)
  const earliest = dates.length ? [...dates].sort((a, b) => a.getTime() - b.getTime())[0] : null;
  const deadline = useMemo(() => {
    const base = earliest ?? new Date();
    const d = new Date(base);
    d.setDate(d.getDate() + 3);
    return d;
  }, [earliest]);
  const deadlineStr = deadline.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });

  // Sorted dates string for the confirmation page (e.g. "May 2, May 5, May 9 2026")
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const fmtDate = (d: Date) => d.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const fmtDateShort = (d: Date) => d.toLocaleDateString("en", { month: "short", day: "numeric" });
  const datesLabel = dayCount === 0
    ? "Pick at least one date"
    : dayCount === 1
    ? fmtDate(sortedDates[0])
    : `${sortedDates.map(fmtDateShort).join(" · ")}, ${sortedDates[sortedDates.length - 1].getFullYear()}`;
  const slotLabel = hours > 0 ? `${fmt(startHour!)} – ${fmt(endHour!)}` : "";

  const confirm = () => {
    // Simulate a concurrent-booking race ~12% of the time
    if (Math.random() < 0.12) {
      setConflictError("This slot was just booked. Please select a different time.");
      setStep(1);
      return;
    }
    const ref = "MQR-" + Math.floor(20000 + Math.random() * 9999);
    navigate({
      to: "/booking/confirmation",
      search: {
        ref,
        name: item.name,
        location: item.location,
        date: datesLabel,
        slot: slotLabel,
        duration: hours >= 8 ? `Full day × ${dayCount}` : `${hours}h × ${dayCount} ${dayCount === 1 ? "day" : "days"}`,
        total: price,
        email,
        deadline: deadlineStr,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1 max-w-6xl mx-auto px-6 md:px-10 py-8 w-full">
        <Link to={isDesk ? "/desks/$deskId" : "/rooms/$roomId"} params={isDesk ? { deskId: params.itemId } : { roomId: params.itemId }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= n || (n === 3 && false) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {n}
              </div>
              <div className="text-xs font-semibold text-navy hidden sm:block">
                {n === 1 ? "Date & Time" : n === 2 ? "Review & Pay" : "Confirmation"}
              </div>
              {n < 3 && <div className={`flex-1 h-0.5 ${step > n ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {step === 1 ? (
              <>
                {conflictError && (
                  <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive font-medium flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{conflictError}</span>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-5 items-start">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
                    <CalendarIcon className="h-5 w-5 text-primary" /> Pick your date(s)
                  </h2>
                  <p className="text-xs text-muted-foreground mb-3">
                    Tap one or more days. You can book up to one month ahead.
                  </p>
                  <div className="flex justify-center">
                    <Calendar
                      mode="multiple"
                      selected={dates}
                      onSelect={(d) => setDates(d ?? [])}
                      disabled={{ before: today, after: maxDate }}
                      fromDate={today}
                      toDate={maxDate}
                      className="p-2 pointer-events-auto"
                    />
                  </div>
                  {dayCount > 0 && (
                    <div className="mt-3 text-sm text-navy font-medium">
                      {datesLabel}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" /> Pick your time
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4">
                    Spaces are open from 08:00 to 18:00. Pick any start and end time.
                    {dayCount > 1 && " The same time will apply to every selected day."}
                  </p>
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
                    <div className="mt-4 text-sm text-navy font-medium">
                      {hours} hour{hours > 1 ? "s" : ""} per day
                      {hours >= 8 && " · counted as a full day"}
                    </div>
                  )}
                </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold text-navy mb-4">Review your booking</h2>
                  <dl className="space-y-3 text-sm">
                    <Row label="Booking" value={item.name} />
                    <Row label="Location" value={item.location} />
                    <Row label="Date(s)" value={datesLabel} />
                    <Row label="Time" value={slotLabel || "—"} />
                    <Row label="Duration" value={hours >= 8 ? `Full day × ${dayCount}` : `${hours}h × ${dayCount} ${dayCount === 1 ? "day" : "days"}`} />
                    <div className="border-t border-border pt-3 flex justify-between items-baseline">
                      <span className="text-navy font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">{price} ILS</span>
                    </div>
                    <p className="text-xs text-muted-foreground">No hidden fees. Taxes included.</p>
                  </dl>
                </div>

                {!user && (
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h2 className="text-lg font-bold text-navy mb-1">Your details</h2>
                    <p className="text-xs text-muted-foreground mb-4">We'll send your confirmation here. No account required.</p>
                    <Label htmlFor="email" className="text-navy">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold text-navy mb-4">Payment method</h2>
                  <div className="rounded-lg border-2 border-primary bg-primary-tint p-4 flex items-start gap-3">
                    <Banknote className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-navy">Cash — Pay on-site</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Pay within 3 days of your booking date at the front desk.
                      </div>
                    </div>
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div className="mt-4 rounded-lg bg-amber/10 border border-amber/30 p-3 text-sm" style={{ background: "color-mix(in oklab, var(--amber) 10%, transparent)", borderColor: "color-mix(in oklab, var(--amber) 35%, transparent)" }}>
                    <p className="font-semibold text-navy">Payment deadline: {deadlineStr}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You must pay on-site by this date — 3 days after your earliest booked day. Unpaid bookings will be automatically cancelled. We'll send a reminder 24 hours before the deadline.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Free cancellation any time before payment — no penalty.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Summary sidebar */}
          <aside>
            <div className="rounded-xl border border-border bg-card p-5 sticky top-24">
              <div className="flex gap-3">
                <img src={item.image} alt={item.name} className="h-16 w-20 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-navy truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.location}</div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span className="text-navy">{item.pricePerHour} ILS/hr</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Days</span><span className="text-navy">{dayCount || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hours / day</span><span className="text-navy">{hours || "—"}</span></div>
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span className="text-navy">Total</span><span className="text-primary">{price} ILS</span>
                </div>
              </div>
              {step === 1 ? (
                <Button
                  className="w-full h-11 mt-4 bg-primary hover:bg-primary/90"
                  disabled={dayCount === 0 || hours === 0}
                  onClick={() => setStep(2)}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  className="w-full h-11 mt-4 bg-success hover:bg-success/90"
                  disabled={!email}
                  onClick={confirm}
                >
                  Confirm Booking
                </Button>
              )}
              <p className="mt-3 text-xs text-muted-foreground text-center">
                Free cancellation up to 2 hours before start.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-navy font-medium">{value}</dd>
    </div>
  );
}
