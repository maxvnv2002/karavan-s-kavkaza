import { useState } from "react";
import { Actions, Button, Confirm, Dialog, Fields, Input, Note, Notice, Panel, Select } from "../admin-ui";
import { useAdminDraft } from "../use-admin-draft";
import { AdminValidationError, useAdminSave } from "../use-admin-save";
import { canPublishStore, mapLink, type RetailStore } from "./stores-model";
import { storesResource } from "./stores-store";
import styles from "./stores.module.css";

export function StoreEditor({ item, index }: { item: RetailStore; index: number }) {
  const { value, field, reset } = useAdminDraft(item);
  const [mode, setMode] = useState<"preview" | "delete">();
  const { save, notice } = useAdminSave();
  const ready = canPublishStore(value);
  const data = (key: "name" | "address" | "phone" | "hours" | "map" | "order") => ({
    value: value[key], onChange: (event: React.ChangeEvent<HTMLInputElement>) => field(key, event.target.value),
  });

  function persist() {
    if (save(() => {
      if (value.published && !ready) throw new AdminValidationError("Заполните название, адрес, телефон и часы работы.");
      if (value.map.trim() && !mapLink(value.map)) throw new AdminValidationError("Укажите ссылку на карту, начинающуюся с https:// или http://.");
      storesResource.update((current) => current.map((store) => store.id === item.id ? value : store));
    }, value.published ? "Магазин отмечен для публикации" : "Черновик сохранён")) reset();
  }

  return (
    <Panel variant="wide" id={`store-${item.id}`}>
      <h2>{item.name || `Магазин ${index + 1}`} · {item.published ? "к публикации" : "черновик"}</h2>
      <form className={styles.form} onSubmit={(event) => { event.preventDefault(); persist(); }}>
        <Input label="Название магазина *" maxLength={120} {...data("name")} />
        <Input label="Адрес розничного магазина *" maxLength={220} {...data("address")} />
        <Fields>
          <Input label="Телефон магазина *" type="tel" maxLength={32} {...data("phone")} />
          <Input label="Часы работы *" maxLength={160} {...data("hours")} />
        </Fields>
        <Fields>
          <Input label="Ссылка на карту" type="url" maxLength={1000} {...data("map")} />
          <Input label="Порядок отображения" type="number" min="1" required {...data("order")} />
        </Fields>
        <Select label="Статус карточки" value={value.published ? "yes" : "no"} onChange={(event) => field("published", event.target.value === "yes")}
          options={[["no", "Черновик"], ["yes", "К публикации", !ready]]} />
        <Select label="Показывать в подвале и на главной" value={value.promote ? "yes" : "no"} onChange={(event) => field("promote", event.target.value === "yes")}
          options={[["yes", "После публикации"], ["no", "Только в контактах"]]} />
        {!ready && <Note>Заполните название, адрес, телефон и часы работы, чтобы подготовить карточку к публикации.</Note>}
        <Actions><Button type="submit">{value.published ? "Сохранить карточку" : "Сохранить черновик"}</Button><Button width={200} onClick={() => setMode("preview")}>Предпросмотр</Button></Actions>
        <button type="button" className={`text-button ${styles.delete}`} onClick={() => setMode("delete")}>Удалить магазин</button>
        <Notice {...notice} />
      </form>
      {mode === "preview" && <StorePreview item={value} close={() => setMode(undefined)} />}
      {mode === "delete" && (
        <Confirm title="Удалить магазин?" close={() => setMode(undefined)} confirm={() => {
          save(() => storesResource.update((current) => current.filter((store) => store.id !== item.id)));
          setMode(undefined);
        }}>Карточка и сохранённые данные магазина будут удалены.</Confirm>
      )}
    </Panel>
  );
}

function StorePreview({ item, close }: { item: RetailStore; close: () => void }) {
  const link = mapLink(item.map);
  return (
    <Dialog title="Предпросмотр магазина" close={close}>
      <h3>{item.name || "Название магазина"}</h3>
      <p>{item.address || "Адрес не указан"}<br />{item.phone || "Телефон не указан"}<br />{item.hours || "Часы работы не указаны"}</p>
      {link && <a href={link} target="_blank" rel="noreferrer">Открыть карту ↗</a>}
      <Button onClick={close}>Закрыть</Button>
    </Dialog>
  );
}
