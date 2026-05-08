import { createFileRoute, Link, Outlet, Navigate } from "@tanstack/react-router";
import { Logo } from "@/components/multaqa/Logo";
import { useAuth } from "@/lib/multaqa/auth";
import { LayoutDashboard, CalendarDays, Banknote, Armchair, DoorOpen, BarChart3, Plus, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Multaqa" }] }),
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "All Bookings", icon: CalendarDays, exact: false },
  { to: "/admin/unpaid", label: "Unpaid Cash", icon: Banknote, exact: false },
  { to: "/admin/seats", label: "Seat Management", icon: Armchair, exact: false },
  { to: "/admin/rooms", label: "Room Management", icon: DoorOpen, exact: false },
  { to: "/admin/create-booking", label: "Create Booking", icon: Plus, exact: false },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, exact: false },
] as const;

function AdminLayout() {
  const { user, logout } = useAuth();
  if (!user || user.role !== "admin") return <Navigate to="/login" />;

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden md:flex w-60 flex-col bg-card border-r border-border text-navy">
        <div className="p-5 border-b border-border">
          <Logo />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: it.exact }}
              activeProps={{ className: "bg-primary text-primary-foreground" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy/80 hover:bg-primary-tint hover:text-primary transition-colors"
            >
              <it.icon className="h-4 w-4" /> {it.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-navy/70 hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="md:hidden bg-card border-b border-border text-navy p-4 flex items-center justify-between">
          <Logo />
          <span className="text-xs">Admin</span>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
