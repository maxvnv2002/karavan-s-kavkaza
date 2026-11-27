import { ActionLink } from "@/components/action-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap" style={{ paddingBlock: 56, display: "grid", gap: 16, justifyItems: "start" }}>
        <h1>Страница не найдена</h1>
        <p>Проверьте адрес или откройте каталог продукции.</p>
        <ActionLink href="/catalog">Смотреть каталог</ActionLink>
      </main>
      <SiteFooter compact />
    </>
  );
}
