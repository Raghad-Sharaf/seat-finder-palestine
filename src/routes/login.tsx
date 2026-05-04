import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/multaqa/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/multaqa/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Multaqa" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "",
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("khalid@example.com");
  const [password, setPassword] = useState("demo");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    if (email.toLowerCase().includes("admin")) {
      navigate({ to: "/admin" });
    } else if (search.redirect) {
      // Honor redirect-back so users land on the page they came from
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
        {search.redirect && (
          <div className="mb-4 rounded-lg border border-primary/30 bg-primary-tint px-4 py-3 text-sm text-navy">
            Please log in to complete your booking.
          </div>
        )}
        <div className="rounded-2xl bg-card border border-border p-7 shadow-sm">
          <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your bookings.</p>
          <form onSubmit={handle} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email" className="text-navy">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-navy">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
            </div>
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90">Sign In</Button>
          </form>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex-1 h-px bg-border" />OR<span className="flex-1 h-px bg-border" />
          </div>
          <Button variant="outline" className="w-full h-11 border-border">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign in with Google
          </Button>
          <p className="mt-5 text-sm text-center text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
        <p className="mt-4 text-xs text-center text-muted-foreground">
          You can also book without an account — just enter your email at checkout.
        </p>
        <p className="mt-2 text-xs text-center text-muted-foreground">
          Demo: use <code className="px-1 bg-muted rounded">admin@multaqa.ps</code> to access admin.
        </p>
        </div>
      </div>
    </div>
  );
}
