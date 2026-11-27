import Link from "next/link";
import { Button, Note, Panel } from "../admin-ui";
import { positionHref } from "./catalog-controls";
import { displayDate, positionContext, pricePreview, type CatalogData, type CatalogPosition, type CatalogProduct } from "./catalog-model";
import styles from "./position.module.css";

export function PositionSidebar({ data, product, position, add, remove }: {
  data: CatalogData; product: CatalogProduct; position: CatalogPosition; add: () => void; remove: (scope: "position" | "product") => void;
}) {
  const price = pricePreview(data, position, product);
  const { slaughter } = positionContext(data, position);
  const other = data.positions.filter((item) => item.productId === product.id && item.id !== position.id);

  return (
    <aside className={styles.stack} aria-label="Результат и другие партии">
      <Panel variant="green">
        <h2>Публикация · {price.visible ? "на сайте" : "скрыта"}</h2>
        {price.visible && <p className={styles.green}>Доступный остаток: {position.stock} кг</p>}
        <p>Забой {slaughter && displayDate(slaughter.date)}</p>
        <p className={styles.price}>
          Розница {price.retail} ₽ {price.percent > 0 && <del>{position.retail} ₽</del>} / кг<br />
          Мелкий опт {price.wholesale} ₽ {price.percent > 0 && <del>{position.wholesale} ₽</del>} / кг<br />
          Минимум опта {position.wholesaleMin} кг
        </p>
        <Note>{price.manual !== undefined && position.discount === "inherit" ? `Применена скидка забоя ${price.manual}%.` : price.percent ? `Применена автоскидка ${price.percent}%.` : "Скидка не применяется."}</Note>
        <Note>Срок годности: {position.expiry ? `до ${position.expiry.replace(/\.\d{4},/, ",")}.` : "не указан."}</Note>
        <Note>При скрытии, нулевом остатке или истечении срока позиция исчезнет с сайта.</Note>
      </Panel>
      <Panel>
        <h3>Другие партии этого товара</h3>
        {other.map((item) => {
          const next = positionContext(data, item).slaughter;
          const preview = pricePreview(data, item);
          return (
            <Link key={item.id} href={positionHref(item.id)}>
              {next && displayDate(next.date)}<br />{item.stock} кг · {preview.percent ? `скидка ${preview.percent}%` : "без скидки"}<br />{preview.retail} / {preview.wholesale} ₽ за кг
            </Link>
          );
        })}
        {!other.length && <Note>Других партий пока нет.</Note>}
        <Button width="100%" onClick={add}>+ В другой забой</Button>
        <Note className={styles.small}>Товар остаётся один в справочнике. Новая партия создаёт отдельную карточку в каталоге.</Note>
      </Panel>
      <Panel>
        <button type="button" className={`text-button ${styles.quiet}`} onClick={() => remove("position")}>Убрать из этого забоя…</button>
        <button type="button" className={`text-button ${styles.quiet}`} onClick={() => remove("product")}>Удалить товар во всех партиях…</button>
      </Panel>
    </aside>
  );
}
