"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  formatCount,
  formatPLN,
  formatPercent,
  formatSignedPercent,
  marginDeltaPercent,
} from "@/lib/seller-analytics";
import type { SellerAnalyticsData, SellerAnalyticsVariant } from "@/types/seller-analytics";

interface SellerAnalyticsExperienceProps {
  data: SellerAnalyticsData;
  variant: SellerAnalyticsVariant;
  isDemo: boolean;
}

// Shared transition for every blurred value — same timing so the whole
// card set reveals together instead of popping in piecemeal.
const REVEAL_TRANSITION = "transition-all duration-700 ease-out";

export function SellerAnalyticsExperience({
  data,
  variant,
  isDemo,
}: SellerAnalyticsExperienceProps) {
  // A personalized concierge link (real params in the URL) is already
  // addressed to one seller, so it reveals immediately — no email gate.
  const [revealed, setRevealed] = useState(!isDemo);
  const [ctaSubmitted, setCtaSubmitted] = useState(false);
  const [reactionText, setReactionText] = useState("");
  const [reactionSubmitted, setReactionSubmitted] = useState(false);

  const marginDelta = marginDeltaPercent(data.netMargin, data.catMedianMargin);
  const isBelowMedian = marginDelta < 0;

  function handleReactionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReactionSubmitted(true);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      {!revealed && (
        <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground">
          WKRÓTCE
        </span>
      )}

      <h1
        className={cn(
          "mt-4 font-bold tracking-tight text-gray-900",
          revealed ? "text-2xl" : "text-3xl sm:text-4xl"
        )}
      >
        {revealed ? <>Cześć, {data.name}</> : "Twoja marża vs. mediana kategorii. W jednym widoku."}
      </h1>

      {revealed && data.shopName && (
        <p className="mt-1 text-sm text-gray-500">{data.shopName}</p>
      )}

      {revealed && isDemo && (
        <span className="mt-3 inline-block rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold tracking-wide text-gray-600">
          DANE PRZYKŁADOWE
        </span>
      )}

      {!revealed && (
        <p className="mt-4 max-w-xl text-gray-500">
          Zobacz swoją marżę netto i zwroty na tle innych sprzedawców w Twojej
          kategorii — zanim podejmiesz kolejną decyzję cenową.
        </p>
      )}

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Marża netto / zamówienie
          </p>
          <p
            aria-hidden={!revealed}
            className={cn(
              "mt-2 text-3xl font-bold text-gray-900",
              REVEAL_TRANSITION,
              revealed ? "blur-none opacity-100" : "blur-sm opacity-60 select-none"
            )}
          >
            {formatPLN(data.netMargin)}
          </p>
          {variant === "B" && (
            <p
              aria-hidden={!revealed}
              className={cn(
                "mt-2 text-sm font-medium",
                REVEAL_TRANSITION,
                "delay-100",
                revealed
                  ? cn("blur-none opacity-100", isBelowMedian ? "text-red-600" : "text-emerald-600")
                  : "blur-sm opacity-60 select-none text-gray-900"
              )}
            >
              {formatSignedPercent(marginDelta)} vs mediana {formatPLN(data.catMedianMargin)}
            </p>
          )}
        </div>

        {variant === "A" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricBlock
              label="GMV"
              value={formatPLN(data.gmv)}
              hint="łączna wartość sprzedaży"
              revealed={revealed}
            />
            <MetricBlock
              label="Zamówienia"
              value={formatCount(data.orders)}
              hint="w tym okresie"
              revealed={revealed}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Zwroty</p>
              <p
                aria-hidden={!revealed}
                className={cn(
                  "mt-2 text-xl font-semibold text-gray-900",
                  REVEAL_TRANSITION,
                  revealed ? "blur-none opacity-100" : "blur-sm opacity-60 select-none"
                )}
              >
                {formatPercent(data.returnRate)}{" "}
                <span className="font-normal text-gray-400">
                  vs {formatPercent(data.catMedianReturn)} w kategorii
                </span>
              </p>
            </div>
            <RankingTeaserCard />
          </div>
        )}
      </div>

      {!revealed && (
        <div className="mt-8 max-w-md rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-gray-900">Zobacz swoją marżę</h2>
          <p className="mt-1 text-sm text-gray-500">
            Sprawdź, jak Twoje liczby wypadają na tle kategorii.
          </p>
          <Button onClick={() => setRevealed(true)} size="lg" className="mt-4 w-full sm:w-auto">
            Pokaż moją marżę
          </Button>
          <p className="mt-4 text-xs text-gray-400">To wczesny podgląd funkcji, która jeszcze nie istnieje.</p>
        </div>
      )}

      {variant === "B" &&
        (ctaSubmitted ? (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Zgłoszenie wysłane — skontaktujemy się w sprawie Twojej analizy.
            </div>

            {reactionSubmitted ? (
              <p className="text-sm text-gray-500">Dzięki za odpowiedź — to dla nas bardzo cenne.</p>
            ) : (
              <form
                onSubmit={handleReactionSubmit}
                className="rounded-2xl border border-gray-100 bg-white p-5"
              >
                <label htmlFor="reaction" className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Co Cię najbardziej zaskoczyło w tych liczbach? (opcjonalnie)
                </label>
                <textarea
                  id="reaction"
                  value={reactionText}
                  onChange={(event) => setReactionText(event.target.value)}
                  rows={3}
                  placeholder="Napisz kilka słów..."
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <Button type="submit" size="sm" className="mt-3" disabled={!reactionText.trim()}>
                  Wyślij
                </Button>
              </form>
            )}
          </div>
        ) : (
          <button
            type="button"
            disabled={!revealed}
            onClick={() => setCtaSubmitted(true)}
            className={cn(
              "mt-8 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity duration-700 delay-300 hover:opacity-90 disabled:pointer-events-none sm:w-auto",
              revealed ? "opacity-100" : "opacity-0"
            )}
          >
            Chcę indywidualną analizę marży →
          </button>
        ))}
    </main>
  );
}

function MetricBlock({
  label,
  value,
  hint,
  revealed,
}: {
  label: string;
  value: string;
  hint: string;
  revealed: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p
        aria-hidden={!revealed}
        className={cn(
          "mt-2 text-2xl font-bold text-gray-900",
          REVEAL_TRANSITION,
          revealed ? "blur-none opacity-100" : "blur-sm opacity-60 select-none"
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-gray-400">{hint}</p>
    </div>
  );
}

// There's no real "ranking" field in the seller data model, so this card
// never unblurs — it's an honest tease of a metric the full product would add.
function RankingTeaserCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5">
      <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
        <Lock className="h-3.5 w-3.5 text-gray-400" />
      </div>
      <p className="pr-8 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Ranking w kategorii
      </p>
      <p aria-hidden="true" className="mt-2 text-2xl font-bold text-gray-900 blur-sm select-none">
        Top 30%
      </p>
      <p className="mt-1 text-xs text-gray-400">Wkrótce w pełnej wersji</p>
    </div>
  );
}
