import { Fields, Input, Select } from "../admin-ui";
import { AdminValidationError } from "../use-admin-save";
import { EditDialog, formText } from "./catalog-controls";
import type { Slaughter } from "./catalog-model";
import { catalogStore } from "./catalog-store";

export function SlaughterDialog({ item, close }: { item?: Slaughter; close: () => void }) {
  return (
    <EditDialog title={item ? "Редактировать забой" : "Создать забой"} close={close} onSave={(form) => {
      const date = formText(form, "date");
      const time = formText(form, "time");
      const next: Slaughter = {
        id: item?.id ?? crypto.randomUUID(), date, time,
        status: form.get("status") === "done" ? "done" : "planned",
        visible: form.get("visible") === "yes", discount: formText(form, "discount"),
      };
      catalogStore.update((data) => {
        if (data.slaughters.some((entry) => entry.id !== next.id && entry.date === date && entry.time === time)) {
          throw new AdminValidationError("Забой на эту дату и время уже есть.");
        }
        return { ...data, slaughters: item ? data.slaughters.map((entry) => entry.id === item.id ? next : entry) : [...data.slaughters, next] };
      });
    }}>
      <Fields><Input label="Дата забоя" name="date" type="date" defaultValue={item?.date} required /><Input label="Время" name="time" type="time" defaultValue={item?.time ?? "08:00"} required /></Fields>
      <Fields>
        <Select label="Статус" name="status" defaultValue={item?.status ?? "planned"} options={[["done", "Проведён"], ["planned", "Планируется"]]} />
        <Select label="Показывать на сайте" name="visible" defaultValue={item?.visible === false ? "no" : "yes"} options={[["yes", "Включено"], ["no", "Выключено"]]} />
      </Fields>
      <Input label="Ручная скидка, %" name="discount" type="number" min={0} max={100} defaultValue={item?.discount} placeholder="Автоскидка" />
    </EditDialog>
  );
}
