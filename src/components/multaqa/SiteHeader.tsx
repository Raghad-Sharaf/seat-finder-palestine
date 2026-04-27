import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/multaqa/auth";
import { Menu, User, LogOut } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navLink = "text-sm font-medium text-navy/80 hover:text-primary transition-colors";
const activeNav = { className: "text-primary" };

export function SiteHeader() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/desks" className={navLink} activeProps={activeNav}>Browse Desks</Link>
          <Link to="/rooms" className={navLink} activeProps={activeNav}>Browse Rooms</Link>
          <Link to="/whos-here" className={navLink} activeProps={activeNav}>Who's Here Today</Link>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-navy/20 text-navy">
                  <div className="h-6 w-6 rounded-full bg-navy text-navy-foreground text-xs flex items-center justify-center font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  {user.name.split(" ")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/my-bookings"><User className="mr-2 h-4 w-4" />My Bookings</Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-navy">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        <button className="md:hidden p-2 text-navy" onClick={() => setOpen(!open)} aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-2">
          <Link to="/desks" className="block py-2 text-navy" onClick={() => setOpen(false)}>Browse Desks</Link>
          <Link to="/rooms" className="block py-2 text-navy" onClick={() => setOpen(false)}>Browse Rooms</Link>
          <Link to="/whos-here" className="block py-2 text-navy" onClick={() => setOpen(false)}>Who's Here Today</Link>
          {user ? (
            <>
              <Link to="/my-bookings" className="block py-2 text-navy" onClick={() => setOpen(false)}>My Bookings</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="block py-2 text-navy">Sign out</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" className="flex-1"><Link to="/login">Log In</Link></Button>
              <Button asChild className="flex-1 bg-primary"><Link to="/signup">Sign Up</Link></Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}