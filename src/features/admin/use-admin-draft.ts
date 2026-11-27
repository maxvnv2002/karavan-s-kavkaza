"use client";

import { useState } from "react";

export function useAdminDraft<T>(saved: T) {
  const [draft, setDraft] = useState<T>();
  const value = draft ?? saved;

  function field<K extends keyof T>(key: K, next: T[K]) {
    setDraft((current) => ({ ...(current ?? saved), [key]: next }));
  }

  return { value, dirty: draft !== undefined, field, setDraft, reset: () => setDraft(undefined) };
}
