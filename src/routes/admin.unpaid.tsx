import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { bookings as initial } from "@/lib/multaqa/data";
import { Bell, Check } from "lucide-react";

export const Route = createFileRoute("/admin/unpaid")({ component: Unpaid });

function Unpaid() {
  const [list, setList] = useState(initial.filter((b) => b.paymentStatus === "Cash Due" && b.bookingStatus === "Upcoming"));
  const today = new Date();
  const withDays = list.map((b) => {
    const d = new Date(b.paymentDeadline);
    const days = Math.ceil((d.getTime() - today.getTime()) / 86400000);
    return { ...b, days };
  }).sort((a, b) => a.days - b.days);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Unpaid Cash Bookings</h1>
      <p className="text-sm text-muted-foreground mt-1">Sorted by most urgent.</p>
      <div className="mt-6 rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Item</th>
              <th className="text-left p-3">Booking date</th>
              <th className="text-left p-3">Pay by</th>
              <th className="text-left p-3">Days left</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withDays.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">All cash bookings are settled. 🎉</td></tr>
            ) : withDays.map((b) => (
              <tr key={b.id} className={`border-t border-border ${b.days < 0 ? "bg-destructive/5" : ""}`}>
                <td className="p-3"><div className="font-semibold text-navy">{b.user}</div><div className="text-xs text-muted-foreground">{b.email}</div></td>
                <td className="p-3">{b.itemName}</td>
                <td className="p-3 text-muted-foreground">{b.date}</td>
                <td className="p-3 font-semibold" style={{ color: b.days < 0 ? "var(--destructive)" : "var(--amber)" }}>{b.paymentDeadline}</td>
                <td className="p-3">
                  {b.days < 0
                    ? <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">Overdue {Math.abs(b.days)}d</span>
                    : <span className="text-xs font-semibold text-navy">{b.days} days</span>}
                </td>
                <td className="p-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs"><Bell className="mr-1 h-3 w-3" />Remind</Button>
                    <Button size="sm" className="h-7 text-xs bg-success hover:bg-success/90" onClick={() => setList(list.filter((x) => x.id !== b.id))}><Check className="mr-1 h-3 w-3" />Mark Paid</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
