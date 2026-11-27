import { localResource, useResource } from "../local-resource";
import { AdminValidationError } from "../use-admin-save";
import { expiryTimestamp, type CatalogPosition, type CatalogProduct } from "./catalog-model";
import { catalogSeed } from "./catalog-seed";

export const catalogStore = localResource("catalog", catalogSeed);
export const useAdminCatalog = () => useResource(catalogStore);

export function savePosition(position: CatalogPosition, product?: CatalogProduct) {
  catalogStore.update((data) => {
    if (!data.positions.some((item) => item.id === position.id)) throw new AdminValidationError("Эта партия уже удалена.");
    if (!data.slaughters.some((item) => item.id === position.slaughterId)) throw new AdminValidationError("Выберите существующий забой.");
    if (data.positions.some((item) => item.id !== position.id && item.productId === position.productId && item.slaughterId === position.slaughterId)) {
      throw new AdminValidationError("Этот товар уже добавлен в выбранный забой.");
    }
    validatePosition(position);
    if (product) validateProduct(product, data.products);
    return {
      ...data,
      positions: data.positions.map((item) => item.id === position.id ? position : item),
      products: product ? data.products.map((item) => item.id === product.id ? product : item) : data.products,
    };
  });
}

export function addPosition(product: CatalogProduct, slaughterId: string, source?: CatalogPosition) {
  const id = crypto.randomUUID();
  catalogStore.update((data) => {
    const slaughter = data.slaughters.find((item) => item.id === slaughterId);
    if (!slaughter) throw new AdminValidationError("Сначала создайте забой.");
    if (data.positions.some((item) => item.productId === product.id && item.slaughterId === slaughterId)) {
      throw new AdminValidationError("Этот товар уже добавлен в выбранный забой.");
    }
    const existing = data.products.find((item) => item.id === product.id);
    if (!existing) validateProduct(product, data.products);
    const position: CatalogPosition = {
      id, productId: product.id, slaughterId, stock: 0, expiry: "", visible: false, discount: "inherit",
      storage: source?.storage ?? "Охлаждённый · 0…+4 °C", retail: source?.retail ?? 0, wholesale: source?.wholesale ?? 0,
      retailMin: source?.retailMin ?? 1, wholesaleMin: source?.wholesaleMin ?? 10,
    };
    return { ...data, products: existing ? data.products : [...data.products, product], positions: [...data.positions, position] };
  });
  return id;
}

function validatePosition(position: CatalogPosition) {
  if (position.expiry && !Number.isFinite(expiryTimestamp(position.expiry))) {
    throw new AdminValidationError("Укажите срок в формате ДД.ММ.ГГГГ, ЧЧ:ММ.");
  }
  if (position.visible && (!position.expiry || !position.storage.trim() || position.retail <= 0 || position.wholesale <= 0)) {
    throw new AdminValidationError("Для публикации заполните срок, хранение и обе цены.");
  }
}

function validateProduct(product: CatalogProduct, existing: CatalogProduct[]) {
  if (!product.name.trim() || !product.code.trim()) throw new AdminValidationError("Заполните название товара и артикул.");
  if (existing.some((item) => item.id !== product.id && item.code.toUpperCase() === product.code.toUpperCase())) {
    throw new AdminValidationError("Товар с этим артикулом уже есть.");
  }
}
