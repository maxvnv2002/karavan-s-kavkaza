import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PolicyContent, policyTitle } from "@/features/legal/policy-content";
import styles from "@/features/legal/policy.module.css";

export const metadata: Metadata = {
  title: policyTitle,
  description: "Информация о персональных данных, согласиях и настройках cookies.",
};

export default function PrivacyPage() {
  return (
    <div className="page">
      <SiteHeader />
      <main id="main" className={`wrap ${styles.policy}`}>
        <Link href="/" className={styles.back}>На главную</Link>
        <PolicyContent />
      </main>
      <SiteFooter compact privacy />
    </div>
  );
}
