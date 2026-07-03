import type {
  SellerAnalyticsData,
  SellerAnalyticsResult,
  SellerAnalyticsVariant,
} from "@/types/seller-analytics";

export type RawSellerAnalyticsParams = Record<string, string | string[] | undefined>;

// The single query param a concierge link is encoded into, e.g. /preview?d=<token>.
const LINK_PARAM = "d";

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

const DEMO_VARIANT: SellerAnalyticsVariant = "B";

// Short keys keep the encoded token compact.
interface SellerLinkPayload {
  v: SellerAnalyticsVariant;
  n: string;
  s: string;
  m: number;
  cm: number;
  r: number;
  cr: number;
  g: number;
  o: number;
}

function getParam(raw: RawSellerAnalyticsParams, key: string): string | undefined {
  const value = raw[key];
  return Array.isArray(value) ? value[0] : value;
}

function toBase64Url(input: string): string {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(input, "utf-8").toString("base64")
      : btoa(input);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return typeof Buffer !== "undefined"
    ? Buffer.from(padded, "base64").toString("utf-8")
    : atob(padded);
}

/** Encodes a seller's data + variant into the single `d` token used by /preview links. */
export function encodeSellerLink(
  data: SellerAnalyticsData,
  variant: SellerAnalyticsVariant
): string {
  const payload: SellerLinkPayload = {
    v: variant,
    n: data.name,
    s: data.shopName,
    m: data.netMargin,
    cm: data.catMedianMargin,
    r: data.returnRate,
    cr: data.catMedianReturn,
    g: data.gmv,
    o: data.orders,
  };
  return toBase64Url(JSON.stringify(payload));
}

function decodeSellerLink(token: string): SellerLinkPayload | undefined {
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as Partial<SellerLinkPayload>;
    if (
      typeof parsed.n !== "string" ||
      typeof parsed.s !== "string" ||
      typeof parsed.m !== "number" ||
      typeof parsed.cm !== "number" ||
      typeof parsed.r !== "number" ||
      typeof parsed.cr !== "number" ||
      typeof parsed.g !== "number" ||
      typeof parsed.o !== "number"
    ) {
      return undefined;
    }
    return { ...parsed, v: parsed.v === "A" ? "A" : "B" } as SellerLinkPayload;
  } catch {
    return undefined;
  }
}

export function parseSellerParams(
  raw: RawSellerAnalyticsParams
): SellerAnalyticsResult {
  const token = getParam(raw, LINK_PARAM);
  const payload = token ? decodeSellerLink(token) : undefined;

  if (!payload) {
    return { data: DEMO_SELLER, variant: DEMO_VARIANT, isDemo: true };
  }

  const data: SellerAnalyticsData = {
    name: payload.n,
    shopName: payload.s,
    gmv: payload.g,
    orders: payload.o,
    netMargin: payload.m,
    returnRate: payload.r,
    catMedianMargin: payload.cm,
    catMedianReturn: payload.cr,
  };

  return { data, variant: payload.v, isDemo: false };
}

export function formatPLN(value: number): string {
  return `${value.toLocaleString("pl-PL")} PLN`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("pl-PL");
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("pl-PL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
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
