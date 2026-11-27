import { useState } from "react";
import { Button, Confirm, Input, Note, Notice, Panel, Select } from "../admin-ui";
import { useAdminDraft } from "../use-admin-draft";
import { AdminValidationError, useAdminSave } from "../use-admin-save";
import { Cell, EditDialog, RowActions, Table, formText } from "./catalog-controls";
import type { CatalogData, Category } from "./catalog-model";
import { catalogStore } from "./catalog-store";
import styles from "./catalog.module.css";

const headers = ["Категория", "Родитель", "На сайте", "Позиций", "Порядок", "Действия"];

export function CategoriesPanel({ data }: { data: CatalogData }) {
  const { value: categories, setDraft, reset } = useAdminDraft(data.categories);
  const [editing, setEditing] = useState<Category | null>();
  const [deleting, setDeleting] = useState<Category>();
  const { save, notice } = useAdminSave();

  function move(category: Category, direction: number) {
    const siblings = categories.filter((item) => item.parentId === category.parentId);
    const sibling = siblings[siblings.indexOf(category) + direction];
    if (sibling) setDraft(categories.map((item) => item === category ? sibling : item === sibling ? category : item));
  }

  function persist() {
    if (save(() => catalogStore.update((latest) => {
      if (latest.products.some((product) => !categories.some((item) => item.id === product.categoryId))) {
        throw new AdminValidationError("Сначала перенесите товары из удаляемой категории.");
      }
      return { ...latest, categories };
    }))) reset();
  }

  return (
    <Panel id="categories">
      <div className={styles.splitHeading}><h2>Категории</h2><Button onClick={persist}>Сохранить изменения</Button></div>
      <div>
        <Table headers={headers}>
          {categories.map((item) => {
            const products = data.products.filter((product) => product.categoryId === item.id
              || categories.some((child) => child.parentId === item.id && child.id === product.categoryId));
            const count = data.positions.filter((position) => products.some((product) => product.id === position.productId)).length;
            const parent = categories.find((candidate) => candidate.id === item.parentId);
            return (
              <tr key={item.id}>
                <Cell label={headers[0]}><span style={parent ? { paddingLeft: 8 } : undefined}>{item.name}</span></Cell>
                <Cell label={headers[1]}>{parent?.name ?? "—"}</Cell>
                <Cell label={headers[2]}>{item.visible && parent?.visible !== false ? "Показывать" : "Скрыто"}</Cell>
                <Cell label={headers[3]}>{count}</Cell>
                <Cell label={headers[4]}><span className={styles.order}>
                  <button type="button" className="text-button" aria-label={`Выше: ${item.name}`} onClick={() => move(item, -1)}>↑</button>
                  <button type="button" className="text-button" aria-label={`Ниже: ${item.name}`} onClick={() => move(item, 1)}>↓</button>
                </span></Cell>
                <Cell label={headers[5]}><RowActions>
                  <button type="button" className="text-button" onClick={() => setEditing(item)}>Изменить</button>
                  <button type="button" className="text-button" onClick={() => setDraft(categories.map((category) => category === item ? { ...item, visible: !item.visible } : category))}>{item.visible ? "Скрыть" : "Показать"}</button>
                  <button type="button" className="text-button" onClick={() => setDeleting(item)}>Удалить</button>
                </RowActions></Cell>
              </tr>
            );
          })}
        </Table>
        <button type="button" className={`text-button ${styles.addRow}`} onClick={() => setEditing(null)}>+ Добавить категорию</button>
      </div>
      <Note className={styles.small}>Удаление категории не удаляет товары. Перед удалением назначьте им другую категорию. Скрытая категория и её дочерние разделы не показываются на сайте.</Note>
      <Notice {...notice} />
      {editing !== undefined && (
        <EditDialog title={editing ? "Изменить категорию" : "Добавить категорию"} close={() => setEditing(undefined)} onSave={(form) => {
          const name = formText(form, "name");
          const parentId = formText(form, "parent");
          if (!name) throw new AdminValidationError("Введите название категории.");
          if (categories.some((item) => item.id !== editing?.id && item.parentId === parentId && item.name.toLocaleLowerCase("ru") === name.toLocaleLowerCase("ru"))) {
            throw new AdminValidationError("В этом разделе уже есть категория с таким названием.");
          }
          const next = { id: editing?.id ?? crypto.randomUUID(), name, parentId, visible: editing?.visible ?? true };
          setDraft(editing ? categories.map((item) => item === editing ? next : item) : [...categories, next]);
        }}>
          <Input label="Название категории" name="name" defaultValue={editing?.name} maxLength={80} required autoFocus />
          <Select label="Родитель" name="parent" defaultValue={editing?.parentId ?? ""} disabled={!!editing && categories.some((item) => item.parentId === editing.id)} options={[["", "Без родителя"], ...categories.filter((item) => !item.parentId && item !== editing).map((item) => [item.id, item.name] as const)]} />
        </EditDialog>
      )}
      {deleting && (
        <Confirm title={`Удалить категорию «${deleting.name}»?`} close={() => setDeleting(undefined)} confirm={() => {
          if (data.products.some((item) => item.categoryId === deleting.id) || categories.some((item) => item.parentId === deleting.id)) {
            save(() => { throw new AdminValidationError("Сначала перенесите товары и дочерние категории."); });
          } else {
            setDraft(categories.filter((item) => item !== deleting));
          }
          setDeleting(undefined);
        }}>Удаление вступит в силу после сохранения изменений.</Confirm>
      )}
    </Panel>
  );
}
