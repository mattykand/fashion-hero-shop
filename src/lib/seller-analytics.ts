import type { SellerAnalyticsData, SellerAnalyticsResult } from "@/types/seller-analytics";

export type RawSellerAnalyticsParams = Record<string, string | string[] | undefined>;

// Test constant used when no concierge params are present in the URL.
const DEMO_SELLER: SellerAnalyticsData = {
  name: "Kasia",
  shopName: "Kasia Design",
  gmv: 5374,
  orders: 27,
  netMargin: 412,
  returnRate: 21.2,
  catMedianMargin: 638,
  catMedianReturn: 18.4,
};

const PARAM_KEYS = [
  "name",
  "shop",
  "margin",
  "cat_median",
  "return_rate",
  "cat_return",
  "gmv",
  "orders",
] as const;

function getParam(raw: RawSellerAnalyticsParams, key: string): string | undefined {
  const value = raw[key];
  return Array.isArray(value) ? value[0] : value;
}

function getNumberParam(
  raw: RawSellerAnalyticsParams,
  key: string,
  fallback: number
): number {
  const value = getParam(raw, key);
  if (value === undefined) return fallback;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function parseSellerParams(
  raw: RawSellerAnalyticsParams
): SellerAnalyticsResult {
  const isDemo = !PARAM_KEYS.some((key) => getParam(raw, key) !== undefined);

  if (isDemo) {
    return { data: DEMO_SELLER, isDemo: true };
  }

  const data: SellerAnalyticsData = {
    name: getParam(raw, "name") ?? DEMO_SELLER.name,
    shopName: getParam(raw, "shop") ?? DEMO_SELLER.shopName,
    gmv: getNumberParam(raw, "gmv", DEMO_SELLER.gmv),
    orders: getNumberParam(raw, "orders", DEMO_SELLER.orders),
    netMargin: getNumberParam(raw, "margin", DEMO_SELLER.netMargin),
    returnRate: getNumberParam(raw, "return_rate", DEMO_SELLER.returnRate),
    catMedianMargin: getNumberParam(raw, "cat_median", DEMO_SELLER.catMedianMargin),
    catMedianReturn: getNumberParam(raw, "cat_return", DEMO_SELLER.catMedianReturn),
  };

  return { data, isDemo: false };
}

export function formatPLN(value: number): string {
  return `${value.toLocaleString("pl-PL")} PLN`;
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("pl-PL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

export function formatPp(value: number): string {
  return Math.abs(value).toLocaleString("pl-PL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function marginDeltaPercent(netMargin: number, catMedianMargin: number): number {
  if (catMedianMargin === 0) return 0;
  return ((netMargin - catMedianMargin) / catMedianMargin) * 100;
}

export function formatSignedPercent(value: number): string {
  const rounded = Math.round(value);
  if (rounded === 0) return "0%";
  const sign = rounded > 0 ? "+" : "−";
  return `${sign}${Math.abs(rounded)}%`;
}
