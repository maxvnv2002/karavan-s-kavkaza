"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { useNativeDialog } from "@/components/use-native-dialog";
import styles from "./cookies.module.css";

type Consent = "necessary" | "analytics";
const key = "karavan.cookies.v1";
const eventName = "karavan:cookies";
const Context = createContext(() => {});

function snapshot() {
  try {
    const value = window.localStorage.getItem(key);
    return value === "necessary" || value === "analytics" ? value : null;
  } catch {
    return null;
  }
}

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(eventName, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(eventName, notify);
  };
}

export function CookiePreferences({ children }: { children: ReactNode }) {
  const saved = useSyncExternalStore(subscribe, snapshot, () => "loading");
  const [session, setSession] = useState<Consent | null>(null);
  const [settings, setSettings] = useState(false);
  const pathname = usePathname();

  function save(value: Consent) {
    try {
      window.localStorage.setItem(key, value);
      window.dispatchEvent(new Event(eventName));
    } catch {
      setSession(value);
    }
    setSettings(false);
  }

  return (
    <Context.Provider value={() => setSettings(true)}>
      {children}
      {!pathname.startsWith("/admin") && !saved && !session && !settings && (
        <section className={styles.banner} aria-labelledby="cookie-banner-title">
          <div className={styles.bannerCopy}>
            <h2 id="cookie-banner-title">Использование cookies</h2>
            <p>Необходимые cookies обеспечивают работу сайта. Веб-аналитика включается только с вашего разрешения. Отказ от аналитики не ограничивает доступ к сайту.</p>
            <Link href="/privacy#cookies">Политика обработки ПД и cookies</Link>
          </div>
          <div className={styles.choices}><Choices onChoose={save} /></div>
        </section>
      )}
      {settings && <Settings onChoose={save} onDismiss={() => setSettings(false)} />}
    </Context.Provider>
  );
}

export function CookieSettingsButton() {
  const open = useContext(Context);
  return <button className="text-button" type="button" onClick={open}>Настройки cookies</button>;
}

function Choices({ onChoose }: { onChoose: (value: Consent) => void }) {
  return (
    <>
      <button type="button" className="button button--outline" onClick={() => onChoose("necessary")}>Только необходимые</button>
      <button type="button" className="button button--outline" onClick={() => onChoose("analytics")}>Разрешить аналитику</button>
    </>
  );
}

function Settings({ onChoose, onDismiss }: { onChoose: (value: Consent) => void; onDismiss: () => void }) {
  const dialog = useNativeDialog();
  return (
    <dialog className={styles.settings} ref={dialog} aria-labelledby="cookie-title" onCancel={(event) => { event.preventDefault(); onDismiss(); }}>
      <div>
        <h2 id="cookie-title">Настройки cookies</h2>
        <button type="button" className="text-button" aria-label="Закрыть настройки cookies" onClick={onDismiss}>×</button>
      </div>
      <h3>Необходимые cookies</h3>
      <p>Всегда включены. Нужны для работы сайта и сохранения вашего выбора.</p>
      <h3>Веб-аналитика</h3>
      <p>Ваш выбор не влияет на отправку заявки.</p>
      <Link href="/privacy#cookies" onClick={onDismiss}>Раздел о cookies в политике</Link>
      <Choices onChoose={onChoose} />
    </dialog>
  );
}
