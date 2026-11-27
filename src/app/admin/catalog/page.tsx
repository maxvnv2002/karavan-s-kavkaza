import type { Metadata } from "next";
import { CatalogDashboard } from "@/features/admin/catalog/catalog-dashboard";

export const metadata: Metadata = { title: "Каталог и партии · Панель управления" };

export default function Page() {
  return <CatalogDashboard />;
}
