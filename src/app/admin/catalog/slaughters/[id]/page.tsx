import type { Metadata } from "next";
import { SlaughterEditor } from "@/features/admin/catalog/slaughter-editor";

export const metadata: Metadata = { title: "Забой · Панель управления" };

export default async function Page({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ position?: string | string[] }>;
}) {
  const [{ id }, { position }] = await Promise.all([params, searchParams]);
  return <SlaughterEditor id={id} selectedId={typeof position === "string" ? position : undefined} />;
}
