import { localResource } from "../local-resource";
import { analyticsSeed, companySeed, privacySeed, type DocumentInfo } from "./company-config";

export const companyStore = localResource("company", companySeed);
export const privacyStore = localResource("privacy", privacySeed);
export const analyticsStore = localResource("analytics", analyticsSeed);
export const documentStore = localResource<Record<string, DocumentInfo>>("documents", {});
