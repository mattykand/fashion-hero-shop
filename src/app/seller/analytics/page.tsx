import type { Metadata } from "next";
import { AnalyticsHeader } from "./_components/analytics-header";
import { PreviewMetricCard } from "./_components/preview-metric-card";
import { NotifyForm } from "./_components/notify-form";

export const metadata: Metadata = {
  title: "Analizuj dane | FashionHero",
  description: "Zobacz swoją marżę netto na tle mediany kategorii.",
};

const PREVIEW_CARDS = [
  {
    label: "Marża netto / zamówienie",
    value: "412 PLN",
    hint: "vs. mediana kategorii",
  },
  {
    label: "Return rate",
    value: "21,2%",
    hint: "vs. 18,4% w kategorii",
  },
  {
    label: "Ranking w kategorii",
    value: "Top 30%",
    hint: "wśród sprzedawców w Twojej kategorii",
  },
] as const;

export default function SellerAnalyticsLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AnalyticsHeader pageLabel="Analizuj dane" />

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground">
          WKRÓTCE
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Twoja marża vs. mediana kategorii. W jednym widoku.
        </h1>

        <p className="mt-4 max-w-xl text-gray-500">
          Zobacz swoją marżę netto i zwroty na tle innych sprzedawców w Twojej
          kategorii — zanim podejmiesz kolejną decyzję cenową.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PREVIEW_CARDS.map((card) => (
            <PreviewMetricCard key={card.label} {...card} />
          ))}
        </div>

        <div className="mt-12 max-w-md rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-gray-900">
            Powiadom mnie, gdy ruszy
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Zostaw email — odezwiemy się, gdy panel będzie gotowy.
          </p>
          <div className="mt-4">
            <NotifyForm />
          </div>
        </div>

        <p className="mt-4 max-w-md text-xs text-gray-400">
          To wczesny podgląd. Twój zapis wpływa na decyzję o budowie.
        </p>
      </main>
    </div>
  );
}
