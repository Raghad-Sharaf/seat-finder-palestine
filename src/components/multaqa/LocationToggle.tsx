import type { Location } from "@/lib/multaqa/data";
import { MapPin } from "lucide-react";

export function LocationToggle({
  value,
  onChange,
}: {
  value: Location;
  onChange: (l: Location) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-card p-1">
      <MapPin className="ml-2 mr-1 h-4 w-4 text-muted-foreground" />
      {(["Nablus", "Ramallah"] as const).map((loc) => (
        <button
          key={loc}
          onClick={() => onChange(loc)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            value === loc ? "bg-navy text-navy-foreground" : "text-muted-foreground hover:text-navy"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: "Available" | "Reserved" | "Maintenance" }) {
  const styles = {
    Available: "bg-success/10 text-success border-success/20",
    Reserved: "bg-destructive/10 text-destructive border-destructive/20",
    Maintenance: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${styles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function ZoneBadge({ zone }: { zone: "Deep Work" | "Calls Allowed" }) {
  const isDeep = zone === "Deep Work";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        isDeep ? "bg-navy text-navy-foreground" : "bg-primary text-primary-foreground"
      }`}
    >
      {zone}
    </span>
  );
}