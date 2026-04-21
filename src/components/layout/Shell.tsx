import React, { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function NavLinks({ onClick }: { onClick?: () => void }) {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/ink", label: "Ink Starboard" },
    { href: "/kraken", label: "Kraken Map" },
    { href: "/briefs", label: "Briefs" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <>
      {links.map((link) => {
        const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={`text-lg font-serif px-3 py-1 transition-colors border-b-2 ${
              isActive
                ? "text-primary border-primary"
                : "text-foreground/80 border-transparent hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Anchor className="h-6 w-6 text-primary" />
            <Link href="/" className="font-serif font-bold text-xl italic tracking-tight text-foreground">
              Kraken Watch
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l border-border flex flex-col gap-6 pt-12">
              <NavLinks />
            </SheetContent>
          </Sheet>
        </div>
        {/* Decorative divider */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </header>

      <main className="flex-1 w-full container max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="w-full border-t border-border/50 bg-background/50 py-8 mt-auto">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
          <Anchor className="h-4 w-4 text-muted-foreground/50" />
          <p className="text-sm font-serif text-muted-foreground italic">
            A cartographer's logbook for the Kraken / Ink ecosystem.
          </p>
        </div>
      </footer>
    </div>
  );
}
