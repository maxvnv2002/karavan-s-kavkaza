"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Actions, AdminMain, Button, Confirm, Fields, Heading, Note, Notice, Panel, Select } from "../admin-ui";
import { useAdminDraft } from "../use-admin-draft";
import { useAdminSave } from "../use-admin-save";
import { catalogHref, positionHref, slaughterHref } from "./catalog-controls";
import { displayDate, positionContext, pricePreview, type CatalogData, type CatalogPosition, type CatalogProduct } from "./catalog-model";
import { catalogStore, savePosition, useAdminCatalog } from "./catalog-store";
import { ExpiryField, NumberField, ProductFields, SlaughterField, StorageField, VisibilityField } from "./position-fields";
import { OtherSlaughterDialog } from "./position-dialogs";
import { PositionSidebar } from "./position-sidebar";
import styles from "./position.module.css";

export function PositionEditor() {
  const id = useSearchParams().get("id");
  const data = useAdminCatalog();
  const position = data.positions.find((item) => item.id === id);
  const product = position && positionContext(data, position).product;
  if (!position || !product) return <AdminMain><Heading title="Партия не найдена" /><Link href={catalogHref}>К каталогу</Link></AdminMain>;
  return <Editor key={id} data={data} saved={position} savedProduct={product} />;
}

function Editor({ data, saved, savedProduct }: { data: CatalogData; saved: CatalogPosition; savedProduct: CatalogProduct }) {
  const router = useRouter();
  const position = useAdminDraft(saved);
  const product = useAdminDraft(savedProduct);
  const { save, notice } = useAdminSave();
  const [action, setAction] = useState<"add" | "position" | "product">();
  const { slaughter } = positionContext(data, position.value);
  const date = slaughter?.date ?? "";
  const preview = pricePreview(data, position.value, product.value);
  const dirty = position.dirty || product.dirty;
  const reset = () => { position.reset(); product.reset(); };

  function remove(scope: "position" | "product") {
    if (save(() => catalogStore.update((current) => ({
      ...current,
      products: scope === "product" ? current.products.filter((item) => item.id !== savedProduct.id) : current.products,
      positions: current.positions.filter((item) => scope === "product" ? item.productId !== savedProduct.id : item.id !== saved.id),
    })))) router.push(catalogHref);
    else setAction(undefined);
  }

  return (
    <AdminMain className={styles.editor}>
      <form className={styles.form} onSubmit={(event) => {
        event.preventDefault();
        if (save(() => savePosition(position.value, product.dirty ? product.value : undefined))) reset();
      }}>
        <Link className={styles.back} href={catalogHref}>К каталогу</Link>
        <Heading title={`${product.value.shortName} · партия ${displayDate(date)}`} note={`Арт. ${product.value.code}`} actions={
          <Actions><button type="button" className={`text-button ${styles.quiet}`} onClick={reset}>Отменить</button><Button width={192} type="submit">Сохранить изменения</Button></Actions>
        } />
        <div className={styles.columns}>
          <div className={styles.stack}>
            <Panel id="product-data">
              <h3>Общие данные товара</h3><Note>Изменения затронут все партии товара.</Note>
              <ProductFields value={product.value} field={product.field} categories={data.categories} />
            </Panel>
            <Panel>
              <h3>Партия от {displayDate(date)}</h3>
              <SlaughterField value={position.value} field={position.field} slaughters={data.slaughters} />
              <Fields><NumberField label="Остаток, кг" fieldKey="stock" {...position} /><VisibilityField {...position} /></Fields>
              <Fields><ExpiryField {...position} /><StorageField {...position} /></Fields>
              <Note className={styles.small}>У полуфабриката дата изготовления и срок годности задаются отдельно от даты забоя сырья.</Note>
            </Panel>
            <Panel>
              <h3>Цены этой партии</h3>
              <Fields><NumberField label="Розница, ₽ / кг" fieldKey="retail" {...position} /><NumberField label="Мелкий опт, ₽ / кг" fieldKey="wholesale" {...position} /></Fields>
              <Fields><NumberField label="Минимум розницы, кг" fieldKey="retailMin" min={0.01} {...position} /><NumberField label="Минимум мелкого опта, кг" fieldKey="wholesaleMin" min={0.01} {...position} /></Fields>
              <Select label="Источник скидки" value={position.value.discount} onChange={(event) => position.field("discount", event.target.value === "none" ? "none" : "inherit")}
                options={[["inherit", preview.manual === undefined ? "Наследовать скидку забоя" : `Наследовать скидку забоя · ${preview.manual}%`], ["none", "Без скидки"]]} />
              {preview.manual !== undefined && <Note className={styles.small}>Ручная скидка заменяет возрастную.</Note>}
            </Panel>
          </div>
          <PositionSidebar data={data} product={product.value} position={position.value} add={() => setAction("add")} remove={setAction} />
        </div>
        <div className={styles.saveBar}>
          <div>
            <p>{dirty ? "Есть несохранённые изменения" : "Все изменения сохранены"}</p>
            <Notice {...notice} />
          </div>
          <Button width={192} type="submit">Сохранить изменения</Button>
        </div>
        {slaughter && <Link className="mobile-only" href={slaughterHref(slaughter.id)}>Открыть забой</Link>}
      </form>
      {action === "add" && <OtherSlaughterDialog data={data} product={savedProduct} position={saved} close={() => setAction(undefined)} onAdd={(id) => router.push(positionHref(id))} />}
      {(action === "position" || action === "product") && (
        <Confirm title={action === "product" ? "Удалить товар во всех партиях?" : "Убрать товар из этого забоя?"} close={() => setAction(undefined)} confirm={() => remove(action)}>
          {action === "product" ? "Удалятся товар и все его партии." : "Удалится выбранная партия. Общие данные товара сохранятся."}
        </Confirm>
      )}
    </AdminMain>
  );
}
