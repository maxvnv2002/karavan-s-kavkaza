import Image from "next/image";
import Link from "next/link";
import { products, type Batch, type PriceMode } from "./data";
import { formatNumber, rubles } from "./format";
import styles from "./product-card.module.css";

type ProductCardProps = { batch: Batch; mode?: PriceMode; home?: boolean };

/** Catalog preview linked to an individual batch. */
export function ProductCard({ batch, mode = "retail", home = false }: ProductCardProps) {
  const product = products[batch.productId];
  const wholesale = mode === "wholesale";
  const previous = wholesale ? batch.previousWholesale : batch.previousRetail;
  const date = `${batch.date}.11`;

  return (
    <article className={styles.item}>
      <Link className={styles.card} href={`/catalog/${batch.id}`}>
        <div className={styles.media}>
          <Image src={product.image} alt="" fill sizes="(max-width: 767px) 50vw, 294px" />
          {batch.badge && <span className={styles.badge}>{batch.badge}</span>}
        </div>
        <div className={styles.body}>
          <h3>{product.cardName}</h3>
          <p className={styles.description}>{formatNumber(product.pack)} кг · {product.state}</p>
          <p className={styles.date}>
            {product.category === "prepared" ? "Из птицы забоя " : "Забой "}{date}
            {product.category !== "prepared" && <span className={home ? "mobile-only" : undefined}>.2026</span>}
          </p>
          <div className={styles.price}>
            <strong>{rubles(batch[mode])} / кг</strong>
            {previous && <del>{rubles(previous)}</del>}
          </div>
          <p className={styles.detail}>
            {wholesale ? <>Розница {rubles(batch.retail)}</> : <>Опт {rubles(batch.wholesale)} {batch.previousWholesale && <del>{rubles(batch.previousWholesale)}</del>}</>}
            <br />от {product.minimum} кг
          </p>
        </div>
      </Link>
      {product.category === "prepared" && <Link className={styles.ingredients} href="/production#ingredients">Состав полуфабрикатов</Link>}
    </article>
  );
}
