import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/multaqa-logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" aria-label="Multaqa — home" className={`flex items-center ${className}`}>
      <img
        src={logoImg}
        alt="Multaqa — Coworking & Booking"
        className="h-16 md:h-20 w-auto object-contain"
      />
    </Link>
  );
}