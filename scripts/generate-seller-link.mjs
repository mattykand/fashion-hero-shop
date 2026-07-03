// Builds a short /seller/analytics/preview concierge link for one seller.
//
// Usage:
//   node scripts/generate-seller-link.mjs \
//     --name Kasia --shop "Kasia Design" --variant B \
//     --margin 412 --cat-median 638 \
//     --return-rate 21.2 --cat-return 18.4 \
//     --gmv 5374 --orders 27 \
//     [--base https://fashion-hero-shop-one.vercel.app]

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1];
    args[key] = value;
    i += 1;
  }
  return args;
}

function requireNumber(args, key) {
  const raw = args[key];
  const value = Number(raw);
  if (raw === undefined || Number.isNaN(value)) {
    throw new Error(`Missing or invalid --${key}`);
  }
  return value;
}

function requireString(args, key) {
  const value = args[key];
  if (!value) throw new Error(`Missing --${key}`);
  return value;
}

function toBase64Url(input) {
  return Buffer.from(input, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const args = parseArgs(process.argv.slice(2));

const payload = {
  v: args.variant === "A" ? "A" : "B",
  n: requireString(args, "name"),
  s: requireString(args, "shop"),
  m: requireNumber(args, "margin"),
  cm: requireNumber(args, "cat-median"),
  r: requireNumber(args, "return-rate"),
  cr: requireNumber(args, "cat-return"),
  g: requireNumber(args, "gmv"),
  o: requireNumber(args, "orders"),
};

const token = toBase64Url(JSON.stringify(payload));
const base = args.base ?? "https://fashion-hero-shop-one.vercel.app";

console.log(`${base}/seller/analytics/preview?d=${token}`);
