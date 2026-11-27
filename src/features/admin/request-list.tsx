import { formatPhone, statuses, type WholesaleRequest } from "@/features/wholesale/request";
import { requestDate, requestSummary } from "./format";
import styles from "./admin.module.css";

export function RequestList({ requests, onSelect, limitMobile }: {
  requests: WholesaleRequest[];
  onSelect: (request: WholesaleRequest) => void;
  limitMobile: boolean;
}) {
  if (!requests.length) return <p className={styles.empty}>Заявок по этим параметрам нет.</p>;

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>{["Заявка", "Создана", "Телефон", "Выбранная продукция", "Статус", "Действие"].map((label) => <th key={label} scope="col">{label}</th>)}</tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>№{request.number}</td>
              <td>{requestDate(request.createdAt)}</td>
              <td>{formatPhone(request.phone)}</td>
              <td>{requestSummary(request.items)}</td>
              <td>{statuses[request.status]}</td>
              <td><button className="text-button" type="button" aria-label={`Открыть заявку №${request.number}`} onClick={() => onSelect(request)}>Открыть</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className={styles.cards}>
        {requests.map((request, index) => (
          <li key={request.id} hidden={limitMobile && index > 2}>
            <h2>№{request.number} · {statuses[request.status]}</h2>
            <p className={styles.cardDate}>{requestDate(request.createdAt)}</p>
            <p className={styles.cardPhone}>{formatPhone(request.phone)}</p>
            <p>{requestSummary(request.items)}</p>
            <button className="button button--full" type="button" aria-label={`Открыть заявку №${request.number}`} onClick={() => onSelect(request)}>Открыть заявку</button>
          </li>
        ))}
      </ul>
    </>
  );
}
