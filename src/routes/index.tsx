import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { Button } from "@/components/ui/button";
import { Search, Calendar, CheckCircle2, ShieldCheck, Camera, Tag, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-coworking.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Multaqa — Your seat. Secured." },
      { name: "description", content: "Browse and book coworking desks and rooms in Nablus and Ramallah. Reserve your spot in advance — confirmed before you arrive." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-tint via-background to-primary-tint">
          <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-tint border border-primary/20 px-3 py-1 text-xs font-medium text-primary mb-6">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Live availability across Nablus & Ramallah
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-navy leading-[1.05] tracking-tight">
                Your seat.<br />
                <span className="text-primary">Secured.</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-md">
                Browse real desks and rooms, check live availability, and lock in your spot before you leave home. No more walk-in surprises.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 h-12 px-6 text-base">
                  <Link to="/desks">Browse Desks <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base border-navy text-navy hover:bg-navy hover:text-navy-foreground">
                  <Link to="/rooms">Browse Rooms</Link>
                </Button>
              </div>
              <div className="mt-8 inline-flex items-center gap-3 rounded-lg bg-card border border-border px-4 py-3 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy">18 of 30 seats available right now</div>
                  <div className="text-xs text-muted-foreground">at Multaqa Nablus · updated just now</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 rounded-3xl rotate-2" />
              <img
                src={heroImg}
                alt="Bright modern coworking space at Multaqa with desks, plants and large windows"
                width={1600}
                height={1024}
                className="relative rounded-2xl shadow-2xl object-cover w-full aspect-[4/3]"
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy">How Multaqa works</h2>
            <p className="mt-3 text-muted-foreground">Three simple steps. Done in under a minute.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Search, title: "Browse", desc: "See real desks and rooms with photos, amenities, and live availability." },
              { icon: Calendar, title: "Book", desc: "Pick your date and slot. Pay online or settle in cash on arrival." },
              { icon: CheckCircle2, title: "Arrive", desc: "Walk in with confidence. Your seat is reserved and waiting." },
            ].map((s, i) => (
              <div key={s.title} className="rounded-xl border border-border bg-card p-6 hover:border-primary hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-tint text-primary flex items-center justify-center">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">STEP {i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section className="bg-navy-tint py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy">Verified. Real. Transparent.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: ShieldCheck, title: "Verified spaces", desc: "Every location is inspected and reviewed." },
                { icon: Camera, title: "Real photos", desc: "What you see is what you get. No stock images." },
                { icon: Tag, title: "Transparent pricing", desc: "Prices in ILS. No surprises. No hidden fees." },
              ].map((t) => (
                <div key={t.title} className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
                    <t.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-navy">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy">Ready to find your seat?</h2>
          <p className="mt-3 text-muted-foreground">Browse without an account. Book in under a minute.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90"><Link to="/desks">Browse Desks</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-navy text-navy hover:bg-navy hover:text-navy-foreground"><Link to="/rooms">Browse Rooms</Link></Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
