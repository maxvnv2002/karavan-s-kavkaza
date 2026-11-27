import type { Metadata } from "next";
import { PositionEditor } from "@/features/admin/catalog/position-editor";

export const metadata: Metadata = { title: "Товар и партия · Панель управления" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PositionEditor id={id} />;
}
