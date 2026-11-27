import { batches, products, type PriceMode } from "./data";

export const categories = [
  ["meat", "Мясо птицы"],
  ["prepared", "Полуфабрикаты"],
] as const;

export const groups = [
  ["", "Все"],
  ["whole", "Тушка"],
  ["parts", "Части"],
  ["offal", "Субпродукты"],
] as const;

export function readFilters(params: Pick<URLSearchParams, "get">) {
  const q = params.get("q") ?? "";
  const mode: PriceMode = params.get("price") === "wholesale" ? "wholesale" : "retail";
  const category = params.get("category") ?? "";
  const group = params.get("group") ?? "";
  const date = params.get("date") ?? "";
  const sort = params.get("sort") ?? "";
  return { q, mode, category, group, date, sort };
}

export function filterBatches({ q, mode, category, group, date, sort }: ReturnType<typeof readFilters>) {
  const search = normalize(q.trim());
  const categoryFilter = categories.some(([id]) => id === category) ? category : "";
  const groupFilter = groups.some(([id]) => id === group) && category !== "prepared" ? group : "";
  const result = batches.filter((batch) => {
    const product = products[batch.productId];
    return (!categoryFilter || product.category === categoryFilter)
      && (!groupFilter || product.group === groupFilter)
      && (date !== "21" && date !== "23" || batch.date === date)
      && normalize(`${product.name} ${product.cardName} ${product.code}`).includes(search);
  });

  if (sort === "price-asc") return result.sort((a, b) => a[mode] - b[mode]);
  if (sort === "price-desc") return result.sort((a, b) => b[mode] - a[mode]);
  if (sort === "oldest") return result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
}

export function batchCount(count: number) {
  const plural = new Intl.PluralRules("ru").select(count);
  return `${count} ${plural === "one" ? "партия" : plural === "few" ? "партии" : "партий"}`;
}

function normalize(value: string) {
  return value.toLowerCase().replaceAll("ё", "е");
}
