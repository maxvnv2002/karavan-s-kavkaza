export const site = {
  name: "Караван с Кавказа",
  phone: "+7 (000) 000-00-00",
  phoneLink: "tel:+70000000000",
  hours: "Пн–пт 08:00–18:00 · Сб 09:00–14:00",
  address: "с. Луговое, ул. Фермерская, 1",
  year: 2026,
} as const;

export const navLinks = [
  ["/catalog", "Каталог"],
  ["/#about", "О фабрике"],
  ["/#purchase", "Условия покупки"],
  ["/contacts", "Контакты"],
] as const;

export function withBasePath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

export function absoluteSiteUrl(path: string) {
  const url = process.env.SITE_URL;
  return url ? new URL(path, url).href : undefined;
}

export const media = {
  logo: withBasePath("/media/logo.png"),
  farm: withBasePath("/media/farm.jpg"),
  hens: withBasePath("/media/hens.jpg"),
  chicken: withBasePath("/media/chicken.jpg"),
  broth: withBasePath("/media/broth.jpg"),
} as const;
