import { Input, Select } from "../admin-ui";
import { EditDialog, formText } from "./catalog-controls";
import { displayDate, type CatalogData, type CatalogPosition, type CatalogProduct } from "./catalog-model";
import { addPosition } from "./catalog-store";

export function NewProductDialog({ data, close, onAdd }: { data: CatalogData; close: () => void; onAdd: (id: string) => void }) {
  return (
    <EditDialog title="Добавить товар" close={close} onSave={(form) => {
      const name = formText(form, "name");
      const product = { id: crypto.randomUUID(), name, shortName: name, categoryId: formText(form, "category"), code: formText(form, "code"), description: "", unit: "кг" };
      onAdd(addPosition(product, formText(form, "slaughter")));
    }}>
      <Input label="Название товара" name="name" maxLength={120} required />
      <Input label="Артикул" name="code" maxLength={40} required />
      <Select label="Категория" name="category" options={data.categories.map((item) => [item.id, item.name])} required />
      <Select label="Забой" name="slaughter" options={data.slaughters.map((item) => [item.id, displayDate(item.date)])} required />
    </EditDialog>
  );
}

export function OtherSlaughterDialog({ data, product, position, close, onAdd }: {
  data: CatalogData; product: CatalogProduct; position: CatalogPosition; close: () => void; onAdd: (id: string) => void;
}) {
  const available = data.slaughters.filter((slaughter) => !data.positions.some((item) => item.productId === product.id && item.slaughterId === slaughter.id));
  return (
    <EditDialog title="Добавить партию в другой забой" close={close} onSave={(form) => onAdd(addPosition(product, formText(form, "slaughter"), position))}>
      <Select label="Забой" name="slaughter" required options={available.length ? available.map((item) => [item.id, displayDate(item.date)]) : [["", "Нет доступных забоев"]]} />
    </EditDialog>
  );
}

export function AddToSlaughterDialog({ data, slaughterId, close, onAdd }: { data: CatalogData; slaughterId: string; close: () => void; onAdd: (id: string) => void }) {
  const available = data.products.filter((item) => !data.positions.some((position) => position.productId === item.id && position.slaughterId === slaughterId));
  return (
    <EditDialog title="Добавить товар в забой" close={close} onSave={(form) => {
      const product = available.find((item) => item.id === formText(form, "product"));
      if (product) onAdd(addPosition(product, slaughterId, data.positions.find((item) => item.productId === product.id)));
    }}>
      <Select label="Товар" name="product" required options={available.length ? available.map((item) => [item.id, item.name]) : [["", "Все товары уже добавлены"]]} />
    </EditDialog>
  );
}
