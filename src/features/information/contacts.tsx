import Link from "next/link";
import { site } from "@/lib/site";
import { WholesaleButton } from "@/features/wholesale/wholesale-button";
import { wholesaleDocuments } from "./content";
import { StatusCard } from "./status-card";
import styles from "./information.module.css";

export function Contacts() {
  return (
    <main id="main" className={`wrap ${styles.contacts}`}>
      <Link href="/" className={styles.back}>На главную</Link>
      <h1>Контакты<br />и розничные магазины</h1>
      <section className={`soft-green ${styles.contactCard}`}>
        <h2>Связаться с фабрикой</h2>
        <a href={site.phoneLink} className={styles.phone}>{site.phone}</a>
        <p className="muted">{site.hours}</p>
        <WholesaleButton full />
      </section>
      <section className={`white ${styles.contactCard}`}>
        <h2>Самовывоз с фабрики</h2>
        <p className={styles.lead}>{site.address}</p>
        <p className={styles.small}>Перед поездкой уточните наличие и время получения. Оптовую доставку согласуйте с менеджером.</p>
      </section>
      <section id="stores" className={`white ${styles.contactCard} ${styles.outlined}`}>
        <h2>Розничные магазины</h2>
        <p className="muted">Список магазинов пока не опубликован. Адрес ближайшего магазина можно уточнить по телефону фабрики.</p>
      </section>
      <Company />
      <section className={styles.contactDocs} id="documents">
        <h2>Документы для оптовиков</h2>
        {wholesaleDocuments.map((document) => <StatusCard key={document.title} {...document} />)}
      </section>
      <p className={styles.small}>Информация о продукции, ценах и условиях не является публичной офертой. Состав поставки и итоговые условия согласовываются отдельно.</p>
    </main>
  );
}

function Company() {
  return (
    <section id="company" className={`white ${styles.contactCard}`}>
      <h2>Реквизиты компании</h2>
      <p>Реквизиты готовятся к публикации.</p>
      <a href={site.phoneLink} className={styles.phone}>{site.phone}</a>
    </section>
  );
}
