"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/discover", label: "Discover" },
  { href: "/map", label: "Map" },
  { href: "/events", label: "Events" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bembe-sand/90 backdrop-blur-md border-b border-bembe-night/5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-bembe-gold">
          Bembe
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-bembe-night/70 transition-colors hover:text-bembe-teal"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop login */}
        <Link
          href="/login"
          className="hidden rounded-full bg-bembe-teal px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-bembe-teal/90 md:inline-flex"
        >
          Log In
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-bembe-night md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-bembe-night/5 bg-bembe-sand px-4 pb-4 pt-2 md:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-bembe-night/80 transition-colors hover:bg-bembe-teal/10 hover:text-bembe-teal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-1 block rounded-full bg-bembe-teal px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-bembe-teal/90"
              >
                Log In
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
