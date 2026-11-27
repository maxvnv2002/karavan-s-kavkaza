import { site } from "@/lib/site";
import type { CopyField } from "../form-fields";

export const contactFields = [
  { key: "phone", label: "Телефон", type: "tel" },
  { key: "address", label: "Адрес самовывоза" },
  { key: "weekdays", label: "Будние дни" },
  { key: "saturday", label: "Суббота" },
  { key: "sunday", label: "Воскресенье" },
] as const satisfies readonly CopyField[];

export const homeFields = [
  { key: "heroTitle", label: "Заголовок первого экрана" },
  { key: "subtitle", label: "Подзаголовок", multiline: true },
  { key: "factory", label: "О фабрике", multiline: true },
] as const satisfies readonly CopyField[];

export const buyingFields = [
  { key: "pickup", label: "Самовывоз", multiline: true },
  { key: "delivery", label: "Доставка", multiline: true },
  { key: "wholesale", label: "Оптовым покупателям", multiline: true },
] as const satisfies readonly CopyField[];

export const copySeed = {
  values: {
    phone: site.phone, address: site.address, weekdays: "Пн–пт 08:00–18:00", saturday: "Сб 09:00–14:00", sunday: "Выходной",
    heroTitle: "Мясо птицы и полуфабрикаты",
    subtitle: "Розница и малый опт",
    factory: "Выращиваем птицу. Каждая партия под контролем. Работаем с частными покупателями, магазинами и предприятиями питания.",
    pickup: "Самовывоз с фабрики в часы работы. Перед поездкой позвоните нам.",
    delivery: "Оптовую доставку согласуйте с менеджером.",
    wholesale: "Минимальная партия указана в карточке товара. Наличие, объём и время получения уточняйте по телефону.",
  } as Record<string, string>,
  photoId: "",
};

export type ProductionStage = { id: string; label: string; description: string };
export type Ingredient = { id: string; productId: string; details: string; documents: string };
export type ProductionStatus = "draft" | "review" | "confirmed" | "published";
export type Production = {
  values: Record<string, string>;
  stages: ProductionStage[];
  ingredients: Ingredient[];
  showPending: boolean;
  status: ProductionStatus;
};

export const productionFields: CopyField[] = [
  { key: "summary", label: "Краткое описание для главной" },
  { key: "certification", label: "Статус сертификации" },
  { key: "origin", label: "Хозяйство происхождения птицы" },
  { key: "proof", label: "Подтверждающие материалы", hint: "Документы поставщика и фотографии" },
];

export const stageHints = [
  "Сведения подтверждает производитель",
  "Укажите процесс, контроль и ответственного",
  "Укажите процесс и ответственного",
  "Укажите температуру, процесс и ответственного",
];

export const productionSeed: Production = {
  values: { summary: "Сырьё, этапы производства и ответственные", certification: "Сертификата Халяль пока нет. Сертификация планируется." },
  stages: [
    "Выращивание · описание / ответственный", "Забой · описание соблюдения требований / ответственный",
    "Разделка и упаковка · описание / ответственный", "Хранение и отгрузка · контроль / ответственный",
  ].map((label, index) => ({ id: String(index), label, description: "" })),
  ingredients: [{ id: "0", productId: "cutlets", details: "", documents: "" }],
  showPending: true,
  status: "draft",
};
