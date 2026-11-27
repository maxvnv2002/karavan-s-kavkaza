"use client";

import Link from "next/link";
import { site } from "@/lib/site";
import { AdminMain, Button, Heading, Note, Notice, Panel } from "../admin-ui";
import { useResource } from "../local-resource";
import { useAdminSave } from "../use-admin-save";
import { copyStore } from "../content/content-store";
import { StoreEditor } from "./store-editor";
import { emptyStore } from "./stores-model";
import { storesResource } from "./stores-store";
import styles from "./stores.module.css";

export function StoresDashboard() {
  const stores = useResource(storesResource);
  const { values } = useResource(copyStore);
  const sorted = [...stores].sort((a, b) => Number(a.order) - Number(b.order));
  const published = sorted.filter((item) => item.published);
  const { save, notice } = useAdminSave();

  function add() {
    const id = crypto.randomUUID();
    if (save(() => storesResource.update((current) => [
      ...current, { ...emptyStore, id, order: String(Math.max(0, ...current.map((item) => Number(item.order))) + 1) },
    ]))) requestAnimationFrame(() => document.getElementById(`store-${id}`)?.scrollIntoView());
  }

  return (
    <AdminMain className={styles.main}>
      <Heading title="Розничные магазины" />
      <Panel variant="wide">
        <h2>{published.length ? `Отмечено для публикации · ${published.length}` : "Магазинов к публикации пока нет"}</h2>
        {!!published.length && <ul>{published.map((item) => <li key={item.id}><a href={`#store-${item.id}`}>{item.name} · {item.address}</a></li>)}</ul>}
        <Button onClick={add}>+ Добавить магазин</Button>
        <Notice {...notice} />
      </Panel>
      {sorted.map((item, index) => <StoreEditor key={item.id} item={item} index={index} />)}
      <Panel variant="wide">
        <h3>Самовывоз с фабрики</h3>
        <Note>{values.address || site.address}. Изменить адрес самовывоза можно в разделе <Link href="/admin/content">«Содержимое сайта»</Link>.</Note>
      </Panel>
    </AdminMain>
  );
}
