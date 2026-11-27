"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RequestCounter } from "../admin-shell";
import { AdminMain, Button, Heading, Note } from "../admin-ui";
import { catalogHref, slaughterHref } from "./catalog-controls";
import { dateTitle, displayDate, positionContext, pricePreview, type CatalogData, type CatalogPosition, type Slaughter } from "./catalog-model";
import { useAdminCatalog } from "./catalog-store";
import { AddToSlaughterDialog } from "./position-dialogs";
import { SlaughterDialog } from "./slaughter-dialog";
import { SlaughterPositionForm } from "./slaughter-position-form";
import styles from "./slaughter.module.css";

export function SlaughterEditor({ id, selectedId }: { id: string; selectedId?: string }) {
  const data = useAdminCatalog();
  const slaughter = data.slaughters.find((item) => item.id === id);
  if (!slaughter) return <AdminMain><Heading title="Забой не найден" /><Link href={`${catalogHref}#slaughters`}>Все забои</Link></AdminMain>;
  return <Editor data={data} slaughter={slaughter} selectedId={selectedId} />;
}

function Editor({ data, slaughter, selectedId }: { data: CatalogData; slaughter: Slaughter; selectedId?: string }) {
  const [modal, setModal] = useState<"edit" | "add">();
  const [dirty, setDirty] = useState(false);
  const router = useRouter();
  const positions = data.positions.filter((item) => item.slaughterId === slaughter.id);
  const selected = positions.find((item) => item.id === selectedId) ?? positions[0];
  const date = displayDate(slaughter.date);

  return (
    <AdminMain className={styles.main}>
      <div className="mobile-only"><RequestCounter link /></div>
      <p className={styles.crumb}>Каталог / Забои / {date}</p>
      <h1>Забой <br className="mobile-only" />{dateTitle(slaughter.date)}</h1>
      <div className={styles.links}><Link href={`${catalogHref}#slaughters`}>Все забои</Link><span>{dirty ? "Есть изменения" : "Сохранено"}</span></div>
      <section className={styles.section}>
        <h2>Параметры забоя</h2>
        <Note className={styles.small}>
          {slaughter.status === "done" ? "Проведён" : "Планируется"} · {date}, {slaughter.time}<br />
          Публикация {slaughter.visible ? "включена" : "выключена"} · {slaughter.discount ? `скидка ${slaughter.discount}%` : "автоскидка"}<br />
          Ручная скидка заменяет возрастную.
        </Note>
        <Button width="100%" onClick={() => setModal("edit")}>Редактировать забой</Button>
      </section>
      <section className={styles.section}>
        <h2>Товары забоя · {positions.length}</h2>
        {positions.map((position) => <PositionSummary key={position.id} data={data} position={position} selectedId={selected?.id} />)}
        {!positions.length && <Note>В этом забое пока нет товаров.</Note>}
        <Button width="100%" onClick={() => setModal("add")}>+ Добавить товар в забой</Button>
      </section>
      {selected && <SlaughterPositionForm key={selected.id} data={data} saved={selected} setDirty={setDirty} />}
      <Note className={styles.footer}>
        <Link href={catalogHref}>Каталог</Link> · <Link href={`${catalogHref}#slaughters`}>Забои</Link> · <Link href={`${catalogHref}#categories`}>Категории</Link> · <Link href={`${catalogHref}#discounts`}>Автоскидки</Link><br />
        <Link href="/admin/content">Содержимое сайта</Link>
      </Note>
      {modal === "edit" && <SlaughterDialog item={slaughter} close={() => setModal(undefined)} />}
      {modal === "add" && <AddToSlaughterDialog data={data} slaughterId={slaughter.id} close={() => setModal(undefined)} onAdd={(id) => router.push(`${slaughterHref(slaughter.id)}?position=${id}#position-editor`)} />}
    </AdminMain>
  );
}

function PositionSummary({ data, position, selectedId }: { data: CatalogData; position: CatalogPosition; selectedId?: string }) {
  const product = positionContext(data, position).product;
  const price = pricePreview(data, position);
  const selected = position.id === selectedId;
  return (
    <>
      <p>{product?.name} · {price.visible ? "на сайте" : "скрыта"}<br />Остаток {position.stock} кг · {position.expiry ? `до ${position.expiry.replace(/\.\d{4},/, ",")}` : "срок не указан"}<br />
        Розница {price.retail} ₽/кг · опт {price.wholesale} ₽ от {position.wholesaleMin} кг
      </p>
      <Link className={styles.crumb} href={selected ? "#position-editor" : `${slaughterHref(position.slaughterId)}?position=${position.id}#position-editor`}>
        {selected ? "К форме редактирования" : "Редактировать"}
      </Link>
    </>
  );
}
