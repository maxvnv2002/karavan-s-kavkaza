import type { Metadata } from "next";
import { Suspense } from "react";
import { PositionEditor } from "@/features/admin/catalog/position-editor";

export const metadata: Metadata = { title: "Товар и партия · Панель управления" };

export default function Page() {
  return <Suspense><PositionEditor /></Suspense>;
}
