import { CategoryCatalog } from "@/components/CatalogSections";
import Footer from "@/components/Footer";
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <><CategoryCatalog slug={slug} /><Footer /></>; }
