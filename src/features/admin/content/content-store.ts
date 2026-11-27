import { localResource } from "../local-resource";
import { copySeed, productionSeed } from "./content-config";

export const copyStore = localResource("site-copy", copySeed);
export const productionStore = localResource("production", productionSeed);
