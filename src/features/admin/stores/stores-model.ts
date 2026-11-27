export type RetailStore = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  map: string;
  order: string;
  published: boolean;
  promote: boolean;
};

export const emptyStore = { name: "", address: "", phone: "", hours: "", map: "", published: false, promote: true };

export function canPublishStore(value: RetailStore) {
  return !!(value.name.trim() && value.address.trim() && value.phone.replace(/\D/g, "").length >= 10 && value.hours.trim());
}

export function mapLink(value: string) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
