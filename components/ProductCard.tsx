"use client";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/catalog";
import { bn } from "@/lib/catalog";
import { useAuth } from "./AuthProvider";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter(); const { user } = useAuth(); const direction = product.change > 0 ? "up" : product.change < 0 ? "down" : "flat";
  const open = () => user ? router.push(`/product/${product.slug}`) : router.push(`/signin?next=/product/${product.slug}`);
  return <button className="product-card" onClick={open}><div className="product-emoji">{product.emoji}</div><div className="product-copy"><h3>{product.name}</h3><p>{product.unit}</p></div><div className="card-price"><span>আজকের দাম</span><strong>{bn(product.price)} টাকা</strong></div><span className={`change ${direction}`}>{product.change > 0 ? "▲" : product.change < 0 ? "▼" : "—"} {bn(Math.abs(product.change))}%</span></button>;
}
