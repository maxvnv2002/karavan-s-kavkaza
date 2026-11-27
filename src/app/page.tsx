import { ActionLink } from "@/components/action-link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Factory, PurchaseSteps } from "@/features/home/factory";
import { FeaturedProducts } from "@/features/home/featured-products";
import { Hero } from "@/features/home/hero";
import styles from "@/features/home/home.module.css";
import { WholesaleButton } from "@/features/wholesale/wholesale-button";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <section className="soft-green">
          <div className={`wrap ${styles.callout}`}>
            <h2>Малый опт</h2>
            <p className="muted">Наличие и условия подтвердит менеджер.</p>
            <WholesaleButton />
          </div>
        </section>
        <FeaturedProducts />
        <PurchaseSteps />
        <Factory />
        <section className="white">
          <div className={`wrap ${styles.callout}`}>
            <h2>Где купить в розницу</h2>
            <p className="muted">Список магазинов готовится к публикации.</p>
            <ActionLink href="/contacts#stores">Контакты и магазины</ActionLink>
          </div>
        </section>
        <section className="soft-green">
          <div className={`wrap ${styles.callout} ${styles.halal}`}>
            <h2>Производство<br />и требования Халяль</h2>
            <p>Сертификата Халяль пока нет. Сертификация планируется.</p>
            <ActionLink href="/production">Документы и этапы производства</ActionLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
