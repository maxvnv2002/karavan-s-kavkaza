import styles from "./information.module.css";

export type StatusContent = { title: string; text: string };

/** Content card for a document or a publication status. */
export function StatusCard({ title, text, className = "" }: StatusContent & { className?: string }) {
  return (
    <article className={`${styles.statusCard} ${className}`}>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
