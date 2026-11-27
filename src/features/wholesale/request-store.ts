import { useSyncExternalStore } from "react";
import { isProductId } from "@/features/catalog/data";
import { initialRequests } from "./request-seed";
import { consentVersion, normalizePhone, statuses, validItems, type RequestDraft, type RequestStatus, type WholesaleRequest } from "./request";

const key = "karavan.wholesale.v1";
const change = "karavan:wholesale";
const seed = JSON.stringify(initialRequests);

function read() {
  return window.localStorage.getItem(key) ?? seed;
}

function snapshot() {
  try {
    return read();
  } catch {
    return seed;
  }
}

function subscribe(notify: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === key || event.key === null) notify();
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(change, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(change, notify);
  };
}

function isRequest(value: unknown): value is WholesaleRequest {
  if (!value || typeof value !== "object") return false;
  const item = value as WholesaleRequest;
  return typeof item.id === "string"
    && Number.isSafeInteger(item.number)
    && typeof item.createdAt === "string" && Number.isFinite(Date.parse(item.createdAt))
    && typeof item.phone === "string" && /^\+7\d{10}$/.test(item.phone)
    && typeof item.status === "string" && Object.hasOwn(statuses, item.status)
    && typeof item.consentVersion === "string"
    && typeof item.marketingConsent === "boolean"
    && Array.isArray(item.items) && item.items.every((line) => line && isProductId(line.productId))
    && validItems(item.items);
}

function parse(value: string): WholesaleRequest[] {
  const data: unknown = JSON.parse(value);
  if (Array.isArray(data) && data.every(isRequest)) return data;
  throw new Error("Invalid stored request data");
}

function mutate<T>(operation: (requests: WholesaleRequest[]) => { next: WholesaleRequest[]; result: T }) {
  function commit() {
    const { next, result } = operation(parse(read()));
    window.localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event(change));
    return result;
  }
  return navigator.locks ? navigator.locks.request(key, commit) : Promise.resolve().then(commit);
}

export function useRequests() {
  const value = useSyncExternalStore(subscribe, snapshot, () => seed);
  try {
    return parse(value);
  } catch {
    return initialRequests;
  }
}

export async function createRequest(draft: RequestDraft) {
  const phone = normalizePhone(draft.phone);
  if (!phone || !draft.personalConsent || !validItems(draft.items)) {
    throw new Error("Invalid request");
  }

  return mutate((requests) => {
    const number = Math.max(1042, ...requests.map((request) => request.number)) + 1;
    const request: WholesaleRequest = {
      id: crypto.randomUUID(), number, phone, items: draft.items,
      createdAt: new Date().toISOString(), status: "new",
      marketingConsent: draft.marketingConsent, consentVersion,
    };
    return { next: [request, ...requests], result: request };
  });
}

export async function changeRequestStatus(id: string, status: Exclude<RequestStatus, "new">) {
  return mutate((requests) => {
    const current = requests.find((request) => request.id === id);
    if (!current || current.status === "closed" || (current.status === "active" && status === "active")) {
      throw new Error("Invalid status change");
    }
    return {
      next: requests.map((request) => request.id === id ? { ...request, status } : request),
      result: undefined,
    };
  });
}
