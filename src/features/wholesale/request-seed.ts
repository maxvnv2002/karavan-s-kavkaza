import { consentVersion, type WholesaleRequest } from "./request";

export const initialRequests: WholesaleRequest[] = [
  { id: "request-1042", number: 1042, createdAt: "2026-11-24T10:24:00+03:00", phone: "+70000000001", items: [{ productId: "wings", quantityKg: 10 }, { productId: "liver", quantityKg: 5 }], status: "new", marketingConsent: false, consentVersion },
  { id: "request-1041", number: 1041, createdAt: "2026-11-24T09:42:00+03:00", phone: "+70000000002", items: [{ productId: "chicken", quantityKg: 20 }], status: "new", marketingConsent: true, consentVersion },
  { id: "request-1040", number: 1040, createdAt: "2026-11-23T16:10:00+03:00", phone: "+70000000003", items: [{ productId: "cutlets", quantityKg: 10 }], status: "active", marketingConsent: false, consentVersion },
  { id: "request-1039", number: 1039, createdAt: "2026-11-23T14:05:00+03:00", phone: "+70000000004", items: [{ productId: "broth", quantityKg: 15 }], status: "closed", marketingConsent: false, consentVersion },
];
