import Link from "next/link";
import { useId, type ComponentProps, type ReactNode } from "react";
import { useNativeDialog } from "@/components/use-native-dialog";
import styles from "./ui.module.css";

export function AdminMain({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main id="main" className={`${styles.main} ${className}`}>{children}</main>;
}

export function Heading({ title, note, actions }: { title: string; note?: string; actions?: ReactNode }) {
  return <div className={styles.heading}><div><h1>{title}</h1>{note && <Note>{note}</Note>}</div>{actions}</div>;
}

export function Panel({ children, variant = "plain", id }: { children: ReactNode; variant?: "plain" | "wide" | "card" | "green"; id?: string }) {
  return <section className={`${styles.panel} ${styles[variant]}`} id={id}>{children}</section>;
}

export function Note({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`${styles.note} ${className}`}>{children}</p>;
}

export function Fields({ children, columns = 2, keepColumns = false }: { children: ReactNode; columns?: 2 | 3; keepColumns?: boolean }) {
  return <div className={`${styles.fields} ${columns === 3 ? styles.three : ""} ${keepColumns ? styles.keepColumns : ""}`}>{children}</div>;
}

export function Input({ label, ...props }: ComponentProps<"input"> & { label: string }) {
  return <label className={styles.label}><span>{label}</span><input className="field" {...props} /></label>;
}

export function Textarea({ label, className = "", ...props }: ComponentProps<"textarea"> & { label: string }) {
  return <label className={styles.label}><span>{label}</span><textarea className={`field ${styles.textarea} ${className}`} {...props} /></label>;
}

type Option = readonly [value: string, caption: string, disabled?: boolean];
export function Select({ label, options, ...props }: ComponentProps<"select"> & { label: string; options: readonly Option[] }) {
  return (
    <label className={styles.label}>
      <span>{label}</span>
      <select className={`field ${styles.select}`} {...props}>
        {options.map(([value, caption, disabled]) => <option key={value} value={value} disabled={disabled}>{caption}</option>)}
      </select>
    </label>
  );
}

export function Button({ width = 240, className = "", ...props }: ComponentProps<"button"> & { width?: number | "100%" }) {
  return <button type="button" className={`button ${className}`} style={{ width }} {...props} />;
}

export function ButtonLink({ href, width = 240, children }: { href: string; width?: number; children: ReactNode }) {
  return <Link className="button" style={{ width }} href={href}>{children}</Link>;
}

export function Actions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}

export function Notice({ message, error = false }: { message: string; error?: boolean }) {
  return message ? <p className={error ? styles.error : styles.success} role={error ? "alert" : "status"}>{message}</p> : null;
}

export function Dialog({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useNativeDialog();
  const id = useId();
  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby={id} onCancel={(event) => { event.preventDefault(); close(); }}>
      <div className={styles.dialogBody}>
        <h2 id={id}>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

export function Confirm({ title, children, close, confirm }: { title: string; children: ReactNode; close: () => void; confirm: () => void }) {
  return (
    <Dialog title={title} close={close}>
      <Note>{children}</Note>
      <Actions><Button width={160} className="button--outline" onClick={close} autoFocus>Отменить</Button><Button width={160} onClick={confirm}>Удалить</Button></Actions>
    </Dialog>
  );
}
