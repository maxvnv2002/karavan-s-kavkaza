import type { Metadata } from "next";
import { connection } from "next/server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Catalog } from "@/features/catalog/catalog";

export const metadata: Metadata = {
  title: "Каталог продукции",
  description: "Мясо птицы и полуфабрикаты. Каталог партий, розничные цены и условия мелкого опта.",
};

export default async function CatalogPage() {
  await connection();

  return (
    <>
      <SiteHeader />
      <Catalog />
      <SiteFooter />
    </>
  );
}
