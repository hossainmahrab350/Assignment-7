export type Product = {
  id: string | number;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  emoji: string;
  unit: string;
  price: number;
  change: number;
  description: string;
  markets?: { name: string; min: number; max: number; average: number }[];
};

const icons: Record<string, string> = {
  chal: "🍚", dal: "🫘", tel: "🫙", sobji: "🥬", mach: "🐟", mangsho: "🍗", "dim-dudh": "🥚", mosla: "🌶️",
};
const labels: Record<string, string> = {
  chal: "চাল", dal: "ডাল", tel: "তেল", sobji: "সবজি", mach: "মাছ", mangsho: "মাংস", "dim-dudh": "ডিম-দুধ", mosla: "মসলা",
};

export const fallbackProducts: Product[] = [
  ["স্বর্ণমাছি চাল","chal",148,2.1],["মিনিকেট চাল","chal",99,-2.9],["বাটাম সাইজ চাল","chal",66,3.1],["মসুর ডাল","dal",142,2.9],["ছোলা","dal",120,-2.4],["আমন ডাল (খোসাসিলা)","dal",156,2.6],["সয়াবিন তেল","tel",185,-1.4],["সরিষার তেল","tel",240,1.5],["আলু","sobji",55,-3.2],["পেঁয়াজ","sobji",86,4.5],["ঢেঁড়স","sobji",70,5.1],["বেগুন","sobji",62,-1.1],["ইলিশ মাছ","mach",1850,2.7],["রুই মাছ","mach",420,-2.0],["ব্রয়লার মুরগি","mangsho",205,1.8],["গরুর মাংস","mangsho",780,0],["ডিম","dim-dudh",158,3.9],["দুধ","dim-dudh",102,2.0],["দই","dim-dudh",92,0],["মাখন (১০০ গ্রাম)","dim-dudh",145,3.6],["আদা","mosla",85,9.0],["রসুন","mosla",125,-7.4],["মরিচ গুঁড়া","mosla",245,-2.0],["ধনেপাতা গুঁড়া","mosla",265,0]
].map(([name, category, price, change], i) => ({
  id: i + 1, slug: `${category}-${i + 1}`, name: String(name), category: String(category), categoryLabel: labels[String(category)], emoji: icons[String(category)], unit: String(category) === "dim-dudh" ? "প্রতি ডজন" : "প্রতি কেজি", price: Number(price), change: Number(change),
  description: "আজকের বাজারদর এবং বিভিন্ন বাজারের গড় মূল্য।",
  markets: ["কারওয়ান বাজার", "মিরপুর বাজার", "যাত্রাবাড়ী বাজার"].map((market, x) => ({ name: market, min: Number(price) - (x + 2) * 2, max: Number(price) + (x + 3) * 3, average: Number(price) + x })),
}));

export function bn(value: number) { return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 1 }).format(value); }

export function normalizeProduct(raw: Record<string, unknown>, index = 0): Product {
  const category = String(raw.category ?? raw.category_slug ?? raw.categoryName ?? "sobji").toLowerCase().replaceAll(" ", "-");
  const rawChange = raw.change as Record<string, unknown> | number | undefined;
  const price = Number(raw.today ?? raw.price ?? raw.current_price ?? raw.average_price ?? raw.avg_price ?? 0);
  const change = typeof rawChange === "object" && rawChange !== null ? Number(rawChange.pct ?? 0) : Number(rawChange ?? raw.price_change ?? raw.change_percent ?? 0);
  const name = String(raw.nameBn ?? raw.name ?? raw.product_name ?? "পণ্য");
  return {
    id: String(raw.id ?? index + 1), slug: String(raw.slug ?? raw.id ?? `${category}-${index + 1}`), name,
    category, categoryLabel: String(raw.categoryNameBn ?? raw.category_name ?? labels[category] ?? category), emoji: String(raw.image ?? raw.emoji ?? raw.icon ?? raw.categoryIcon ?? icons[category] ?? "🛒"),
    unit: `প্রতি ${raw.unit === "kg" ? "কেজি" : raw.unit === "litre" ? "লিটার" : raw.unit === "dozen" ? "ডজন" : raw.unit === "piece" ? "পিস" : String(raw.unit ?? raw.unit_name ?? "কেজি")}`, price, change,
    description: String(raw.description ?? "আজকের বাজারদর এবং বিভিন্ন বাজারের গড় মূল্য।"),
    markets: Array.isArray(raw.markets) ? raw.markets.map((m) => { const market = m as Record<string, unknown>; const min = Number(market.min ?? price - 5), max = Number(market.max ?? price + 5); return { name: String(market.market ?? market.name ?? "স্থানীয় বাজার"), min, max, average: Number(market.average ?? (min + max) / 2) }; }) : undefined,
  };
}

export async function getProducts(category?: string): Promise<Product[]> {
  const suffix = `/products${category ? `?category=${encodeURIComponent(category)}` : ""}`;
  for (const baseUrl of ["https://api.abcz.workers.dev/api/bazardor", "https://api.api-store.workers.dev/api/bazardor"]) {
    try {
      const response = await fetch(`${baseUrl}${suffix}`);
      if (!response.ok) continue;
      const payload = await response.json();
      const products = Array.isArray(payload) ? payload : payload.products ?? payload.data ?? [];
      if (products.length) return products.map(normalizeProduct);
    } catch {
      // Try the alternative endpoint before using the local fallback data.
    }
  }
  return fallbackProducts.filter((p) => !category || p.category === category);
}

export const categories = Object.entries(labels).map(([slug, label]) => ({ slug, label, emoji: icons[slug] }));
