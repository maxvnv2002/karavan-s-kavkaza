"use client";

import Link from "next/link";
import { useState } from "react";
import { batches, type PriceMode } from "@/features/catalog/data";
import { ProductCard } from "@/features/catalog/product-card";
import styles from "./home.module.css";

const featuredIds = ["wings-21-11", "wings-23-11", "chicken-23-11", "broth-23-11"];
const featured = featuredIds.flatMap((id) => batches.filter((batch) => batch.id === id));

const categories = [
  { id: "meat", title: "Мясо птицы", text: "Тушки, части птицы и субпродукты" },
  { id: "prepared", title: "Полуфабрикаты", text: "Куриные котлеты" },
];

export function FeaturedProducts() {
  const [mode, setMode] = useState<PriceMode>("retail");

  return (
    <section className={`wrap ${styles.featured}`}>
      <div className={styles.featureTitle}>
        <h2>Ассортимент</h2>
        <Link href="/catalog">Весь каталог</Link>
      </div>
      <div className={styles.categories}>
        {categories.map(({ id, title, text }) => (
          <Link href={`/catalog?category=${id}`} key={id}>
            <h3>{title}</h3>
            <p>{text}</p>
          </Link>
        ))}
      </div>
      <div className={`price-switch desktop-only ${styles.priceOptions}`} role="group" aria-label="Тип цены">
        <button type="button" aria-pressed={mode === "retail"} onClick={() => setMode("retail")}>Розница</button>
        <button type="button" aria-pressed={mode === "wholesale"} onClick={() => setMode("wholesale")}>Опт</button>
      </div>
      <div className={styles.cards}>
        {featured.map((batch, index) => (
          <div key={batch.id} className={index > 1 ? "desktop-only" : undefined}>
            <ProductCard batch={batch} mode={mode} home />
          </div>
        ))}
      </div>
      <p className={`desktop-only ${styles.disclaimer}`}>Наличие и цены уточняйте перед заказом. Фотографии иллюстративные.</p>
    </section>
  );
}
