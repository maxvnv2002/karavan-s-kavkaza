"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";
import { useRequests } from "@/features/wholesale/request-store";
import { site } from "@/lib/site";
import styles from "./shell.module.css";

const sections = [
  ["/admin/catalog", "Каталог"],
  ["/admin/requests", "Заявки"],
  ["/admin/content", "Содержимое сайта"],
  ["/admin/company", "Реквизиты и документы"],
  ["/admin/stores", "Магазины"],
] as const;

function RequestCount() {
  const count = useRequests().filter((request) => request.status !== "closed").length;
  return <strong className={styles.badge}><span className="visually-hidden">Открытые заявки: </span>{count}</strong>;
}

export function RequestCounter({ link = false }: { link?: boolean }) {
  const content = <>Заявки <RequestCount /></>;
  return link ? <Link className={styles.counter} href="/admin/requests">{content}</Link> : <p className={styles.counter}>{content}</p>;
}

export function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return <Shell key={path} path={path}>{children}</Shell>;
}

function Shell({ children, path }: { children: ReactNode; path: string }) {
  const [open, setOpen] = useState(false);
  const pageBackground = ["/admin/requests", "/admin/company", "/admin/stores"].includes(path);

  return (
    <div className={`${styles.admin} ${pageBackground ? "page" : ""}`}>
      <header className={styles.header}>
        <Link href="/admin/catalog" className={styles.brand} onClick={() => setOpen(false)}>
          <BrandMark />
          <span><strong>{site.name}</strong><small>Управление сайтом</small></span>
        </Link>
        <Link href="/" className={styles.desktop}>Открыть сайт</Link>
        <button type="button" className={`text-button ${styles.menu}`} aria-controls="admin-nav" aria-expanded={open} onClick={() => setOpen(!open)}>Меню</button>
      </header>
      <div className={styles.shell}>
        <aside id="admin-nav" className={`${styles.sidebar} ${open ? styles.open : ""}`}>
          <nav aria-label="Управление сайтом">
            {sections.map(([href, title]) => (
              <Link key={href} href={href} aria-current={path === href ? "page" : path.startsWith(href + "/") ? "location" : undefined} onClick={() => setOpen(false)}>
                {title}{href === "/admin/requests" && <RequestCount />}
              </Link>
            ))}
            <Link className={styles.menu} href="/">Открыть сайт</Link>
          </nav>
        </aside>
        {children}
      </div>
    </div>
  );
}
