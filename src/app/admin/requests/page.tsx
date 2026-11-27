import type { Metadata } from "next";
import { RequestDashboard } from "@/features/admin/request-dashboard";

export const metadata: Metadata = {
  title: "Заявки малого опта · Панель управления",
  robots: { index: false, follow: false },
};

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ request?: string | string[] }> }) {
  const { request } = await searchParams;
  const id = typeof request === "string" ? request : undefined;
  return <RequestDashboard key={id} selectedId={id} />;
}
