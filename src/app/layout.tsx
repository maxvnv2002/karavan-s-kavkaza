import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { CookiePreferences } from "@/features/legal/cookies";
import { WholesaleProvider } from "@/features/wholesale/wholesale-button";
import { media, site } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#fbfcf7",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  icons: { icon: media.logo },
  ...(process.env.SITE_URL ? { metadataBase: new URL(process.env.SITE_URL) } : {}),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: "Мясо птицы и полуфабрикаты с фабрики. Розничный каталог, партии продукции и заявки малого опта.",
  openGraph: {
    title: site.name,
    description: "Мясо птицы и полуфабрикаты с фабрики. Розница и мелкий опт.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <a className="skip-link" href="#main">Перейти к содержанию</a>
        <CookiePreferences><WholesaleProvider>{children}</WholesaleProvider></CookiePreferences>
      </body>
    </html>
  );
}
