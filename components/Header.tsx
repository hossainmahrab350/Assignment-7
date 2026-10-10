"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { categories, fallbackProducts, bn } from "@/lib/catalog";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const pathname = usePathname(); const router = useRouter(); const { user, signOut } = useAuth();
  const ticker = fallbackProducts.slice(0, 9);
  return <>
    <header className="site-header"><div className="header-top container">
      <Link className="brand" href="/"><span className="brand-cart">🛒</span><span><strong>বাজার দর</strong><small>শুক্রবার, ১০ অক্টোবর, ২০২৬</small></span></Link>
      <div className="auth-nav">{user ? <><Link className="profile-link" href="/profile">{user.name} <span>▾</span></Link><button className="text-button" onClick={() => { signOut(); router.push("/"); }}>সাইন আউট</button></> : <><Link className="text-button" href="/signin">সাইন ইন</Link><Link className="button button-small" href="/signup">সাইন আপ</Link></>}</div>
    </div><nav className="category-nav"><div className="container category-scroll">{categories.map((category) => <Link key={category.slug} className={pathname === `/category/${category.slug}` ? "active" : ""} href={`/category/${category.slug}`}>{category.emoji} {category.label}</Link>)}</div></nav></header>
    <div className="ticker"><div className="ticker-track">{[...ticker, ...ticker].map((p, i) => <span key={`${p.id}-${i}`}><b>{p.emoji} {p.name}</b> {bn(p.price)} টাকা/{p.unit.replace("প্রতি ", "")} <em className={p.change > 0 ? "up" : p.change < 0 ? "down" : "flat"}>{p.change > 0 ? "▲" : p.change < 0 ? "▼" : "—"} {bn(Math.abs(p.change))}%</em></span>)}</div></div>
  </>;
}
