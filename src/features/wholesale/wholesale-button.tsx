"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ProductId } from "@/features/catalog/data";
import { RequestDialog } from "./request-dialog";

const WholesaleContext = createContext<(product?: ProductId) => void>(() => {});

export function WholesaleProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<{ product?: ProductId } | null>(null);

  return (
    <WholesaleContext.Provider value={(product) => setRequest({ product })}>
      {children}
      {request && <RequestDialog product={request.product} onDismiss={() => setRequest(null)} />}
    </WholesaleContext.Provider>
  );
}

/** Opens the wholesale form, optionally pre-filling a product. */
export function WholesaleButton({ product, className = "", full = false }: {
  product?: ProductId; className?: string; full?: boolean;
}) {
  const open = useContext(WholesaleContext);
  return (
    <button type="button" className={`button ${full ? "button--full" : ""} ${className}`} onClick={() => open(product)}>
      Заявка малого опта
    </button>
  );
}
