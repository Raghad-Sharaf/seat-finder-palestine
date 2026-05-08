import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/multaqa/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Multaqa" }] }),
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof s.redirect === "string" && s.redirect ? s.redirect : undefined,
  }),
  component: SignupPage,
});

function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email);
    toast.success("Account created", { description: "Welcome to Multaqa!" });
    if (search.redirect) {
      window.location.href = search.redirect;
    } else {
      navigate({ to: "/my-bookings" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-navy-tint to-primary-tint">
      <SiteHeader />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
        <div className="rounded-2xl bg-card border border-border p-7 shadow-sm">
          <h1 className="text-2xl font-bold text-navy">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Save your bookings and access faster checkout.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-navy">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="pw" className="text-navy">Password</Label>
              <Input id="pw" type="password" className="mt-1" required />
            </div>
            <div>
              <Label htmlFor="pw2" className="text-navy">Confirm password</Label>
              <Input id="pw2" type="password" className="mt-1" required />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="terms" className="mt-1" />
              <Label htmlFor="terms" className="text-xs text-muted-foreground font-normal leading-relaxed">
                I agree to Multaqa's <a href="#" className="text-primary hover:underline">Terms</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </Label>
            </div>
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">Create account</Button>
          </form>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex-1 h-px bg-border" />OR<span className="flex-1 h-px bg-border" />
          </div>
          <Button variant="outline" className="w-full h-11">Sign up with Google</Button>
          <p className="mt-5 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              search={search.redirect ? { redirect: search.redirect } : undefined}
              className="text-primary font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
