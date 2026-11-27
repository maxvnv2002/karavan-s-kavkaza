export type Category = { id: string; name: string; parentId: string; visible: boolean };
export type Slaughter = { id: string; date: string; time: string; status: "done" | "planned"; visible: boolean; discount: string };
export type CatalogProduct = { id: string; name: string; shortName: string; categoryId: string; code: string; unit: string; description: string };
export type CatalogPosition = {
  id: string;
  productId: string;
  slaughterId: string;
  stock: number;
  expiry: string;
  storage: string;
  visible: boolean;
  retail: number;
  wholesale: number;
  retailMin: number;
  wholesaleMin: number;
  discount: "inherit" | "none";
};
export type DiscountRule = { id: string; days: number; percent: number; active: boolean };
export type CatalogData = {
  products: CatalogProduct[];
  positions: CatalogPosition[];
  slaughters: Slaughter[];
  categories: Category[];
  discounts: { active: boolean; rules: DiscountRule[] };
};

const previewTime = Date.parse("2026-11-23T08:00:00+03:00");
const dayMs = 86_400_000;

export function displayDate(date: string) {
  return date.split("-").reverse().join(".");
}

export function shortDate(date: string) {
  return displayDate(date).slice(0, 5);
}

export function expiryTimestamp(value: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4}),\s*(\d{2}:\d{2})$/.exec(value);
  if (!match) return NaN;
  const [, day, month, year, time] = match;
  const calendar = `${year}-${month}-${day}`;
  const timestamp = Date.parse(`${calendar}T${time}:00+03:00`);
  const date = new Date(`${calendar}T00:00:00Z`);
  return Number.isFinite(timestamp) && Number.isFinite(+date) && date.toISOString().slice(0, 10) === calendar ? timestamp : NaN;
}

export function dateTitle(date: string) {
  return new Intl.DateTimeFormat("ru", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(date + "T00:00:00Z"));
}

export function positionContext(data: CatalogData, position: CatalogPosition) {
  const product = data.products.find((item) => item.id === position.productId);
  const slaughter = data.slaughters.find((item) => item.id === position.slaughterId);
  const category = data.categories.find((item) => item.id === product?.categoryId);
  const parent = data.categories.find((item) => item.id === category?.parentId);
  return { product, slaughter, category, parent };
}

export function pricePreview(data: CatalogData, position: CatalogPosition, product?: CatalogProduct) {
  const context = positionContext({ ...data, products: product ? [product] : data.products }, position);
  const { slaughter, category, parent } = context;
  const age = slaughter ? Math.floor((previewTime - Date.parse(`${slaughter.date}T${slaughter.time}:00+03:00`)) / dayMs) : 0;
  const automatic = data.discounts.active && slaughter?.status === "done"
    ? data.discounts.rules.filter((rule) => rule.active && rule.days <= age).sort((a, b) => b.days - a.days)[0]
    : undefined;
  const manual = slaughter?.discount ? Number(slaughter.discount) : undefined;
  const percent = position.discount === "none" ? 0 : manual ?? automatic?.percent ?? 0;
  const visible = !!(position.visible && position.stock > 0 && slaughter?.visible && slaughter.status === "done"
    && category?.visible && parent?.visible !== false && expiryTimestamp(position.expiry) > previewTime);
  return {
    visible, percent, manual,
    retail: Math.round(position.retail * (100 - percent) / 100),
    wholesale: Math.round(position.wholesale * (100 - percent) / 100),
  };
}

export function slaughterSchedule(slaughters: Slaughter[]) {
  const visible = slaughters.filter((entry) => entry.visible).sort((a, b) => a.date.localeCompare(b.date));
  return {
    latest: visible.findLast((entry) => entry.status === "done"),
    next: visible.find((entry) => entry.status === "planned"),
  };
}
