import type { Metadata } from "next";
import { ContentDashboard } from "@/features/admin/content/content-dashboard";

export const metadata: Metadata = { title: "Содержимое сайта · Панель управления" };
export default function Page() { return <ContentDashboard />; }
