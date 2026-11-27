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

export const media = {
  logo: "/media/logo.png",
  farm: "/media/farm.jpg",
  hens: "/media/hens.jpg",
  chicken: "/media/chicken.jpg",
  broth: "/media/broth.jpg",
} as const;
