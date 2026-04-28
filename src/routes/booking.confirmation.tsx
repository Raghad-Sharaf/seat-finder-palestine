import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Calendar, Clock, MapPin, Banknote } from "lucide-react";
import { useAuth } from "@/lib/multaqa/auth";

interface Search {
  ref: string;
  name: string;
  location: string;
  date: string;
  slot: string;
  duration: string;
  total: number;
  email: string;
  deadline: string;
}

export const Route = createFileRoute("/booking/confirmation")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ref: String(s.ref ?? "MQR-20491"),
    name: String(s.name ?? "Window Seat A-3"),
    location: String(s.location ?? "Nablus"),
    date: String(s.date ?? "Today"),
    slot: String(s.slot ?? "09:00 – 13:00"),
    duration: String(s.duration ?? "Half-day"),
    total: Number(s.total ?? 50),
    email: String(s.email ?? "you@example.com"),
    deadline: String(s.deadline ?? ""),
  }),
  component: Confirmation,
});

function Confirmation() {
  const s = Route.useSearch();
  const { user } = useAuth();

  // Cash deadline = earliest booked date + 3 days, computed at booking time and passed in
  const deadlineStr = s.deadline || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
  })();

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-navy">You're all set!</h1>
          <p className="mt-2 text-muted-foreground">Your seat is confirmed and waiting.</p>

          <div className="mt-6 inline-block rounded-lg bg-primary-tint border border-primary/20 px-4 py-2">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Booking Reference</div>
            <div className="text-2xl font-bold text-primary tracking-wider">{s.ref}</div>
          </div>

          <div className="mt-8 text-left rounded-xl border border-border bg-muted/30 p-5 space-y-3 text-sm">
            <Detail icon={MapPin} label={s.name} value={s.location} />
            <Detail icon={Calendar} label="Date" value={s.date} />
            <Detail icon={Clock} label="Time" value={`${s.slot} · ${s.duration}`} />
            <Detail icon={Banknote} label="Total" value={`${s.total} ILS`} />
            <div className="rounded-lg bg-amber/10 border border-amber/30 p-3 mt-2" style={{ background: "color-mix(in oklab, var(--amber) 12%, transparent)", borderColor: "color-mix(in oklab, var(--amber) 40%, transparent)" }}>
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--amber)" }}>
                <Banknote className="h-4 w-4" />
                <span className="font-semibold">Cash — due on-site by {deadlineStr}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            A confirmation email has been sent to <span className="font-semibold text-navy">{s.email}</span>
          </div>

          {!user && (
            <div className="mt-6 rounded-lg bg-navy-tint border border-navy/10 p-4">
              <p className="text-sm text-navy">Save your booking history — create a free account.</p>
              <Button asChild variant="outline" className="mt-3 border-navy text-navy">
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90"><Link to="/desks">Browse More Desks</Link></Button>
            <Button asChild variant="outline"><Link to="/">Back to Home</Link></Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-primary mt-0.5" />
      <div className="flex-1 flex justify-between gap-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-navy font-semibold text-right">{value}</span>
      </div>
    </div>
  );
}
