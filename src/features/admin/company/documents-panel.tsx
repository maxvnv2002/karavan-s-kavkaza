import { useRef, useState } from "react";
import { Note, Notice, Panel, Select } from "../admin-ui";
import { FilePicker } from "../file-picker";
import { downloadFile, removeFile, writeFile } from "../local-files";
import { useResource } from "../local-resource";
import { AdminValidationError, useAdminSave } from "../use-admin-save";
import { documents } from "./company-config";
import { documentStore } from "./company-store";
import styles from "./company.module.css";

export function DocumentsPanel() {
  return (
    <Panel variant="wide">
      <h2>Документы для оптовиков</h2>
      {documents.map((document) => <DocumentCard key={document.id} document={document} />)}
    </Panel>
  );
}

function DocumentCard({ document }: { document: (typeof documents)[number] }) {
  const files = useResource(documentStore);
  const existing = files[document.id];
  const { save, notice } = useAdminSave();
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);

  async function pick(file: File) {
    if (pending.current) return;
    const supported = document.accept.split(",").some((extension) => file.name.toLowerCase().endsWith(extension));
    if (!supported || !file.size || file.size > 10 * 1024 * 1024) {
      save(() => { throw new AdminValidationError(`Выберите файл ${document.accept.replaceAll(".", "").toUpperCase()} до 10 МБ.`); });
      return;
    }
    pending.current = true;
    setBusy(true);
    const fileId = crypto.randomUUID();
    try {
      await writeFile(fileId, file);
      let previous = "";
      const stored = save(() => documentStore.update((current) => {
        previous = current[document.id]?.fileId;
        return { ...current, [document.id]: { fileId, fileName: file.name, published: false } };
      }), "Файл добавлен в этом браузере");
      const unused = stored ? previous : fileId;
      if (unused) void removeFile(unused).catch(() => {});
    } catch {
      save(() => { throw new AdminValidationError("Не удалось загрузить документ."); });
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  return (
    <section className={styles.document} aria-label={document.title}>
      <h3>{document.title}</h3>
      <p className={styles.green}>
        {existing ? <><button type="button" className="text-button" onClick={() => {
          void downloadFile(existing.fileId, existing.fileName).catch(() => save(() => { throw new AdminValidationError("Файл недоступен."); }));
        }}>{existing.fileName}</button> · {existing.published ? "к публикации" : "черновик"}</> : "Файл не добавлен"}
      </p>
      <Note>{document.note}</Note>
      <div className={styles.docActions}>
        <FilePicker accept={document.accept} width={220} busy={busy} pick={(file) => void pick(file)}>{busy ? "Загружаем…" : "Загрузить документ"}</FilePicker>
        <Select label="Статус документа" value={existing?.published ? "yes" : "no"} disabled={busy} options={[
          ["no", "Черновик"], ["yes", "К публикации", !existing],
        ]} onChange={(event) => {
          const published = event.target.value === "yes";
          save(() => documentStore.update((current) => {
            if (!current[document.id]) throw new AdminValidationError("Сначала загрузите документ.");
            return { ...current, [document.id]: { ...current[document.id], published } };
          }));
        }} />
      </div>
      <Notice {...notice} />
    </section>
  );
}
