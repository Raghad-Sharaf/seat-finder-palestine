import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-navy-tint">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 grid gap-8 md:grid-cols-3 md:[&>*]:min-w-0">
        <div className="flex flex-col">
          <Logo className="-ml-2 [&_img]:!h-[76px] [&_img]:md:!h-[76px]" />
          <div className="h-3" aria-hidden />
          <p className="text-sm text-muted-foreground max-w-xs">
            Your seat. Secured. Browse and book coworking spaces across Palestine.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-navy mb-3">Locations</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Nablus — Building Al-Maseef, Floor 3</li>
            <li>Ramallah — Al-Bireh Commercial Center, Floor 2</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-navy mb-3">Contact</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>hello@multaqa.ps</li>
            <li>+970 59 000 0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 Multaqa. Made for Palestine.
      </div>
    </footer>
  );
}