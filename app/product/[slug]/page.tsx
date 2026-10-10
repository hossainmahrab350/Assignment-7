"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fallbackProducts, getProducts, type Product, bn } from "@/lib/catalog";
import { useAuth } from "@/components/AuthProvider";

export default function ProductPage() {
 const { slug }=useParams<{slug:string}>(); const router=useRouter(); const {user,ready:authReady}=useAuth(); const [product,setProduct]=useState<Product|null>(null); const [ready,setReady]=useState(false);
 useEffect(()=>{if(!authReady)return;if(!user){router.replace(`/signin?next=/product/${slug}`);return;}getProducts().then((items)=>setProduct(items.find((p)=>p.slug===slug||String(p.id)===slug)||fallbackProducts.find((p)=>p.slug===slug||String(p.id)===slug)||null)).finally(()=>setReady(true));},[slug,user,router,authReady]);
 if(!authReady||!user||!ready)return <main className="container detail-loading"><div className="skeleton" /></main>;
 if(!product)return <main className="container empty-page"><div className="empty-icon">🔎</div><h1>পণ্য খুঁজে পাওয়া যায়নি</h1><p>এই পণ্যটি আর পাওয়া যাচ্ছে না অথবা ঠিকানাটি ভুল।</p><Link href="/" className="button">হোম পেজে ফিরে যান</Link></main>;
 const markets=product.markets?.length?product.markets:["কারওয়ান বাজার","মিরপুর বাজার","যাত্রাবাড়ী বাজার","শ্যামবাজার"].map((name,i)=>({name,min:product.price-(i+3)*2,max:product.price+(i+4)*2,average:product.price+i})); const min=Math.min(...markets.map(m=>m.min)),max=Math.max(...markets.map(m=>m.max)),average=markets.reduce((sum,m)=>sum+m.average,0)/markets.length;
 return <main className="container detail-page"><Link className="back" href="/">← সব পণ্যে ফিরে যান</Link><section className="detail-head"><div className="detail-emoji">{product.emoji}</div><div><p className="eyebrow">{product.categoryLabel}</p><h1>{product.name}</h1><p>{product.description}</p><div className="tags"><span>{product.categoryLabel}</span><span>{product.unit}</span></div></div></section><section className="price-summary"><div><span>সর্বনিম্ন দাম</span><strong>{bn(min)} টাকা</strong></div><div><span>সর্বোচ্চ দাম</span><strong>{bn(max)} টাকা</strong></div><div><span>গড় দাম</span><strong>{bn(average)} টাকা</strong></div></section><section className="market-section"><div className="section-heading"><div><p className="eyebrow">আজকের তথ্য</p><h2>বাজারভিত্তিক আজকের দাম</h2></div><p>{product.unit}</p></div><div className="market-table"><div className="market-row market-label"><span>বাজার</span><span>সর্বনিম্ন</span><span>সর্বোচ্চ</span><span>গড়</span></div>{markets.map(m=><div className="market-row" key={m.name}><b>{m.name}</b><span>{bn(m.min)} টাকা</span><span>{bn(m.max)} টাকা</span><strong>{bn(m.average)} টাকা</strong></div>)}</div></section></main>;
}
