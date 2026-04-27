import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LocationToggle, StatusBadge } from "@/components/multaqa/LocationToggle";
import { Button } from "@/components/ui/button";
import { rooms, type Location } from "@/lib/multaqa/data";
import { Plus, Lock } from "lucide-react";

export const Route = createFileRoute("/admin/rooms")({ component: AdminRooms });

function AdminRooms() {
  const [loc, setLoc] = useState<Location>("Nablus");
  const filtered = rooms.filter((r) => r.location === loc);
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Room Management</h1>
          <p className="text-sm text-muted-foreground">Manage rooms and visibility.</p>
        </div>
        <div className="flex gap-2">
          <LocationToggle value={loc} onChange={setLoc} />
          <Button className="bg-primary hover:bg-primary/90"><Plus className="mr-1 h-4 w-4" />Add Room</Button>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr><th className="text-left p-3">Room</th><th className="text-left p-3">Type</th><th className="text-left p-3">Capacity</th><th className="text-left p-3">Status</th><th className="text-left p-3">Visibility</th><th className="text-right p-3">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3 font-semibold text-navy">{r.name}</td>
                <td className="p-3">{r.type}</td>
                <td className="p-3">{r.capacity}</td>
                <td className="p-3"><StatusBadge status={r.status} /></td>
                <td className="p-3">{r.adminOnly ? <span className="inline-flex items-center gap-1 text-xs text-navy"><Lock className="h-3 w-3" />Admin-Only</span> : <span className="text-xs text-muted-foreground">Public</span>}</td>
                <td className="p-3 text-right"><Button size="sm" variant="outline" className="h-7 text-xs">Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
