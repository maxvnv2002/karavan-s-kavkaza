import type { RefObject } from "react";
import { formatPhone, statuses, type RequestStatus, type WholesaleRequest } from "@/features/wholesale/request";
import { lineSummary, requestDate } from "./format";
import styles from "./admin.module.css";

export function RequestDetail({ request, changeStatus, sectionRef, pending, error }: {
  request: WholesaleRequest;
  changeStatus: (value: Exclude<RequestStatus, "new">) => void;
  sectionRef: RefObject<HTMLElement | null>;
  pending: boolean;
  error: string;
}) {
  const consentDate = request.consentVersion.match(/\d{4}-\d{2}-\d{2}$/)?.[0] ?? request.consentVersion;

  return (
    <section className={styles.detail} ref={sectionRef} tabIndex={-1} aria-label={`Заявка №${request.number}`}>
      <h2 className="desktop-only">№{request.number} · {statuses[request.status]}</h2>
      <p className={`desktop-only ${styles.cardPhone}`}>{requestDate(request.createdAt, true)} · {formatPhone(request.phone)}</p>
      <div>
        <p className="mobile-only">№{request.number} · выбранные позиции</p>
        <ul>{request.items.map((item) => <li key={item.productId}>{lineSummary(item)}</li>)}</ul>
      </div>
      <p className={`desktop-only ${styles.detailNote}`}>Без резервирования партии. Цену, наличие и получение согласовывает менеджер.</p>
      <div className={styles.consents}>
        <p className="desktop-only">Согласие на обработку персональных данных получено · редакция {consentDate}</p>
        <p className="mobile-only">ПД: согласие есть</p>
        <p>Рассылка: {request.marketingConsent ? "согласие есть" : "согласия нет"}</p>
      </div>
      <p role="status" className="visually-hidden">Статус заявки №{request.number}: {statuses[request.status]}</p>
      <div className={styles.actions}>
        {request.status === "new" && (
          <button type="button" className="button" onClick={() => changeStatus("active")} disabled={pending}>
            <span className="desktop-only">Взять в работу</span>
            <span className="mobile-only">Взять №{request.number} в работу</span>
          </button>
        )}
        {request.status !== "closed" && (
          <button type="button" className={`button ${request.status === "new" ? "desktop-only" : ""}`} onClick={() => changeStatus("closed")} disabled={pending}>Закрыть заявку</button>
        )}
        {request.status === "closed" && <span className="mobile-only">{statuses.closed}</span>}
      </div>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
