import Image from "next/image";
import Link from "next/link";
import { ActionLink } from "@/components/action-link";
import { site } from "@/lib/site";
import { WholesaleButton } from "@/features/wholesale/wholesale-button";
import { batches, products, type Batch } from "./data";
import { formatNumber, rubles } from "./format";
import styles from "./product-details.module.css";

const categoryNames = { whole: "Тушка", parts: "Части птицы", offal: "Субпродукты", prepared: "Полуфабрикаты" };
const getCatalogLink = (group: string) => group === "prepared" ? "/catalog?category=prepared" : `/catalog?group=${group}`;

export function ProductDetails({ batch }: { batch: Batch }) {
  const product = products[batch.productId];
  const alternative = batches.find((item) => item.productId === batch.productId && item.id !== batch.id);
  const facts = [
    ["Забой", `${batch.date}.11.2026`],
    ["Остаток", `${batch.stock} кг`],
    ["Фасовка", `${formatNumber(product.pack)} кг`],
    ["Хранение", product.storage],
    ["Годен до", batch.expires],
  ];

  return (
    <main id="main" className={`wrap ${styles.main}`}>
      <nav className={styles.crumbs} aria-label="Хлебные крошки">
        <Link href="/catalog">Каталог</Link> / <Link href={getCatalogLink(product.group)}>{categoryNames[product.group]}</Link>
      </nav>
      <figure className={styles.photo}>
        <Image className="photo" src={product.image} alt="" fill sizes="(max-width: 767px) 100vw, 620px" preload />
      </figure>
      <section className={styles.summary}>
        <p className={styles.code}>Арт. {product.code}</p>
        <h1>{product.name}</h1>
        <p className={styles.description}>{product.description}</p>
        <Pricing batch={batch} />
        <ActionLink href={site.phoneLink} full>Позвонить и уточнить</ActionLink>
        <p className={styles.note}>Розница от 1 упаковки.</p>
        <WholesaleButton product={batch.productId} full />
      </section>
      <section className={styles.facts}>
        <h2>О партии</h2>
        <dl>
          {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
        {alternative && <OtherBatch batch={alternative} />}
        <h2>Как получить</h2>
        <p className={styles.receive}>Самовывоз с фабрики в часы работы.<br />Доставку согласуйте с менеджером.<br />Для крупного опта позвоните на фабрику.</p>
        <Link href="/production" className={styles.production}>Происхождение и Халяль</Link>
        <p className={styles.example}>Фото иллюстративное.</p>
      </section>
    </main>
  );
}

function Pricing({ batch }: { batch: Batch }) {
  const { minimum } = products[batch.productId];
  return (
    <div className={styles.prices}>
      <div>
        <p>Розница от 1 кг</p>
        <strong>{rubles(batch.retail)} / кг</strong>
        {batch.previousRetail && <del>{rubles(batch.previousRetail)} / кг</del>}
      </div>
      <div>
        <p>Мелкий опт от {minimum} кг</p>
        <strong>{rubles(batch.wholesale)} / кг</strong>
        {batch.previousWholesale && <del>{rubles(batch.previousWholesale)} / кг</del>}
      </div>
    </div>
  );
}

function OtherBatch({ batch }: { batch: Batch }) {
  return (
    <>
      <h2>Другая партия</h2>
      <Link className={styles.alternative} href={`/catalog/${batch.id}`}>
        <p>Забой {batch.date}.11</p>
        <strong>{rubles(batch.retail)} / кг</strong>
        <small>Опт {rubles(batch.wholesale)} / кг, от {products[batch.productId].minimum} кг</small>
        <span>{batch.previousRetail ? "Открыть партию со скидкой" : "Открыть партию"}</span>
      </Link>
    </>
  );
}
