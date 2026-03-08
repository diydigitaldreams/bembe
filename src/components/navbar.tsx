"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/language-toggle";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  const navLinks = [
    { href: "/discover", label: t.nav.discover },
    { href: "/map", label: t.nav.map },
    { href: "/events", label: t.nav.events },
    { href: "/messages", label: t.nav.messages },
  ];

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

        {/* Desktop login + language toggle */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/messages"
            className="rounded-lg p-2 text-bembe-night/60 transition-colors hover:text-bembe-teal hover:bg-bembe-teal/10"
            aria-label={t.nav.messages}
          >
            <MessageCircle className="h-5 w-5" />
          </Link>
          <LanguageToggle />
          <Link
            href="/login"
            className="rounded-full bg-bembe-teal px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-bembe-teal/90"
          >
            {t.nav.login}
          </Link>
        </div>

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
                {t.nav.login}
              </Link>
            </li>
            <li className="flex justify-center pt-1">
              <LanguageToggle />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
