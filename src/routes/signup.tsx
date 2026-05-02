import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { SiteFooter } from "@/components/multaqa/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Multaqa" }] }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-navy-tint to-primary-tint">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-card border border-border p-7 shadow-sm">
          <h1 className="text-2xl font-bold text-navy">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Save your bookings and access faster checkout.</p>
          <form className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email" className="text-navy">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="pw" className="text-navy">Password</Label>
              <Input id="pw" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="pw2" className="text-navy">Confirm password</Label>
              <Input id="pw2" type="password" className="mt-1" />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="terms" className="mt-1" />
              <Label htmlFor="terms" className="text-xs text-muted-foreground font-normal leading-relaxed">
                I agree to Multaqa's <a href="#" className="text-primary hover:underline">Terms</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </Label>
            </div>
            <Button type="button" className="w-full h-11 bg-primary hover:bg-primary/90">Create account</Button>
          </form>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex-1 h-px bg-border" />OR<span className="flex-1 h-px bg-border" />
          </div>
          <Button variant="outline" className="w-full h-11">Sign up with Google</Button>
          <p className="mt-5 text-sm text-center text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
