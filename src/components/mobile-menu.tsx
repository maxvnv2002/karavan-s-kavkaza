"use client";

import Link from "next/link";
import { useRef } from "react";
import { navLinks, site } from "@/lib/site";
import styles from "./site-header.module.css";

export function MobileMenu() {
  const menu = useRef<HTMLDetailsElement>(null);

  function close() {
    if (menu.current) menu.current.open = false;
  }

  return (
    <details className={`mobile-only ${styles.menu}`} ref={menu} onKeyDown={(event) => {
      if (event.key === "Escape" && menu.current?.open) {
        close();
        menu.current.querySelector("summary")?.focus();
      }
    }}>
      <summary>Меню</summary>
      <nav aria-label="Мобильная навигация">
        {navLinks.map(([href, label]) => <Link key={href} href={href} onClick={close}>{label}</Link>)}
        <a href={site.phoneLink} onClick={close}>{site.phone}</a>
      </nav>
    </details>
  );
}
