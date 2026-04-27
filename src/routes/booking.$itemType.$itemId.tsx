import { createFileRoute, Link, useParams, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDesk, getRoom } from "@/lib/multaqa/data";
import { useAuth } from "@/lib/multaqa/auth";
import { Check, Info, Banknote, Calendar as CalendarIcon, Clock, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/booking/$itemType/$itemId")({
  component: BookingFlow,
});

const SLOTS = [
  { label: "08:00 – 09:00", time: 8 },
  { label: "09:00 – 10:00", time: 9 },
  { label: "10:00 – 11:00", time: 10 },
  { label: "11:00 – 12:00", time: 11 },
  { label: "12:00 – 13:00", time: 12 },
  { label: "13:00 – 14:00", time: 13 },
  { label: "14:00 – 15:00", time: 14 },
  { label: "15:00 – 16:00", time: 15 },
  { label: "16:00 – 17:00", time: 16 },
  { label: "17:00 – 18:00", time: 17 },
];

const DURATIONS = ["1 hour", "Half-day", "Full day"] as const;
type Duration = (typeof DURATIONS)[number];

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
  const [date, setDate] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [duration, setDuration] = useState<Duration>("1 hour");
  const [email, setEmail] = useState(user?.email ?? "");
  const [conflictError, setConflictError] = useState<string | null>(null);

  const isDesk = params.itemType === "desk";
  const desk = isDesk ? (item as ReturnType<typeof getDesk>)! : null;
  const room = !isDesk ? (item as ReturnType<typeof getRoom>)! : null;

  const price =
    duration === "1 hour"
      ? item.pricePerHour
      : duration === "Half-day"
      ? (desk?.priceHalfDay ?? room?.priceHalfDay ?? 0)
      : (desk?.priceFullDay ?? (room?.priceHalfDay ?? 0) * 2);

  // generate next 14 days
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const isToday = date === today.toDateString();
  const currentHour = today.getHours();

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 3);
  const deadlineStr = deadline.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });

  const confirm = () => {
    // Simulate a concurrent-booking race ~12% of the time
    if (Math.random() < 0.12) {
      setConflictError("This slot was just booked. Please select a different time.");
      setStep(1);
      setSlot("");
      return;
    }
    const ref = "MQR-" + Math.floor(20000 + Math.random() * 9999);
    navigate({
      to: "/booking/confirmation",
      search: {
        ref,
        name: item.name,
        location: item.location,
        date: date || "Today",
        slot: slot || "09:00 – 13:00",
        duration,
        total: price,
        email,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
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
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
                    <CalendarIcon className="h-5 w-5 text-primary" /> Pick a date
                  </h2>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dates.map((d) => {
                      const key = d.toDateString();
                      const sel = date === key;
                      return (
                        <button
                          key={key}
                          onClick={() => { setDate(key); setSlot(""); }}
                          className={`flex flex-col items-center min-w-[64px] p-3 rounded-lg border transition-colors ${
                            sel ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary text-navy"
                          }`}
                        >
                          <span className="text-xs uppercase">{d.toLocaleDateString("en", { weekday: "short" })}</span>
                          <span className="text-xl font-bold">{d.getDate()}</span>
                          <span className="text-xs">{d.toLocaleDateString("en", { month: "short" })}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" /> Pick a time slot
                  </h2>
                  <div className="flex gap-2 mb-4">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                          duration === d ? "bg-navy border-navy text-navy-foreground" : "border-border text-muted-foreground hover:border-navy"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SLOTS.map((s) => {
                      const past = isToday && s.time <= currentHour;
                      const unavailable = s.time === 12 || s.time === 15; // simulate
                      const disabled = past || unavailable;
                      const sel = slot === s.label;
                      return (
                        <button
                          key={s.label}
                          disabled={disabled}
                          onClick={() => setSlot(s.label)}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            disabled
                              ? "bg-muted/50 border-border text-muted-foreground/50 cursor-not-allowed line-through"
                              : sel
                              ? "bg-success border-success text-success-foreground"
                              : "border-border text-navy hover:border-primary"
                          }`}
                        >
                          {s.label}
                          {isToday && !disabled && (
                            <div className="text-[10px] font-normal mt-0.5 opacity-80">{18 - s.time}h until closing</div>
                          )}
                        </button>
                      );
                    })}
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
                    <Row label="Date" value={date || "Today"} />
                    <Row label="Time" value={slot || "Pick a slot"} />
                    <Row label="Duration" value={duration} />
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
                      You must pay on-site by this date. Unpaid bookings will be automatically cancelled. We'll send a reminder 24 hours before the deadline.
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
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-navy">{duration}</span></div>
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span className="text-navy">Total</span><span className="text-primary">{price} ILS</span>
                </div>
              </div>
              {step === 1 ? (
                <Button
                  className="w-full h-11 mt-4 bg-primary hover:bg-primary/90"
                  disabled={!date || !slot}
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
