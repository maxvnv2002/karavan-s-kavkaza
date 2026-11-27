"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminMain, Button, Heading } from "../admin-ui";
import { CategoriesPanel } from "./categories-panel";
import { DiscountsPanel } from "./discounts-panel";
import { NewProductDialog } from "./position-dialogs";
import { PositionsPanel } from "./positions-panel";
import { SlaughtersPanel } from "./slaughters-panel";
import { useAdminCatalog } from "./catalog-store";
import { positionHref } from "./catalog-controls";
import styles from "./catalog.module.css";

export function CatalogDashboard() {
  const data = useAdminCatalog();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  return (
    <AdminMain className={styles.catalog}>
      <Heading title="Каталог и партии" note={`Позиций в каталоге: ${data.positions.length}`} actions={<Button width={220} onClick={() => setAdding(true)}>Добавить товар</Button>} />
      <nav className={styles.tabs} aria-label="Разделы каталога">
        <a href="#positions">Позиции на сайте</a><a href="#slaughters">Забои</a><a href="#categories">Категории</a><a href="#discounts">Автоскидки</a>
      </nav>
      <PositionsPanel data={data} />
      <SlaughtersPanel data={data} />
      <h2 className={styles.settings}>Настройки каталога</h2>
      <DiscountsPanel saved={data.discounts} />
      <CategoriesPanel data={data} />
      {adding && <NewProductDialog data={data} close={() => setAdding(false)} onAdd={(id) => router.push(positionHref(id))} />}
    </AdminMain>
  );
}
