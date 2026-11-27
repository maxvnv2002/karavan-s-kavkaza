import { Children, type FormEvent, type ReactNode } from "react";
import { Actions, Button, Dialog, Notice } from "../admin-ui";
import { useAdminSave } from "../use-admin-save";
import styles from "./catalog.module.css";

export const catalogHref = "/admin/catalog";
export const positionHref = (id: string) => `${catalogHref}/products?${new URLSearchParams({ id })}`;
export function slaughterHref(id: string, position?: string) {
  const params = new URLSearchParams({ id });
  if (position) params.set("position", position);
  return `${catalogHref}/slaughters?${params}`;
}
export const formText = (data: FormData, name: string) => String(data.get(name) ?? "").trim();

export function EditDialog({ title, children, close, onSave }: {
  title: string; children: ReactNode; close: () => void; onSave: (data: FormData) => void;
}) {
  const { save, notice } = useAdminSave();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (save(() => onSave(data))) close();
  }

  return (
    <Dialog title={title} close={close}>
      <form className={styles.stack} onSubmit={submit}>
        {children}
        <Notice {...notice} />
        <Actions><Button width={160} type="submit">Сохранить</Button><Button width={160} className="button--outline" onClick={close}>Отменить</Button></Actions>
      </form>
    </Dialog>
  );
}

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <table className={styles.table} role="table">
      <thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function Cell({ label, children }: { label: string; children: ReactNode }) {
  return <td data-label={label}>{children}</td>;
}

export function RowActions({ children }: { children: ReactNode }) {
  return <span className={styles.rowActions}>{Children.map(children, (child, index) => <>{index > 0 && <span aria-hidden="true">·</span>}{child}</>)}</span>;
}
