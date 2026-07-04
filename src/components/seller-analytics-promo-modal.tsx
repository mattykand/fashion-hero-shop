"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import posthog from "posthog-js";
import { X } from "lucide-react";

const REVEAL_DELAY_MS = 900;

// Illustrative teaser value only (same convention as the ranking card on
// /seller/analytics) — never a real visitor's number.
const TEASER_MARGIN = "412 PLN";

// Every real visit re-mounts this (fresh navigation from an outbound link),
// so it shows again each time — that's intentional for the AT1 outreach test.
export function SellerAnalyticsPromoModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/seller/analytics")) return;
    const timer = setTimeout(() => {
      setOpen(true);
      posthog.capture("promo_popup_shown", { page: pathname });
    }, REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  function dismiss(method: "later_button" | "close_button" | "backdrop" | "escape") {
    posthog.capture("promo_popup_dismissed", { method, page: pathname });
    setOpen(false);
  }

  function accept() {
    posthog.capture("promo_popup_accepted", { page: pathname });
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        posthog.capture("promo_popup_dismissed", { method: "escape", page: pathname });
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => dismiss("backdrop")} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        <div className="h-1.5 bg-primary" />

        <div className="p-8">
          <button
            type="button"
            onClick={() => dismiss("close_button")}
            aria-label="Zamknij"
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1.5 pr-3 pl-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              %
            </span>
            <span className="text-xs font-medium text-gray-500">
              Twoja marża netto:{" "}
              <span aria-hidden="true" className="font-semibold text-gray-900 blur-[3px] select-none">
                {TEASER_MARGIN}
              </span>
            </span>
          </div>

          <p className="mt-4 text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Pytamy wybranych sprzedawców
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            Znasz swój przychód. A swoją marżę?
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Widzisz, ile sprzedałaś. Nie zawsze widać, ile faktycznie zostaje
            po zwrotach i kosztach. Zobacz swoją marżę netto na tle mediany w
            Twojej kategorii.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => dismiss("later_button")}
              className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Może później
            </button>
            <Link
              href="/seller/analytics"
              onClick={accept}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Zobacz swoją marżę →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
