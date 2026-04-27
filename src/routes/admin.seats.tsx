import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LocationToggle, StatusBadge, ZoneBadge } from "@/components/multaqa/LocationToggle";
import { Button } from "@/components/ui/button";
import { desks as initial, type Location, type Status } from "@/lib/multaqa/data";
import { Plus, Wrench } from "lucide-react";

export const Route = createFileRoute("/admin/seats")({ component: Seats });

function Seats() {
  const [loc, setLoc] = useState<Location>("Nablus");
  const [list, setList] = useState(initial);
  const filtered = list.filter((d) => d.location === loc);

  const toggleMaint = (id: string) => {
    setList(list.map((d) => d.id === id ? { ...d, status: (d.status === "Maintenance" ? "Available" : "Maintenance") as Status } : d));
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Seat Management</h1>
          <p className="text-sm text-muted-foreground">Block desks, set admin-only, edit details.</p>
        </div>
        <div className="flex gap-2">
          <LocationToggle value={loc} onChange={setLoc} />
          <Button className="bg-primary hover:bg-primary/90"><Plus className="mr-1 h-4 w-4" />Add New Desk</Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr><th className="text-left p-3">Desk</th><th className="text-left p-3">Type</th><th className="text-left p-3">Zone</th><th className="text-left p-3">Status</th><th className="text-right p-3">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="border-t border-border">
                <td className="p-3 font-semibold text-navy">{d.name}</td>
                <td className="p-3">{d.type}</td>
                <td className="p-3"><ZoneBadge zone={d.zone} /></td>
                <td className="p-3"><StatusBadge status={d.status} /></td>
                <td className="p-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="sm" variant={d.status === "Maintenance" ? "default" : "outline"} className="h-7 text-xs" onClick={() => toggleMaint(d.id)}>
                      <Wrench className="mr-1 h-3 w-3" />{d.status === "Maintenance" ? "Unblock" : "Block"}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">Admin-Only</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">Edit</Button>
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
