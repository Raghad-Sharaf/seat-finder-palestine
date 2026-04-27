import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bookings } from "@/lib/multaqa/data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/admin/bookings")({ component: AdminBookings });

function AdminBookings() {
  const [q, setQ] = useState("");
  const filtered = bookings.filter((b) => `${b.user} ${b.ref}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">All Bookings</h1>
      <div className="mt-4 flex gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by user or booking ID..." className="pl-9" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left p-3">Ref</th>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Item</th>
              <th className="text-left p-3">Location</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Payment</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="p-3 font-mono text-xs text-navy">{b.ref}</td>
                <td className="p-3 text-navy">{b.user}</td>
                <td className="p-3">{b.itemName}</td>
                <td className="p-3">{b.location}</td>
                <td className="p-3 text-muted-foreground">{b.date}</td>
                <td className="p-3">
                  {b.paymentStatus === "Paid"
                    ? <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Paid</span>
                    : <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "color-mix(in oklab, var(--amber) 12%, transparent)", color: "var(--amber)" }}>Cash Due</span>}
                </td>
                <td className="p-3 text-xs">{b.bookingStatus}</td>
                <td className="p-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 text-xs">View</Button>
                    {b.paymentStatus === "Cash Due" && <Button size="sm" className="h-7 text-xs bg-success hover:bg-success/90">Mark Paid</Button>}
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
