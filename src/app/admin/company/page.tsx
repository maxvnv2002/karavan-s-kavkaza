import type { Metadata } from "next";
import { CompanyDashboard } from "@/features/admin/company/company-dashboard";

export const metadata: Metadata = { title: "Реквизиты и документы · Панель управления" };
export default function Page() { return <CompanyDashboard />; }
