import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestDashboard, RequestDashboardFromUrl } from "@/features/admin/request-dashboard";

export const metadata: Metadata = {
  title: "Заявки малого опта · Панель управления",
  robots: { index: false, follow: false },
};

export default function RequestsPage() {
  return (
    <Suspense fallback={<RequestDashboard />}>
      <RequestDashboardFromUrl />
    </Suspense>
  );
}
