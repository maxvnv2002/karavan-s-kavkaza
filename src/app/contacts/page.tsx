import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Contacts } from "@/features/information/contacts";

export const metadata: Metadata = {
  title: "Контакты и розничные магазины",
  description: "Как связаться с фабрикой, узнать об условиях самовывоза и найти документы для оптовиков.",
};

export default function ContactsPage() {
  return (
    <div className="page">
      <SiteHeader />
      <Contacts />
      <SiteFooter compact />
    </div>
  );
}
