import { media } from "@/lib/site";

export const products = {
  wings: { name: "Крылышки куриные", cardName: "Крылышки", category: "meat", group: "parts", code: "КР-01", image: media.chicken, pack: 1, storage: "0…+4 °C", state: "охлаждённые", minimum: 10, description: "Охлаждённые крылышки." },
  chicken: { name: "Тушка цыплёнка", cardName: "Тушка цыплёнка", category: "meat", group: "whole", code: "ТЦ-01", image: media.chicken, pack: 1, storage: "0…+4 °C", state: "охлаждённая", minimum: 10, description: "Охлаждённая тушка цыплёнка." },
  broth: { name: "Курица для бульона", cardName: "Курица для бульона", category: "meat", group: "whole", code: "КБ-01", image: media.broth, pack: 1, storage: "0…+4 °C", state: "охлаждённая", minimum: 10, description: "Охлаждённая курица для бульона." },
  cutlets: { name: "Котлеты куриные", cardName: "Котлеты куриные", category: "prepared", group: "prepared", code: "КК-01", image: media.broth, pack: 0.5, storage: "−18 °C", state: "замороженные", minimum: 5, description: "Замороженные куриные котлеты." },
  liver: { name: "Печень куриная", cardName: "Печень куриная", category: "meat", group: "offal", code: "ПК-01", image: media.chicken, pack: 1, storage: "0…+4 °C", state: "охлаждённая", minimum: 5, description: "Охлаждённая куриная печень." },
} as const;

export type ProductId = keyof typeof products;
export type PriceMode = "retail" | "wholesale";

export type Batch = {
  id: string;
  productId: ProductId;
  date: "21" | "23";
  stock: number;
  expires: string;
  retail: number;
  wholesale: number;
  previousRetail?: number;
  previousWholesale?: number;
  badge?: string;
};

export const batches: Batch[] = [
  { id: "wings-23-11", productId: "wings", date: "23", stock: 32, expires: "26.11.2026, 18:00", retail: 300, wholesale: 270 },
  { id: "chicken-23-11", productId: "chicken", date: "23", stock: 22, expires: "26.11.2026, 18:00", retail: 235, wholesale: 210 },
  { id: "broth-23-11", productId: "broth", date: "23", stock: 20, expires: "26.11.2026, 18:00", retail: 210, wholesale: 185 },
  { id: "cutlets-23-11", productId: "cutlets", date: "23", stock: 16, expires: "23.02.2027, 18:00", retail: 420, wholesale: 380 },
  { id: "wings-21-11", productId: "wings", date: "21", stock: 18, expires: "24.11.2026, 18:00", retail: 270, wholesale: 243, previousRetail: 300, previousWholesale: 270, badge: "−10%" },
  { id: "liver-21-11", productId: "liver", date: "21", stock: 12, expires: "24.11.2026, 18:00", retail: 180, wholesale: 162, previousRetail: 200, previousWholesale: 180, badge: "−10%" },
];

export function getBatch(id: string) {
  return batches.find((batch) => batch.id === id);
}

export function isProductId(value: string): value is ProductId {
  return Object.hasOwn(products, value);
}
