import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Production } from "@/features/information/production";

export const metadata: Metadata = {
  title: "Производство и требования Халяль",
  description: "Происхождение сырья, этапы производства, ингредиенты полуфабрикатов и статус документов фабрики.",
};

export default function ProductionPage() {
  return (
    <div className="page">
      <SiteHeader />
      <Production />
      <SiteFooter compact production />
    </div>
  );
}
