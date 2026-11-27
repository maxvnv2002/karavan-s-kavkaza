import { products } from "@/features/catalog/data";
import { formatNumber } from "@/features/catalog/format";
import type { RequestItem } from "@/features/wholesale/request";

const timeZone = "Europe/Moscow";
const day = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", timeZone });
const time = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone });
const long = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone });

export function requestDate(value: string, full = false) {
  const date = new Date(value);
  if (full) return `${long.format(date).replace(/\s*г\.$/, "")}, ${time.format(date)}`;
  return `${day.format(date)} · ${time.format(date)}`;
}

export function lineSummary(item: RequestItem, short = false) {
  const product = products[item.productId];
  return `${short ? product.cardName : product.name} — ${formatNumber(item.quantityKg)} кг`;
}

export function requestSummary(items: RequestItem[]) {
  return items.map((item, index) => {
    if (index > 0 && item.productId === "liver") return `печень — ${formatNumber(item.quantityKg)} кг`;
    return lineSummary(item, true);
  }).join("; ");
}
