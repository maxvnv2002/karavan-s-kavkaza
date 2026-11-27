"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { RequestCounter } from "./admin-shell";
import { changeRequestStatus, useRequests } from "@/features/wholesale/request-store";
import { formatPhone, type RequestStatus, type WholesaleRequest } from "@/features/wholesale/request";
import { RequestDetail } from "./request-detail";
import { RequestList } from "./request-list";
import styles from "./admin.module.css";

const filters = [["all", "Все"], ["new", "Новые"], ["active", "В работе"], ["closed", "Закрытые"]] as const;
type Filter = (typeof filters)[number][0];

export function RequestDashboardFromUrl() {
  const id = useSearchParams().get("request") ?? undefined;
  return <RequestDashboard key={id} selectedId={id} />;
}

export function RequestDashboard({ selectedId }: { selectedId?: string }) {
  const all = useRequests();
  const [selected, setSelected] = useState(selectedId);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const detail = useRef<HTMLElement>(null);
  const submit = useRef(false);
  const needle = query.trim();
  const digits = needle.replace(/\D/g, "");
  const visible = all.filter((item) => (
    (filter === "all" || item.status === filter)
    && (!needle || `№${item.number}`.includes(needle) || formatPhone(item.phone).includes(needle) || (digits && item.phone.includes(digits)))
  ));
  const active = all.find((item) => item.id === selected) ?? visible[0];

  function select(request: WholesaleRequest) {
    setSelected(request.id);
    setError("");
    requestAnimationFrame(() => detail.current?.focus());
  }

  async function setStatus(status: Exclude<RequestStatus, "new">) {
    if (!active || submit.current) return;
    submit.current = true;
    setPending(true);
    setError("");

    try {
      await changeRequestStatus(active.id, status);
      detail.current?.focus();
    } catch {
      setError("Не удалось изменить статус. Обновите страницу и попробуйте снова.");
    } finally {
      submit.current = false;
      setPending(false);
    }
  }

  return (
    <main id="main" className={styles.main}>
      <div className="mobile-only"><RequestCounter /></div>
      <h1>Заявки малого опта</h1>
      <p className={styles.subhead}>Открытые заявки включают новые и взятые в работу.</p>
      <div className={`mobile-only ${styles.mobileTools}`}>
        <button type="button" className="text-button" aria-controls="request-filters" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>Фильтры</button>
      </div>
      <div id="request-filters" className={`${styles.filters} ${expanded ? styles.expanded : ""}`}>
        <div role="group" aria-label="Статус заявки">
          {filters.map(([value, label]) => (
            <button type="button" key={value} className="text-button" aria-pressed={filter === value} onClick={() => { setSelected(undefined); setFilter(value); setError(""); }}>
              {label}{value === "all" ? ` ${all.length}` : ""}
            </button>
          ))}
        </div>
        <label>
          <span className="visually-hidden">Поиск по номеру заявки или телефону</span>
          <input type="search" value={query} maxLength={40} onChange={(event) => { setSelected(undefined); setQuery(event.target.value); setError(""); }} placeholder="Поиск по номеру заявки или телефону…" />
        </label>
      </div>
      <RequestList requests={visible} onSelect={select} limitMobile={!expanded && filter === "all" && !needle} />
      {active && <RequestDetail request={active} changeStatus={setStatus} sectionRef={detail} pending={pending} error={error} />}
    </main>
  );
}
