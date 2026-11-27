import Link from "next/link";
import { site } from "@/lib/site";
import { ActionLink } from "./action-link";
import { CookieSettingsButton } from "@/features/legal/cookies";
import styles from "./site-footer.module.css";

const legalLinks = [
  ["/contacts#company", "Контакты и реквизиты"],
  ["/contacts#stores", "Розничные магазины"],
  ["/privacy", "Политика обработки ПД"],
  ["/contacts#documents", "Документы для оптовиков"],
] as const;

/** Shared contact information and legal navigation. */
export function SiteFooter({ compact = false, production = false, privacy = false }: {
  compact?: boolean;
  production?: boolean;
  privacy?: boolean;
}) {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.main}`}>
        <div className={styles.columns}>
          <section className={styles.order}>
            <h2>Заказы по телефону</h2>
            <a href={site.phoneLink} className={styles.phone}>{site.phone}</a>
            <p className={styles.hours}>{site.hours}</p>
            <ActionLink href={site.phoneLink} accent full className="mobile-only">Позвонить на фабрику</ActionLink>
          </section>
          <div className={styles.pickup}>
            <p className="desktop-only"><strong>Самовывоз с фабрики</strong></p>
            <p className="desktop-only">{site.address}</p>
            <p className="mobile-only">Самовывоз: {site.address}</p>
            <p>Оптовую доставку согласуйте по телефону.<br className="desktop-only" /><span className="desktop-only">Перед поездкой позвоните нам.</span></p>
          </div>
          <nav aria-label="Разделы сайта" className={`desktop-only ${styles.siteNav}`}>
            <Link href="/catalog">Каталог продукции</Link>
            <Link href="/#purchase">Условия покупки</Link>
            <Link href="/#about">О фабрике</Link>
          </nav>
        </div>
        <div className={styles.meta}>
          <p>© {site.year} Птицефабрика</p>
        </div>
        {!privacy && <Link className={`desktop-only ${styles.production}`} href={production ? "/" : "/production"}>
          {production ? "На главную" : "Производство и Халяль"}
        </Link>}
      </div>
      {!compact && !privacy && (
        <div className={`mobile-only ${styles.mobileProduction}`}>
          <Link className={`wrap ${styles.production}`} href="/production">Производство и Халяль</Link>
        </div>
      )}
      <div className={styles.legal}>
        <div className={`wrap ${styles.legalInner}`}>
          <nav aria-label="Юридическая информация">
            {legalLinks.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
            <CookieSettingsButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
