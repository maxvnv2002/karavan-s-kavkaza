import type { Metadata } from "next";
import { Suspense } from "react";
import { SlaughterEditor } from "@/features/admin/catalog/slaughter-editor";

export const metadata: Metadata = { title: "Забой · Панель управления" };

export default function Page() {
  return <Suspense><SlaughterEditor /></Suspense>;
}
