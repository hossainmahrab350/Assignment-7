"use client";
import { useEffect, useState } from "react";
import { getProducts, type Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";

function ProductGrid({ products, loading }: { products: Product[]; loading?: boolean }) { return <div className="product-grid">{loading ? Array.from({ length: 8 }).map((_, i) => <div className="skeleton" key={i} />) : products.map((p) => <ProductCard key={p.id} product={p} />)}</div>; }
export function HomeCatalog() {
  const [products, setProducts] = useState<Product[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { getProducts().then(setProducts).finally(() => setLoading(false)); }, []);
  const rising = [...products].filter((p) => p.change > 0).sort((a,b) => b.change-a.change).slice(0,6);
  const falling = [...products].filter((p) => p.change < 0).sort((a,b) => a.change-b.change).slice(0,6);
  return <main className="home-main"><section className="hero container"><div className="hero-copy"><p className="eyebrow">শুক্রবার, ১০ অক্টোবর, ২০২৬</p><h1>আজকের বাজারের দাম<br />এক নজরে</h1><p>চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম প্রতিদিন আপডেট করা হয়।</p><a className="button" href="#সব-পণ্য">সব পণ্য দেখুন <span>→</span></a></div><div className="hero-art"><span className="hero-circle" /><img src="/bazar-hero.png" alt="বাজারের ঝুড়ি" /></div></section>
  <section className="container section"><div className="section-heading"><div><p className="eyebrow green">দাম বেড়েছে</p><h2>আজ দাম বেড়েছে <span className="up">▲</span></h2></div><p>গতকালের তুলনায় যেসব পণ্যের দাম বেড়েছে</p></div><ProductGrid products={rising} loading={loading} /></section>
  <section className="container section"><div className="section-heading"><div><p className="eyebrow red">দাম কমেছে</p><h2>আজ দাম কমেছে <span className="down">▼</span></h2></div><p>গতকালের তুলনায় যেসব পণ্যের দাম কমেছে</p></div><ProductGrid products={falling} loading={loading} /></section>
  <section className="container section all-products" id="সব-পণ্য"><div className="section-heading"><div><p className="eyebrow">আজকের তালিকা</p><h2>সব পণ্য</h2></div><p>বাজারের সর্বশেষ আপডেট করা দাম</p></div><ProductGrid products={products} loading={loading} /></section></main>;
}
export function CategoryCatalog({ slug }: { slug: string }) {
 const [products,setProducts]=useState<Product[]>([]); const [loading,setLoading]=useState(true); const [sort,setSort]=useState("default");
 useEffect(()=>{getProducts(slug).then(setProducts).finally(()=>setLoading(false));},[slug]);
 const ordered=[...products].sort((a,b)=>sort==="low"?a.price-b.price:sort==="high"?b.price-a.price:0);
 if(!loading && !products.length) return <main className="container empty-page"><div className="empty-icon">🧺</div><h1>পণ্য খুঁজে পাওয়া যায়নি</h1><p>এই ক্যাটাগরিতে এখন কোনো পণ্য নেই।</p><a className="button" href="/">হোম পেজে ফিরে যান</a></main>;
 return <main className="container category-page"><div className="page-title"><div><p className="eyebrow">ক্যাটাগরি</p><h1>{products[0]?.emoji || "🛒"} {products[0]?.categoryLabel || "পণ্য"}</h1><p>এই ক্যাটাগরির আজকের বাজারদর দেখুন।</p></div><label className="sort-label">সাজান:<select value={sort} onChange={(e)=>setSort(e.target.value)}><option value="default">ডিফল্ট</option><option value="low">দাম: কম থেকে বেশি</option><option value="high">দাম: বেশি থেকে কম</option></select></label></div><ProductGrid products={ordered} loading={loading}/></main>;
}
