import Link from "next/link";
import { ActionLink } from "@/components/action-link";
import { certificates, ingredients, origin, stages } from "./content";
import { StatusCard } from "./status-card";
import styles from "./information.module.css";

export function Production() {
  return (
    <main id="main">
      <div className={`wrap ${styles.productionIntro}`}>
        <Link href="/" className={styles.back}>На главную</Link>
        <div className={styles.introGrid}>
          <h1>Производство<br />и требования Халяль</h1>
          <aside className={`soft-green ${styles.certificate}`}>
            <h2>Сертификата<br />Халяль пока нет</h2>
            <p>Сертификация планируется. Заявление производителя не заменяет подтверждающий сертификат.</p>
          </aside>
        </div>
      </div>
      <section className={`wrap ${styles.productionSection}`}>
        <h2>Происхождение птицы</h2>
        <StatusCard {...origin} className={styles.origin} />
      </section>
      <section className="soft-green">
        <div className={`wrap ${styles.productionSection}`}>
          <h2>Этапы производства</h2>
          <p className="muted">Сведения по этапам пока не опубликованы. Их проверит производитель.</p>
          <div className={`${styles.cardGrid} ${styles.stages}`}>
            {stages.map((stage) => <StatusCard key={stage.title} {...stage} />)}
          </div>
        </div>
      </section>
      <section className={`wrap ${styles.productionSection}`} id="ingredients">
        <h2>Ингредиенты полуфабрикатов</h2>
        <StatusCard {...ingredients} />
      </section>
      <section className={`wrap ${styles.productionSection}`}>
        <h2>Документы и подтверждения</h2>
        <div className={`${styles.cardGrid} ${styles.documents}`}>
          {certificates.map((certificate) => <StatusCard key={certificate.title} {...certificate} />)}
        </div>
        <ActionLink href="/contacts#documents" className={styles.wholesaleDocs}>Документы для оптовиков</ActionLink>
      </section>
      <section className="soft-green">
        <div className={`wrap ${styles.productionSection}`}>
          <h2>Вопросы о продукции</h2>
          <p>Уточните у фабрики состав продукции, происхождение сырья и наличие документов.</p>
          <ActionLink href="/" className={`desktop-only ${styles.homeLink}`}>На главную</ActionLink>
          <ActionLink href="/catalog" className={`mobile-only ${styles.homeLink}`}>Смотреть каталог</ActionLink>
        </div>
      </section>
    </main>
  );
}
