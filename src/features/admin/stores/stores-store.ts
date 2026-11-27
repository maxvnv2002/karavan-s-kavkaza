import { localResource } from "../local-resource";
import { emptyStore, type RetailStore } from "./stores-model";

export const storesResource = localResource<RetailStore[]>("retail-stores", [{ ...emptyStore, id: "1", order: "1" }]);
