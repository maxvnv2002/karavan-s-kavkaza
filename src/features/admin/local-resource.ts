"use client";

import { useSyncExternalStore } from "react";

export type Resource<T> = {
  read: () => T;
  subscribe: (notify: () => void) => () => void;
  initial: T;
  update: (change: (current: T) => T) => T;
};

export function localResource<T>(name: string, initial: T): Resource<T> {
  const key = `karavan.admin.${name}.v1`;
  const eventName = `karavan:${key}`;
  let previous: string | null = null;
  let value = initial;

  function read() {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== previous) {
        try {
          value = raw ? JSON.parse(raw) ?? initial : initial;
        } catch {
          value = initial;
        }
        previous = raw;
      }
      return value;
    } catch {
      return initial;
    }
  }

  return {
    initial,
    read,
    subscribe(notify) {
      const storage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) notify();
      };
      window.addEventListener("storage", storage);
      window.addEventListener(eventName, notify);
      return () => {
        window.removeEventListener("storage", storage);
        window.removeEventListener(eventName, notify);
      };
    },
    update(change) {
      const next = change(read());
      const raw = JSON.stringify(next);
      window.localStorage.setItem(key, raw);
      previous = raw;
      value = next;
      window.dispatchEvent(new Event(eventName));
      return next;
    },
  };
}

export function useResource<T>(resource: Resource<T>) {
  return useSyncExternalStore(resource.subscribe, resource.read, () => resource.initial);
}
