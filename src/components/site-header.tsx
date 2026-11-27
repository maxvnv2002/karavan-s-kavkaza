import Link from "next/link";
import { navLinks, site } from "@/lib/site";
import { BrandMark } from "./brand-mark";
import { MobileMenu } from "./mobile-menu";
import styles from "./site-header.module.css";

/** Shared navigation for the public routes. */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <BrandMark />
          {site.name}
        </Link>
        <nav aria-label="Основная навигация" className={`${styles.nav} desktop-only`}>
          {navLinks.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <a className={`${styles.phone} desktop-only`} href={site.phoneLink}>{site.phone}</a>
        <MobileMenu />
      </div>
    </header>
  );
}
