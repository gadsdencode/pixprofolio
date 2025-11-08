import { Link, useLocation } from "wouter";
import { Camera, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 font-serif text-2xl font-medium hover-elevate active-elevate-2 px-2 py-1 rounded-md cursor-pointer" data-testid="link-home">
                <Camera className="w-6 h-6" />
                <span>Alex Rivera</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`px-4 py-2 rounded-md transition-colors hover-elevate active-elevate-2 cursor-pointer ${
                      location === link.href
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    }`}
                    data-testid={`link-nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div
                      className={`block px-4 py-2 rounded-md hover-elevate active-elevate-2 cursor-pointer ${
                        location === link.href
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid={`link-mobile-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </div>
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Alex Rivera Photography. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover-elevate active-elevate-2 px-2 py-1 rounded-md"
                data-testid="link-instagram"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover-elevate active-elevate-2 px-2 py-1 rounded-md"
                data-testid="link-facebook"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover-elevate active-elevate-2 px-2 py-1 rounded-md"
                data-testid="link-twitter"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
