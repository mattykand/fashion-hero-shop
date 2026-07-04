"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";

const REVEAL_DELAY_MS = 900;

// Every real visit re-mounts this (fresh navigation from an outbound link),
// so it shows again each time — that's intentional for the AT1 outreach test.
export function SellerAnalyticsPromoModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/seller/analytics")) return;
    const timer = setTimeout(() => setOpen(true), REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Zamknij"
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>

        <p className="mt-5 text-xs font-semibold tracking-wide text-gray-400 uppercase">
          Nowość dla sprzedawców · Wkrótce
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          Sprawdź, czy Twoja marża się zgadza
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Zobacz marżę netto i return rate swoich produktów, porównane z
          medianą kategorii — zanim podejmiesz kolejną decyzję cenową.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Może później
          </button>
          <Link
            href="/seller/analytics"
            onClick={() => setOpen(false)}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sprawdź moją marżę
          </Link>
        </div>
      </div>
    </div>
  );
}
