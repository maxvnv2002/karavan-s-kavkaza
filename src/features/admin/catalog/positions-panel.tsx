import Link from "next/link";
import { useState } from "react";
import { Fields, Input, Panel, Select } from "../admin-ui";
import { Cell, EditDialog, RowActions, Table, formText, positionHref } from "./catalog-controls";
import { displayDate, positionContext, pricePreview, shortDate, type CatalogData, type CatalogPosition } from "./catalog-model";
import { catalogStore } from "./catalog-store";

const headers = ["Товар / категория", "Забой", "Розница / кг", "Мелкий опт / кг", "Остаток", "На сайте / действие"];

export function PositionsPanel({ data }: { data: CatalogData }) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategory] = useState("");
  const [slaughterId, setSlaughter] = useState("");
  const [editing, setEditing] = useState<CatalogPosition>();
  const search = query.trim().toLocaleLowerCase("ru");
  const rows = data.positions.flatMap((position) => {
    const { product, slaughter, category, parent } = positionContext(data, position);
    if (!product || !slaughter || (categoryId && category?.id !== categoryId && parent?.id !== categoryId)
      || (slaughterId && position.slaughterId !== slaughterId)
      || !`${product.name} ${product.code}`.toLocaleLowerCase("ru").includes(search)) return [];
    return [{ position, product, slaughter, category }];
  });

  return (
    <Panel id="positions">
      <Fields columns={3}>
        <Input label="Поиск" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Название или артикул" />
        <Select label="Категория" value={categoryId} onChange={(event) => setCategory(event.target.value)} options={[["", "Все категории"], ...data.categories.map((item) => [item.id, item.name] as const)]} />
        <Select label="Забой" value={slaughterId} onChange={(event) => setSlaughter(event.target.value)} options={[["", "Все забои"], ...data.slaughters.map((item) => [item.id, displayDate(item.date)] as const)]} />
      </Fields>
      <Table headers={headers}>
        {rows.map(({ position, product, slaughter, category }) => {
          const price = pricePreview(data, position);
          return (
            <tr key={position.id}>
              <Cell label={headers[0]}>{product.shortName} · {category?.name ?? "Без категории"}</Cell>
              <Cell label={headers[1]}>{category?.id === "prepared" ? `${shortDate(slaughter.date)} · сырьё` : displayDate(slaughter.date)}</Cell>
              <Cell label={headers[2]}><span>{price.retail} ₽ {price.percent > 0 && <><del>{position.retail} ₽</del> · −{price.percent}%</>}</span></Cell>
              <Cell label={headers[3]}><span>{price.wholesale} ₽ {price.percent > 0 && <del>{position.wholesale} ₽</del>} · от {position.wholesaleMin} кг</span></Cell>
              <Cell label={headers[4]}><button className="text-button" type="button" aria-label={`Изменить остаток: ${product.name}, ${displayDate(slaughter.date)}`} onClick={() => setEditing(position)}>{position.stock} кг · изм.</button></Cell>
              <Cell label={headers[5]}><RowActions><span>{price.visible ? "На сайте" : "Скрыта"}</span><Link href={positionHref(position.id)}>Редактировать</Link></RowActions></Cell>
            </tr>
          );
        })}
        {!rows.length && <tr><td colSpan={headers.length}>Позиции не найдены.</td></tr>}
      </Table>
      {editing && (
        <EditDialog title="Изменить остаток" close={() => setEditing(undefined)} onSave={(form) => {
          const stock = Number(formText(form, "stock"));
          catalogStore.update((current) => ({ ...current, positions: current.positions.map((item) => item.id === editing.id ? { ...item, stock } : item) }));
        }}>
          <Input label="Остаток, кг" name="stock" type="number" min={0} step="any" defaultValue={editing.stock} required autoFocus />
        </EditDialog>
      )}
    </Panel>
  );
}
