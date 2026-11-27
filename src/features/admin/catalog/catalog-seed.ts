import { batches, products } from "@/features/catalog/data";
import type { CatalogData, CatalogPosition } from "./catalog-model";

const initialStock: Record<string, number> = { "chicken-23-11": 45, "broth-23-11": 22, "liver-21-11": 8, "cutlets-23-11": 12 };
const order = ["wings-21-11", "wings-23-11", "chicken-23-11", "broth-23-11", "liver-21-11", "cutlets-23-11"];
const shortNames: Record<string, string> = { chicken: "Тушка", liver: "Печень", cutlets: "Котлеты" };

export const catalogSeed: CatalogData = {
  products: Object.entries(products).map(([id, item]) => ({
    id, name: item.name, shortName: shortNames[id] ?? item.cardName, categoryId: item.group, code: item.code, unit: "кг",
    description: id === "wings" ? "Охлаждённые крылышки. Птица и её происхождение описываются в разделе производства." : item.description,
  })),
  positions: order.map((id): CatalogPosition => {
    const batch = batches.find((entry) => entry.id === id)!;
    return {
      id, productId: batch.productId, slaughterId: batch.date, stock: initialStock[id] ?? batch.stock,
      expiry: batch.expires, retail: batch.previousRetail ?? batch.retail, wholesale: batch.previousWholesale ?? batch.wholesale,
      visible: true, retailMin: 1, wholesaleMin: products[batch.productId].minimum, discount: "inherit",
      storage: batch.productId === "cutlets" ? "Замороженный · −18 °C" : "Охлаждённый · 0…+4 °C",
    };
  }),
  slaughters: [
    { id: "23", date: "2026-11-23", time: "08:00", status: "done", visible: true, discount: "" },
    { id: "21", date: "2026-11-21", time: "08:00", status: "done", visible: true, discount: "10" },
    { id: "26", date: "2026-11-26", time: "08:00", status: "planned", visible: true, discount: "" },
  ],
  categories: [
    { id: "meat", name: "Мясо птицы", parentId: "", visible: true },
    { id: "whole", name: "Тушка", parentId: "meat", visible: true },
    { id: "parts", name: "Части птицы", parentId: "meat", visible: true },
    { id: "offal", name: "Субпродукты", parentId: "meat", visible: true },
    { id: "prepared", name: "Полуфабрикаты", parentId: "", visible: true },
  ],
  discounts: {
    active: true,
    rules: [
      { id: "2", days: 2, percent: 10, active: true },
      { id: "3", days: 3, percent: 15, active: true },
    ],
  },
};
