"use client";

import { useState } from "react";
import { AdminMain, Button, Heading, Panel } from "../admin-ui";
import { displayDate, slaughterSchedule } from "../catalog/catalog-model";
import { useAdminCatalog } from "../catalog/catalog-store";
import { ProductionEditor } from "./production-editor";
import { SiteCopyEditor } from "./site-copy-editor";
import styles from "./content.module.css";

export function ContentDashboard() {
  const [busy, setBusy] = useState(false);
  const { slaughters } = useAdminCatalog();
  const { latest, next } = slaughterSchedule(slaughters);

  return (
    <AdminMain className={styles.main}>
      <Heading title="Содержимое сайта" actions={<Button width={192} type="submit" form="site-copy-form" disabled={busy}>{busy ? "Сохраняем…" : "Сохранить тексты"}</Button>} />
      <SiteCopyEditor onBusy={setBusy} />
      <Panel>
        <h2>График забоев</h2>
        <p>Изменить график можно в разделе <a href="/admin/catalog#slaughters">«Забои»</a>.</p>
        <p className={styles.green}>Последний забой: {latest ? displayDate(latest.date) : "не указан"}. Следующий забой: {next ? displayDate(next.date) : "не запланирован"}.</p>
      </Panel>
      <ProductionEditor />
    </AdminMain>
  );
}
