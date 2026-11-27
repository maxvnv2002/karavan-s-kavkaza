const numberFormat = new Intl.NumberFormat("ru-RU");

export function formatNumber(value: number) {
  return numberFormat.format(value);
}

export function rubles(value: number) {
  return `${formatNumber(value)} ₽`;
}
