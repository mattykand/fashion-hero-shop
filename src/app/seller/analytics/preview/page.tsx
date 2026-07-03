import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import {
  formatCount,
  formatPLN,
  formatPercent,
  formatSignedPercent,
  marginDeltaPercent,
  parseSellerParams,
  type RawSellerAnalyticsParams,
} from "@/lib/seller-analytics";
import { AnalyticsHeader } from "../_components/analytics-header";
import { MetricCard } from "./_components/metric-card";

export const metadata: Metadata = {
  title: "Analizuj dane · podgląd | FashionHero",
};

const CONCIERGE_FORM_URL = "https://forms.gle/placeholder";

interface PageProps {
  searchParams: Promise<RawSellerAnalyticsParams>;
}

export default async function SellerAnalyticsPreviewPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const { data, variant, isDemo } = parseSellerParams(raw);
  const marginDelta = marginDeltaPercent(data.netMargin, data.catMedianMargin);
  const isBelowMedian = marginDelta < 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AnalyticsHeader pageLabel="Analizuj dane · podgląd" />

      <main className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Cześć, {data.name}</h1>
          {isDemo && (
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold tracking-wide text-gray-600">
              DANE PRZYKŁADOWE
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">{data.shopName}</p>

        {variant === "A" ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Marża netto"
              value={formatPLN(data.netMargin)}
              hint="na zamówienie"
            />
            <MetricCard
              label="GMV"
              value={formatPLN(data.gmv)}
              hint="łączna wartość sprzedaży"
            />
            <MetricCard
              label="Zamówienia"
              value={formatCount(data.orders)}
              hint="w tym okresie"
            />
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Marża netto / zamówienie
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatPLN(data.netMargin)}
              </p>
              <p
                className={cn(
                  "mt-2 text-sm font-medium",
                  isBelowMedian ? "text-red-600" : "text-emerald-600"
                )}
              >
                {formatSignedPercent(marginDelta)} vs mediana{" "}
                {formatPLN(data.catMedianMargin)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Zwroty
              </p>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                {formatPercent(data.returnRate)}{" "}
                <span className="font-normal text-gray-400">
                  vs {formatPercent(data.catMedianReturn)} w kategorii
                </span>
              </p>
            </div>

            <a
              href={CONCIERGE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              Chcę indywidualną analizę marży →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
