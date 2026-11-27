import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { batches, getBatch, products } from "@/features/catalog/data";
import { ProductDetails } from "@/features/catalog/product-details";

type Props = { params: Promise<{ batch: string }> };

export function generateStaticParams() {
  return batches.map(({ id }) => ({ batch: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const batch = getBatch((await params).batch);
  if (!batch) notFound();
  const product = products[batch.productId];
  return {
    title: `${product.name} · партия ${batch.date}.11.2026`,
    description: `${product.description} Розничная и оптовая цена, условия хранения и получения.`,
  };
}

export default async function BatchPage({ params }: Props) {
  const batch = getBatch((await params).batch);
  if (!batch) notFound();

  return (
    <>
      <SiteHeader />
      <ProductDetails batch={batch} />
      <SiteFooter />
    </>
  );
}
