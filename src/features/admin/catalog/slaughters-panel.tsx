import Link from "next/link";
import { useState } from "react";
import { Button, Confirm, Note, Notice, Panel } from "../admin-ui";
import { useAdminSave } from "../use-admin-save";
import { Cell, RowActions, Table, slaughterHref } from "./catalog-controls";
import { displayDate, slaughterSchedule, type CatalogData, type Slaughter } from "./catalog-model";
import { catalogStore } from "./catalog-store";
import { SlaughterDialog } from "./slaughter-dialog";
import styles from "./catalog.module.css";

const headers = ["Дата забоя", "Время", "Статус", "Скидка остаткам", "На сайте", "Управление"];

export function SlaughtersPanel({ data }: { data: CatalogData }) {
  const [editing, setEditing] = useState<Slaughter | null>();
  const [deleting, setDeleting] = useState<Slaughter>();
  const { save, notice } = useAdminSave();
  const { latest, next } = slaughterSchedule(data.slaughters);

  return (
    <Panel id="slaughters">
      <div className={styles.splitHeading}><h2>Забои</h2><Button width={228} onClick={() => setEditing(null)}>+ Создать забой</Button></div>
      <Table headers={headers}>
        {data.slaughters.map((item) => (
          <tr key={item.id}>
            <Cell label={headers[0]}>{displayDate(item.date)}</Cell><Cell label={headers[1]}>{item.time}</Cell>
            <Cell label={headers[2]}>{item.status === "done" ? "Проведён" : "Планируется"}</Cell>
            <Cell label={headers[3]}>{item.status === "planned" ? "Не применяется" : item.discount ? `${item.discount}% на весь забой` : "Автоскидка"}</Cell>
            <Cell label={headers[4]}>{!item.visible ? "Выключена" : item.status === "planned" ? "Только дата" : "Включена"}</Cell>
            <Cell label={headers[5]}>
              <RowActions>
                <Link href={slaughterHref(item.id)}>Открыть</Link>
                <button className="text-button" type="button" onClick={() => setEditing(item)}>Править</button>
                <button className="text-button" type="button" onClick={() => setDeleting(item)}>Удалить</button>
              </RowActions>
            </Cell>
          </tr>
        ))}
        {!data.slaughters.length && <tr><td colSpan={headers.length}>Забоев пока нет.</td></tr>}
      </Table>
      <Note className={styles.small}>Последний: {latest ? displayDate(latest.date) : "—"} — из проведённых забоев. Следующий: {next ? displayDate(next.date) : "—"} — ближайший плановый. Плановые товары не продаются.</Note>
      <Notice {...notice} />
      {editing !== undefined && <SlaughterDialog item={editing ?? undefined} close={() => setEditing(undefined)} />}
      {deleting && (
        <Confirm title={`Удалить забой ${displayDate(deleting.date)}?`} close={() => setDeleting(undefined)} confirm={() => {
          const id = deleting.id;
          save(() => catalogStore.update((current) => ({
            ...current, slaughters: current.slaughters.filter((item) => item.id !== id), positions: current.positions.filter((item) => item.slaughterId !== id),
          })), "Забой удалён");
          setDeleting(undefined);
        }}>Партии этого забоя удалятся. Товары останутся в справочнике.</Confirm>
      )}
    </Panel>
  );
}
