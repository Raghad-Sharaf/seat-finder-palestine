import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/multaqa/auth";
import { bookings as initialBookings, type Booking } from "@/lib/multaqa/data";
import { Calendar, MapPin, Download, Edit, X, Banknote, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/my-bookings")({
  head: () => ({ meta: [{ title: "My Bookings — Multaqa" }] }),
  component: MyBookings,
});

function MyBookings() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"Upcoming" | "Past">("Upcoming");
  const [list, setList] = useState<Booking[]>(initialBookings);

  if (!user) return <Navigate to="/login" />;

  const filtered = list.filter((b) => (tab === "Upcoming" ? b.bookingStatus === "Upcoming" : b.bookingStatus !== "Upcoming"));

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-10 py-8">
        <h1 className="text-3xl font-bold text-navy">My Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your reservations.</p>

        <div className="mt-6 flex border-b border-border">
          {(["Upcoming", "Past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-navy"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-navy font-semibold">No bookings yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Find your perfect desk.</p>
            <Button asChild className="mt-4 bg-primary"><Link to="/desks">Browse Desks</Link></Button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {filtered.map((b) => (
              <div key={b.id} className="rounded-xl border border-border bg-card p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-navy">{b.itemName}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{b.itemType === "desk" ? "Desk" : "Room"}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{b.location}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{b.date} · {b.timeSlot}</span>
                    <span>{b.duration} · {b.total} ILS</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Ref: <span className="font-mono text-navy">{b.ref}</span></span>
                    {b.paymentStatus === "Paid" ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-semibold"><CheckCircle2 className="h-3 w-3" />Paid</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "color-mix(in oklab, var(--amber) 12%, transparent)", color: "var(--amber)" }}><Banknote className="h-3 w-3" />Cash Due by {b.paymentDeadline}</span>
                    )}
                    {b.bookingStatus === "Cancelled" && <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">Cancelled</span>}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 md:flex-col md:w-auto">
                  {tab === "Upcoming" ? (
                    <>
                      <Button asChild variant="outline" size="sm" className="border-navy/20 text-navy">
                        <Link to="/my-bookings/$bookingId/modify" params={{ bookingId: b.id }}><Edit className="mr-1 h-3.5 w-3.5" />Modify</Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <X className="mr-1 h-3.5 w-3.5" />Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                            <AlertDialogDescription>
                              You're about to cancel <span className="font-semibold text-navy">{b.itemName}</span> on {b.date} ({b.timeSlot}).
                              {b.paymentStatus === "Paid"
                                ? " A refund will be issued per our policy if eligible."
                                : " No payment is due since this booking is unpaid."}
                              {" "}This action can't be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep booking</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => {
                                setList((prev) => prev.map((x) => x.id === b.id ? { ...x, bookingStatus: "Cancelled" } : x));
                                toast.success("Booking cancelled", { description: `Ref ${b.ref}` });
                              }}
                            >
                              Yes, cancel
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    <Button variant="outline" size="sm"><Download className="mr-1 h-3.5 w-3.5" />Receipt</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
