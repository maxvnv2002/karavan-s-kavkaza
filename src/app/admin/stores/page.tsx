import type { Metadata } from "next";
import { StoresDashboard } from "@/features/admin/stores/stores-dashboard";

export const metadata: Metadata = { title: "Розничные магазины · Панель управления" };
export default function Page() { return <StoresDashboard />; }
