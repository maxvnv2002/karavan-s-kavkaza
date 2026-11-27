"use client";

import { useSearchParams } from "next/navigation";
import { WholesaleButton } from "@/features/wholesale/wholesale-button";
import { batchCount, categories, filterBatches, groups, readFilters } from "./filters";
import { ProductCard } from "./product-card";
import styles from "./catalog.module.css";

export function Catalog() {
  const params = useSearchParams();
  const filters = readFilters(params);
  const result = filterBatches(filters);

  function update(changes: Record<string, string>, replace = false) {
    const url = new URL(window.location.href);
    for (const [name, value] of Object.entries(changes)) {
      if (value) url.searchParams.set(name, value);
      else url.searchParams.delete(name);
    }
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
  }

  return (
    <main id="main" className={`wrap ${styles.catalog}`}>
      <div className={styles.intro}>
        <h1>Каталог продукции</h1>
        <p>Розничные заказы принимаем по телефону.</p>
        <label>
          <span className="visually-hidden">Поиск по каталогу</span>
          <input className="field" type="search" maxLength={100} placeholder="Поиск по каталогу" value={filters.q} onChange={(event) => update({ q: event.target.value }, true)} />
        </label>
        <WholesaleButton />
      </div>
      <div className={styles.filters}>
        <div className="price-switch" role="group" aria-label="Тип цены">
          <FilterButton active={filters.mode === "retail"} onClick={() => update({ price: "" })}>Розница</FilterButton>
          <FilterButton active={filters.mode === "wholesale"} onClick={() => update({ price: "wholesale" })}>Мелкий опт</FilterButton>
        </div>
        <div className={styles.segment} role="group" aria-label="Категория">
          {categories.map(([id, name]) => (
            <FilterButton key={id} active={(filters.category || "meat") === id} onClick={() => update({ category: filters.category === id ? "" : id, group: "" })}>{name}</FilterButton>
          ))}
        </div>
        <div className={styles.group} role="group" aria-label="Вид мяса">
          {groups.map(([id, name]) => (
            <FilterButton key={name} active={filters.group === id} disabled={filters.category === "prepared"} onClick={() => update({ group: id })}>{name}</FilterButton>
          ))}
        </div>
        <div className={styles.sort}>
          <select aria-label="Дата забоя" value={filters.date} onChange={(event) => update({ date: event.target.value })}>
            <option value="">Все забои</option>
            <option value="23">23.11.2026</option>
            <option value="21">21.11.2026</option>
          </select>
          <select aria-label="Сортировка" value={filters.sort} onChange={(event) => update({ sort: event.target.value })}>
            <option value="">Сначала свежие</option>
            <option value="oldest">Сначала ранние</option>
            <option value="price-asc">Сначала дешевле</option>
            <option value="price-desc">Сначала дороже</option>
          </select>
        </div>
        <p className={styles.count} role="status">{batchCount(result.length)}</p>
      </div>
      <section className={styles.products} aria-label="Партии продукции">
        {result.length > 0 ? (
          <div className={styles.grid}>
            {result.map((batch) => <ProductCard key={batch.id} batch={batch} mode={filters.mode} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>По выбранным параметрам ничего не найдено.</p>
            <button type="button" className="text-button" onClick={() => update({ q: "", category: "", group: "", date: "", sort: "" })}>Сбросить фильтры</button>
          </div>
        )}
        <p className={styles.note}>Фотографии иллюстративные.</p>
        <p className={styles.explanation}>Не является публичной офертой. Цены, партии и наличие уточняйте у менеджера.</p>
      </section>
    </main>
  );
}

function FilterButton({ active, disabled, onClick, children }: {
  active: boolean; disabled?: boolean; onClick: () => void; children: string;
}) {
  return <button type="button" aria-pressed={active} disabled={disabled} onClick={onClick}>{children}</button>;
}
