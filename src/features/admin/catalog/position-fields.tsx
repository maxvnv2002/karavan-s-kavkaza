import { Fields, Input, Select, Textarea } from "../admin-ui";
import { displayDate, type CatalogPosition, type CatalogProduct, type Category, type Slaughter } from "./catalog-model";

export type SetField<T> = <K extends keyof T>(key: K, value: T[K]) => void;

export function ProductFields({ value, categories, field }: { value: CatalogProduct; categories: Category[]; field: SetField<CatalogProduct> }) {
  const category = categories.find((item) => item.id === value.categoryId);
  const section = category?.parentId || category?.id;
  const children = categories.filter((item) => item.parentId === section);

  return (
    <>
      <Input label="Название товара" value={value.name} onChange={(event) => {
        const name = event.target.value;
        field("name", name);
        field("shortName", name);
      }} required maxLength={120} />
      <Fields>
        <Select label="Раздел" value={section ?? ""} onChange={(event) => {
          const id = event.target.value;
          field("categoryId", categories.find((item) => item.parentId === id)?.id ?? id);
        }} options={categories.filter((item) => !item.parentId).map((item) => [item.id, item.name])} />
        <Select label="Категория" value={value.categoryId} onChange={(event) => field("categoryId", event.target.value)} options={(children.length ? children : category ? [category] : []).map((item) => [item.id, item.name])} />
      </Fields>
      <Fields>
        <Input label="Артикул" value={value.code} onChange={(event) => field("code", event.target.value)} required maxLength={40} />
        <Select label="Единица продажи" value={value.unit} onChange={(event) => field("unit", event.target.value)} options={[["кг", "кг"], ["шт.", "шт."]]} />
      </Fields>
      <Textarea label="Описание" value={value.description} onChange={(event) => field("description", event.target.value)} rows={1} maxLength={1100} className="admin-product-description" />
    </>
  );
}

export function SlaughterField({ value, slaughters, field }: { value: CatalogPosition; slaughters: Slaughter[]; field: SetField<CatalogPosition> }) {
  return <Select label="Забой" value={value.slaughterId} onChange={(event) => field("slaughterId", event.target.value)} options={slaughters.map((entry) => [entry.id, `${displayDate(entry.date)}, ${entry.time}`])} />;
}

export function NumberField({ label, fieldKey, value, field, min = 0 }: {
  label: string; fieldKey: "retail" | "wholesale" | "stock" | "retailMin" | "wholesaleMin";
  value: CatalogPosition; field: SetField<CatalogPosition>; min?: number;
}) {
  return <Input label={label} type="number" value={value[fieldKey]} onChange={(event) => field(fieldKey, Number(event.target.value))} min={min} step="any" required />;
}

export function VisibilityField({ value, field, mobile = false }: { value: CatalogPosition; field: SetField<CatalogPosition>; mobile?: boolean }) {
  return <Select label={mobile ? "Видимость позиции" : "Показывать позицию"} value={value.visible ? "yes" : "no"} onChange={(event) => field("visible", event.target.value === "yes")} options={[["yes", mobile ? "Показывать" : "Включено"], ["no", mobile ? "Скрывать" : "Выключено"]]} />;
}

export function ExpiryField({ value, field, mobile = false }: { value: CatalogPosition; field: SetField<CatalogPosition>; mobile?: boolean }) {
  return <Input label={mobile ? "Годен до" : "Годен до · дата и время"} value={value.expiry} onChange={(event) => field("expiry", event.target.value)} placeholder="ДД.ММ.ГГГГ, ЧЧ:ММ" required={value.visible} maxLength={24} />;
}

export function StorageField({ value, field, mobile = false }: { value: CatalogPosition; field: SetField<CatalogPosition>; mobile?: boolean }) {
  return <Input label={mobile ? "Хранение" : "Режим хранения"} value={value.storage} onChange={(event) => field("storage", event.target.value)} maxLength={100} required={value.visible} />;
}
