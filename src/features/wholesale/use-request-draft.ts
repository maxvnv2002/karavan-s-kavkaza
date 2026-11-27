import { useRef, useState } from "react";
import { products, type ProductId } from "@/features/catalog/data";
import { normalizePhone, validItems, type WholesaleRequest } from "./request";
import { createRequest } from "./request-store";

export type DraftLine = { id: number; productId: ProductId; quantity: string };
const productIds = Object.keys(products) as ProductId[];

function createLine(id: number, productId: ProductId): DraftLine {
  return { id, productId, quantity: String(products[productId].minimum) };
}

export function useRequestDraft(product?: ProductId) {
  const [lines, setLines] = useState(() => product ? [createLine(0, product)] : [createLine(0, "wings"), createLine(1, "liver")]);
  const [phone, setPhone] = useState("");
  const [personalConsent, setPersonalConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [saved, setSaved] = useState<WholesaleRequest | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const nextId = useRef(2);
  const submitting = useRef(false);
  const items = lines.map(({ productId, quantity }) => ({ productId, quantityKg: Number(quantity) }));
  const canSubmit = personalConsent && Boolean(normalizePhone(phone)) && validItems(items);

  function addLine() {
    const id = nextId.current++;
    setLines((current) => {
      const available = productIds.find((item) => !current.some((line) => line.productId === item));
      return available ? [...current, createLine(id, available)] : current;
    });
  }

  function updateLine(id: number, values: Partial<Omit<DraftLine, "id">>) {
    setLines((current) => current.map((line) => line.id === id ? { ...line, ...values } : line));
  }

  function removeLine(id: number) {
    setLines((current) => current.filter((line) => line.id !== id));
  }

  async function submit() {
    if (!canSubmit || submitting.current || saved) return;
    submitting.current = true;
    setPending(true);
    setError("");

    try {
      setSaved(await createRequest({ items, phone, personalConsent, marketingConsent }));
    } catch {
      setError("Не удалось сохранить заявку. Попробуйте ещё раз.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return {
    lines, addLine, updateLine, removeLine, phone, setPhone, personalConsent, setPersonalConsent,
    marketingConsent, setMarketingConsent, canSubmit, saved, error, pending, submit,
  };
}
