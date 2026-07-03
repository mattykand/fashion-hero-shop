import type { Metadata } from "next";
import { parseSellerParams, type RawSellerAnalyticsParams } from "@/lib/seller-analytics";
import { AnalyticsHeader } from "./_components/analytics-header";
import { SellerAnalyticsExperience } from "./_components/seller-analytics-experience";

export const metadata: Metadata = {
  title: "Analizuj dane | FashionHero",
  description: "Zobacz swoją marżę netto na tle mediany kategorii.",
};

interface PageProps {
  searchParams: Promise<RawSellerAnalyticsParams>;
}

export default async function SellerAnalyticsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const { data, variant, isDemo } = parseSellerParams(raw);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AnalyticsHeader pageLabel="Analizuj dane" />
      <SellerAnalyticsExperience data={data} variant={variant} isDemo={isDemo} />
    </div>
  );
}
