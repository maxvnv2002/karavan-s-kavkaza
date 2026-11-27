import Link from "next/link";
import { useEffect } from "react";
import { Button, Fields, Note, Notice } from "../admin-ui";
import { useAdminDraft } from "../use-admin-draft";
import { useAdminSave } from "../use-admin-save";
import { positionHref } from "./catalog-controls";
import { positionContext, pricePreview, type CatalogData, type CatalogPosition } from "./catalog-model";
import { savePosition } from "./catalog-store";
import { ExpiryField, NumberField, StorageField, VisibilityField } from "./position-fields";
import styles from "./slaughter.module.css";

export function SlaughterPositionForm({ data, saved, setDirty }: { data: CatalogData; saved: CatalogPosition; setDirty: (dirty: boolean) => void }) {
  const draft = useAdminDraft(saved);
  const { dirty, value, reset } = draft;
  const { save, notice } = useAdminSave();
  const { product } = positionContext(data, value);
  const price = pricePreview(data, value);

  useEffect(() => setDirty(dirty), [dirty, setDirty]);

  return (
    <form id="position-editor" className={styles.section} onSubmit={(event) => {
      event.preventDefault();
      if (save(() => savePosition(value))) reset();
    }}>
      <h2>{product?.shortName} · эта партия</h2>
      <Note className={styles.editorNote}><Link href={`${positionHref(value.id)}#product-data`}>Общие данные товара</Link></Note>
      <Fields keepColumns><NumberField label="Розница, ₽ / кг" fieldKey="retail" {...draft} /><NumberField label="Мелкий опт, ₽ / кг" fieldKey="wholesale" {...draft} /></Fields>
      <Fields keepColumns><NumberField label="Остаток, кг" fieldKey="stock" {...draft} /><NumberField label="Опт от, кг" fieldKey="wholesaleMin" min={0.01} {...draft} /></Fields>
      <ExpiryField mobile {...draft} />
      <StorageField mobile {...draft} />
      <VisibilityField mobile {...draft} />
      <p className={styles.preview}>
        Цена на сайте<br />Розница: {value.retail} {price.percent > 0 && `→ ${price.retail} `}₽/кг<br />Опт: {value.wholesale} {price.percent > 0 && `→ ${price.wholesale} `}₽/кг<br />
        {price.manual !== undefined && value.discount === "inherit" ? `Скидка забоя ${price.manual}%.` : price.percent ? `Скидка по возрасту партии ${price.percent}%.` : "Скидка не применяется."}
      </p>
      <Note className={styles.small}>При нулевом остатке, истёкшем сроке или скрытой категории позиция исчезнет с сайта.</Note>
      <Button type="submit" width="100%">Сохранить эту партию</Button>
      <Notice {...notice} />
    </form>
  );
}
