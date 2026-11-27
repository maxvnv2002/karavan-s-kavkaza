import { isProductId, products } from "@/features/catalog/data";
import { maxQuantity } from "./request";
import type { DraftLine } from "./use-request-draft";
import styles from "./request-dialog.module.css";

export function RequestLine({ line, lines, update, remove }: {
  line: DraftLine;
  lines: DraftLine[];
  update: (values: Partial<Omit<DraftLine, "id">>) => void;
  remove: () => void;
}) {
  const product = products[line.productId];
  const minimum = product.minimum;
  const invalid = line.quantity !== "" && (Number(line.quantity) < minimum || Number(line.quantity) > maxQuantity);
  const description = `request-quantity-${line.id}`;

  return (
    <div className={styles.line}>
      <div className={styles.fields}>
        <label>
          <span>Товар</span>
          <select className="field" value={line.productId} onChange={(event) => {
            const id = event.target.value;
            if (isProductId(id)) update({ productId: id, quantity: String(products[id].minimum) });
          }}>
            {Object.entries(products).map(([id, entry]) => (
              <option key={id} value={id} disabled={lines.some((other) => other.id !== line.id && other.productId === id)}>{entry.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Объём, кг</span>
          <input className="field" type="number" step="any" min={minimum} max={maxQuantity} value={line.quantity} required
            aria-describedby={description} aria-invalid={invalid || undefined}
            onChange={(event) => update({ quantity: event.target.value })}
          />
        </label>
      </div>
      <div className={styles.lineNote}>
        <p id={description}>Минимум {minimum} кг</p>
        <button className="text-button" type="button" aria-label={`Удалить позицию: ${product.name}`} onClick={remove}>Удалить позицию</button>
      </div>
    </div>
  );
}
