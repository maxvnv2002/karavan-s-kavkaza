import { useState } from "react";
import { Actions, Button, Confirm, Fields, Input, Note, Notice, Panel, Select } from "../admin-ui";
import { useAdminDraft } from "../use-admin-draft";
import { AdminValidationError, useAdminSave } from "../use-admin-save";
import { Cell, EditDialog, RowActions, Table, formText } from "./catalog-controls";
import type { CatalogData, DiscountRule } from "./catalog-model";
import { catalogStore } from "./catalog-store";
import styles from "./catalog.module.css";

const headers = ["Возраст партии", "Скидка", "Применение", "Состояние", "Приоритет", "Управление"];

export function DiscountsPanel({ saved }: { saved: CatalogData["discounts"] }) {
  const { value, field, reset } = useAdminDraft(saved);
  const [editing, setEditing] = useState<DiscountRule | null>();
  const [deleting, setDeleting] = useState<DiscountRule>();
  const { save, notice } = useAdminSave();

  return (
    <Panel id="discounts">
      <h2>Скидки по возрасту партии</h2>
      <Fields columns={3}>
        <Select label="Автоматические скидки" value={value.active ? "yes" : "no"} onChange={(event) => field("active", event.target.value === "yes")} options={[["yes", "Включены"], ["no", "Выключены"]]} />
        <Select label="Область применения" options={[["done", "Все проведённые забои"]]} />
        <Input label="Отсчёт возраста" value="Полные сутки с даты и времени" readOnly />
      </Fields>
      <Table headers={headers}>
        {value.rules.map((item) => (
          <tr key={item.id}>
            <Cell label={headers[0]}>С {item.days} полных суток</Cell><Cell label={headers[1]}>{item.percent}%</Cell><Cell label={headers[2]}>Розница + опт</Cell>
            <Cell label={headers[3]}>{value.active && item.active ? "Включено" : "Выключено"}</Cell><Cell label={headers[4]}>Если нет ручной</Cell>
            <Cell label={headers[5]}><RowActions><button type="button" className="text-button" onClick={() => setEditing(item)}>Править</button><button type="button" className="text-button" onClick={() => setDeleting(item)}>Удалить</button></RowActions></Cell>
          </tr>
        ))}
        {!value.rules.length && <tr><td colSpan={headers.length}>Ступеней пока нет.</td></tr>}
      </Table>
      <Actions>
        <Button onClick={() => setEditing(null)}>+ Добавить ступень</Button>
        <Button onClick={() => { if (save(() => catalogStore.update((data) => ({ ...data, discounts: value })))) reset(); }}>Сохранить автоскидки</Button>
      </Actions>
      <Note className={styles.small}>Берётся последняя достигнутая ступень. Скидка забоя, если задана, заменяет возрастную. Округление — до 1 ₽, время — по часовому поясу производства. Просроченные позиции скрываются, скидка не продлевает срок годности.</Note>
      <Notice {...notice} />
      {editing !== undefined && (
        <EditDialog title={editing ? "Править ступень" : "Добавить ступень"} close={() => setEditing(undefined)} onSave={(form) => {
          const days = Number(formText(form, "days"));
          if (value.rules.some((item) => item.id !== editing?.id && item.days === days)) throw new AdminValidationError("Ступень с таким возрастом уже существует.");
          const next = { id: editing?.id ?? crypto.randomUUID(), days, percent: Number(formText(form, "percent")), active: form.get("active") === "yes" };
          field("rules", [...value.rules.filter((item) => item !== editing), next].sort((a, b) => a.days - b.days));
        }}>
          <Input label="Возраст партии, полных суток" name="days" type="number" min="1" defaultValue={editing?.days} required autoFocus />
          <Input label="Скидка, %" name="percent" type="number" min="1" max="100" defaultValue={editing?.percent} required />
          <Select label="Состояние" name="active" defaultValue={editing?.active === false ? "no" : "yes"} options={[["yes", "Включено"], ["no", "Выключено"]]} />
        </EditDialog>
      )}
      {deleting && <Confirm title="Удалить ступень скидки?" close={() => setDeleting(undefined)} confirm={() => { field("rules", value.rules.filter((item) => item !== deleting)); setDeleting(undefined); }}>Изменение вступит в силу после сохранения автоскидок.</Confirm>}
    </Panel>
  );
}
