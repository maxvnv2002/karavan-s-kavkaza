import { Actions, Button, Input, Note, Notice, Panel, Select } from "../admin-ui";
import { CopyFields } from "../form-fields";
import { useResource } from "../local-resource";
import { useAdminDraft } from "../use-admin-draft";
import { useAdminSave } from "../use-admin-save";
import { useAdminCatalog } from "../catalog/catalog-store";
import { productionFields, stageHints, type ProductionStatus } from "./content-config";
import { productionStore } from "./content-store";
import styles from "./content.module.css";

const states = { draft: "черновик", review: "на проверке", confirmed: "подтверждено", published: "отмечено для публикации" };

export function ProductionEditor() {
  const stored = useResource(productionStore);
  const { value, dirty, field, reset } = useAdminDraft(stored);
  const { products } = useAdminCatalog();
  const { save, notice } = useAdminSave();
  const ready = productionFields.every((item) => value.values[item.key]?.trim()) && value.stages.every((item) => item.description.trim())
    && value.ingredients.every((item) => item.productId && item.details.trim() && item.documents.trim());
  const status = dirty ? "draft" : stored.status;

  function persist(next: ProductionStatus) {
    const text: Record<ProductionStatus, string> = { draft: "Черновик сохранён", review: "Установлен статус «На проверке»", confirmed: "Сведения подтверждены", published: "Сведения отмечены для публикации" };
    if (save(() => productionStore.update(() => ({ ...value, status: next })), text[next])) reset();
  }

  return (
    <Panel id="production">
      <h2>Производство и Халяль</h2>
      <Note className={styles.productionNote}>На сайте пока показано сообщение о подготовке информации.</Note>
      <div className={styles.review}>
        <p>Черновик → На проверке → Подтверждено → Отмечено для публикации</p>
        <Note>Сейчас: {states[status]}. {status === "draft" && "Публикация недоступна до заполнения и подтверждения сведений."}</Note>
      </div>
      <CopyFields fields={productionFields} values={value.values} change={(key, text) => field("values", { ...value.values, [key]: text })} />
      <h3>Этапы производства и ответственные</h3>
      {value.stages.map((item, index) => (
        <Input key={item.id} label={item.label} value={item.description} placeholder={stageHints[index] ?? "Укажите процесс и ответственного"} onChange={(event) => {
          field("stages", value.stages.map((stage) => stage.id === item.id ? { ...stage, description: event.target.value } : stage));
        }} maxLength={500} />
      ))}
      <Button width={300} onClick={() => field("stages", [...value.stages, { id: crypto.randomUUID(), label: `Этап ${value.stages.length + 1} · описание / ответственный`, description: "" }])}>+ Добавить этап</Button>
      <h3>Покупные ингредиенты полуфабрикатов</h3>
      {value.ingredients.map((item, index) => {
        const update = (key: "productId" | "details" | "documents", text: string) => field("ingredients", value.ingredients.map((ingredient) => ingredient.id === item.id ? { ...ingredient, [key]: text } : ingredient));
        return (
          <div key={item.id} className={styles.ingredient} role="group" aria-label={`Ингредиент ${index + 1}`}>
            <Select label="Товар" value={item.productId} onChange={(event) => update("productId", event.target.value)} options={[["", "Выберите товар", true], ...products.map((product) => [product.id, product.name] as const)]} />
            <Input label="Ингредиент / поставщик / происхождение" value={item.details} onChange={(event) => update("details", event.target.value)} maxLength={500} />
            <Input label="Документы на ингредиент" value={item.documents} onChange={(event) => update("documents", event.target.value)} maxLength={500} />
          </div>
        );
      })}
      <Button width={300} onClick={() => field("ingredients", [...value.ingredients, { id: crypto.randomUUID(), productId: "cutlets", details: "", documents: "" }])}>+ Добавить ингредиент</Button>
      <Note className={styles.productionNote}>Заполните сведения и добавьте документы, чтобы подтвердить данные и подготовить их к публикации.</Note>
      <Select label="Показывать статус подготовки" value={value.showPending ? "yes" : "no"} onChange={(event) => field("showPending", event.target.value === "yes")} options={[["yes", "Да"], ["no", "Нет"]]} />
      <Actions>
        <Button width={300} onClick={() => persist("draft")}>Сохранить черновик</Button>
        {ready && status === "draft" && <Button width={300} onClick={() => persist("review")}>Передать на проверку</Button>}
        {ready && status === "review" && <Button width={300} onClick={() => persist("confirmed")}>Подтвердить сведения</Button>}
      </Actions>
      <Button width={300} disabled={!ready || status !== "confirmed"} onClick={() => persist("published")}>Отметить для публикации</Button>
      <Notice {...notice} />
    </Panel>
  );
}
