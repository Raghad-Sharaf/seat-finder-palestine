import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { desks, rooms } from "@/lib/multaqa/data";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/create-booking")({ component: CreateBooking });

function CreateBooking() {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-navy">Create Booking on Behalf of User</h1>
      <p className="text-sm text-muted-foreground mt-1">Useful for walk-ins or phone bookings.</p>

      {done ? (
        <div className="mt-6 rounded-xl border border-success/30 bg-success/5 p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <p className="mt-3 font-semibold text-navy">Booking created.</p>
          <p className="text-sm text-muted-foreground">Confirmation email sent to {email}.</p>
          <Button className="mt-4" variant="outline" onClick={() => setDone(false)}>Create another</Button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="mt-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label className="text-navy">User name</Label><Input placeholder="Khalid Mansour" required className="mt-1" /></div>
            <div><Label className="text-navy">User email</Label><Input type="email" placeholder="khalid@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" /></div>
          </div>
          <div><Label className="text-navy">Desk or Room</Label>
            <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <optgroup label="Desks">{desks.map((d) => <option key={d.id}>{d.name} — {d.location}</option>)}</optgroup>
              <optgroup label="Rooms">{rooms.map((r) => <option key={r.id}>{r.name} — {r.location}</option>)}</optgroup>
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label className="text-navy">Date</Label><Input type="date" className="mt-1" required /></div>
            <div><Label className="text-navy">Time slot</Label>
              <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option>09:00 – 13:00 (Half-day)</option><option>14:00 – 18:00 (Half-day)</option><option>09:00 – 18:00 (Full day)</option>
              </select>
            </div>
          </div>
          <div><Label className="text-navy">Payment method</Label>
            <select className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option>Cash — pay on-site</option><option>Already paid</option>
            </select>
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary/90">Create Booking</Button>
        </form>
      )}
    </div>
  );
}
