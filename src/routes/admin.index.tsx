import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LocationToggle } from "@/components/multaqa/LocationToggle";
import { bookings, type Location } from "@/lib/multaqa/data";
import { CalendarDays, Users, Banknote, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [loc, setLoc] = useState<Location>("Nablus");
  const filtered = bookings.filter((b) => b.location === loc);
  const unpaid = filtered.filter((b) => b.paymentStatus === "Cash Due" && b.bookingStatus === "Upcoming").length;

  const stats = [
    { label: "Bookings today", value: 14, icon: CalendarDays, tint: "bg-primary-tint text-primary" },
    { label: "Seats occupied now", value: "12 / 30", icon: Users, tint: "bg-navy-tint text-navy" },
    { label: "Unpaid cash bookings", value: unpaid, icon: Banknote, tint: unpaid > 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success" },
    { label: "Revenue this week", value: "3,240 ILS", icon: TrendingUp, tint: "bg-success/10 text-success" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Overview</h1>
          <p className="text-sm text-muted-foreground">What's happening today.</p>
        </div>
        <LocationToggle value={loc} onChange={setLoc} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.tint}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 text-2xl font-bold text-navy">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="font-bold text-navy">Recent bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Item</th>
                <th className="text-left p-3">Date / Time</th>
                <th className="text-left p-3">Payment</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 10).map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="font-semibold text-navy">{b.user}</div>
                    <div className="text-xs text-muted-foreground">{b.email}</div>
                  </td>
                  <td className="p-3 text-navy">{b.itemName}</td>
                  <td className="p-3 text-muted-foreground">{b.date} · {b.timeSlot}</td>
                  <td className="p-3">
                    {b.paymentStatus === "Paid" ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-semibold">Paid</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "color-mix(in oklab, var(--amber) 12%, transparent)", color: "var(--amber)" }}>Cash Due</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-semibold text-navy">{b.total} ILS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
