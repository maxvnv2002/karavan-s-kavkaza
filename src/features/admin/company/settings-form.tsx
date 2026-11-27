import type { ReactNode } from "react";
import { useResource, type Resource } from "../local-resource";
import { Button, Notice } from "../admin-ui";
import { useAdminDraft } from "../use-admin-draft";
import { useAdminSave } from "../use-admin-save";
import styles from "./company.module.css";

export function SettingsForm({ resource, label, children }: {
  resource: Resource<Record<string, string>>;
  label: string;
  children: (values: Record<string, string>, change: (key: string, value: string) => void) => ReactNode;
}) {
  const saved = useResource(resource);
  const { value, field, reset } = useAdminDraft(saved);
  const { save, notice } = useAdminSave();

  return (
    <form className={styles.form} onSubmit={(event) => {
      event.preventDefault();
      if (save(() => resource.update((current) => ({ ...current, ...value })), "Сохранено в этом браузере")) reset();
    }}>
      {children(value, field)}
      <Button type="submit">{label}</Button>
      <Notice {...notice} />
    </form>
  );
}
