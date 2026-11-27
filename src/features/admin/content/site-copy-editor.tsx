import Link from "next/link";
import { useRef, useState } from "react";
import { Actions, ButtonLink, Fields, Note, Notice, Panel } from "../admin-ui";
import { CopyFields } from "../form-fields";
import { removeFile, writeFile } from "../local-files";
import { useResource } from "../local-resource";
import { useAdminDraft } from "../use-admin-draft";
import { AdminValidationError, useAdminSave } from "../use-admin-save";
import { buyingFields, contactFields, homeFields } from "./content-config";
import { copyStore } from "./content-store";
import { HeroPhotoField } from "./hero-photo-field";
import styles from "./content.module.css";

export function SiteCopyEditor({ onBusy }: { onBusy: (busy: boolean) => void }) {
  const stored = useResource(copyStore);
  const draft = useAdminDraft(stored.values);
  const [photo, setPhoto] = useState<File>();
  const pending = useRef(false);
  const { save, notice } = useAdminSave();
  const fields = { values: draft.value, change: draft.field };

  async function persist() {
    if (pending.current) return;
    pending.current = true;
    onBusy(true);
    const newId = photo ? crypto.randomUUID() : "";
    try {
      if (photo) await writeFile(newId, photo);
      let previousPhotoId = "";
      const ok = save(() => copyStore.update((current) => {
        previousPhotoId = current.photoId;
        return { values: { ...current.values, ...draft.value }, photoId: newId || current.photoId };
      }), "Тексты сохранены в этом браузере");
      if (!ok && newId) void removeFile(newId).catch(() => {});
      if (ok) {
        if (newId && previousPhotoId) void removeFile(previousPhotoId).catch(() => {});
        setPhoto(undefined);
        draft.reset();
      }
    } catch {
      save(() => { throw new AdminValidationError("Не удалось сохранить фотографию."); });
    } finally {
      pending.current = false;
      onBusy(false);
    }
  }

  return (
    <>
      <Panel variant="green">
        <h3>Реквизиты, документы и магазины</h3>
        <Note>Реквизиты используются в подвале, контактах и правовых текстах. Магазины управляются отдельно от самовывоза.</Note>
        <Actions><ButtonLink href="/admin/company" width={300}>Реквизиты и документы</ButtonLink><ButtonLink href="/admin/stores" width={300}>Розничные магазины</ButtonLink></Actions>
      </Panel>
      <div className={styles.columns}>
        <form id="site-copy-form" className={styles.stack} onSubmit={(event) => { event.preventDefault(); void persist(); }}>
          <Panel variant="card">
            <h3>Контакты и часы работы</h3>
            <Fields><CopyFields fields={contactFields.slice(0, 4)} {...fields} /></Fields>
            <CopyFields fields={contactFields.slice(4)} {...fields} />
          </Panel>
          <Panel variant="card">
            <h3>Главная страница и о фабрике</h3>
            <CopyFields fields={homeFields} {...fields} />
            <HeroPhotoField fileId={stored.photoId} selection={photo} choose={setPhoto} />
          </Panel>
          <Panel variant="card">
            <h3>Условия покупки и поставки</h3>
            <CopyFields fields={buyingFields} {...fields} />
          </Panel>
        </form>
        <aside className={styles.stack} aria-label="Публикация текстов">
          <Panel variant="card">
            <h3>Контакты и тексты</h3>
            <Notice message={notice.message || (draft.dirty || photo ? "Есть несохранённые изменения" : "Сохранено")} error={notice.error} />
            <Note>Тексты сохраняются в этом браузере. Сведения о производстве сохраняются отдельно.</Note>
            <Link className={styles.green} href="/">Открыть сайт</Link>
          </Panel>
          <Panel variant="card">
            <h3>Перед публикацией</h3>
            <Note>Проверьте телефон, адрес и часы работы.</Note>
          </Panel>
        </aside>
      </div>
    </>
  );
}
