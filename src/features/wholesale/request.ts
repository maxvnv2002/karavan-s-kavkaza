import { products, type ProductId } from "@/features/catalog/data";

export const consentVersion = "2026-11-24";
export const maxQuantity = 10_000;
export const maxLines = Object.keys(products).length;
export const statuses = { new: "Новая", active: "В работе", closed: "Закрыта" } as const;

export type RequestStatus = keyof typeof statuses;
export type RequestItem = { productId: ProductId; quantityKg: number };
export type RequestDraft = {
  items: RequestItem[];
  phone: string;
  personalConsent: boolean;
  marketingConsent: boolean;
};

export type WholesaleRequest = Omit<RequestDraft, "personalConsent"> & {
  id: string;
  number: number;
  createdAt: string;
  status: RequestStatus;
  consentVersion: string;
};

export function normalizePhone(value: string) {
  if (!/^[+\d\s().-]+$/.test(value.trim())) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+7${digits}`;
  if (/^[78]\d{10}$/.test(digits)) return `+7${digits.slice(1)}`;
  return null;
}

export function formatPhone(value: string) {
  return value.replace(/^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/, "+7 ($1) $2-$3-$4");
}

export function validItems(items: RequestItem[]) {
  return items.length > 0
    && items.length <= maxLines
    && new Set(items.map(({ productId }) => productId)).size === items.length
    && items.every(({ productId, quantityKg }) =>
      Number.isFinite(quantityKg) && quantityKg >= products[productId].minimum && quantityKg <= maxQuantity,
    );
}
