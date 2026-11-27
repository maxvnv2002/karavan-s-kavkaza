"use client";

import { useEffect, useRef, useState } from "react";
import { useNativeDialog } from "@/components/use-native-dialog";
import type { ProductId } from "@/features/catalog/data";
import { PolicyContent } from "@/features/legal/policy-content";
import { maxLines } from "./request";
import { RequestLine } from "./request-line";
import { useRequestDraft } from "./use-request-draft";
import styles from "./request-dialog.module.css";

export function RequestDialog({ product, onDismiss }: { product?: ProductId; onDismiss: () => void }) {
  const dialog = useNativeDialog();
  const intro = useRef<HTMLHeadingElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const policyLink = useRef<HTMLButtonElement>(null);
  const wasPolicy = useRef(false);
  const [policy, setPolicy] = useState(false);
  const draft = useRequestDraft(product);

  useEffect(() => {
    if (policy) back.current?.focus();
    else if (wasPolicy.current) policyLink.current?.focus();
    wasPolicy.current = policy;
  }, [policy]);

  useEffect(() => {
    if (draft.saved) intro.current?.focus();
  }, [draft.saved]);

  function dismiss() {
    if (policy) setPolicy(false);
    else onDismiss();
  }

  return (
    <dialog ref={dialog} className={`${styles.dialog} ${policy ? styles.policyMode : ""}`}
      aria-labelledby={policy ? "request-policy-title" : "request-title"} onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}>
      <div hidden={policy} className={styles.panel}>
        <header className={styles.header}>
          <h2 id="request-title" ref={intro} tabIndex={-1}>{draft.saved ? "Заявка сохранена" : "Заявка малого опта"}</h2>
          <button className="text-button" type="button" onClick={onDismiss} disabled={draft.pending}>Закрыть</button>
        </header>
        {draft.saved ? (
          <div className={styles.confirmation}>
            <p>Номер заявки <strong>№{draft.saved.number}</strong></p>
            <button type="button" className="button" onClick={onDismiss}>Вернуться к покупкам</button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={(event) => { event.preventDefault(); void draft.submit(); }}>
            <div className={styles.scroll}>
              <fieldset disabled={draft.pending} className={styles.body}>
                <legend>Что хотите купить</legend>
                {draft.lines.map((line) => (
                  <RequestLine key={line.id} line={line} lines={draft.lines}
                    update={(values) => draft.updateLine(line.id, values)} remove={() => draft.removeLine(line.id)} />
                ))}
                <button type="button" className="button button--full" disabled={draft.lines.length >= maxLines} onClick={draft.addLine}>+ Добавить продукцию</button>
                <label className={styles.phone}>
                  <span>Телефон для обратного звонка *</span>
                  <input className="field" type="tel" placeholder="+7 (___) ___-__-__" required maxLength={26} value={draft.phone}
                    onChange={(event) => draft.setPhone(event.target.value)} />
                </label>
                <p className={styles.note}>Заявка не резервирует продукцию. Итоговые цены, партии и условия согласовываются с менеджером.</p>
                <label className={styles.check}>
                  <input type="checkbox" required checked={draft.personalConsent} onChange={(event) => draft.setPersonalConsent(event.target.checked)} />
                  <span>Даю согласие на обработку персональных данных для рассмотрения заявки и обратного звонка. Обязательно.</span>
                </label>
                <label className={styles.check}>
                  <input type="checkbox" checked={draft.marketingConsent} onChange={(event) => draft.setMarketingConsent(event.target.checked)} />
                  <span>Отдельно согласен получать прайсы и акции по указанному телефону. Необязательно; на заявку не влияет.</span>
                </label>
                <button type="button" ref={policyLink} className={`text-button ${styles.policyLink}`} onClick={() => setPolicy(true)}>
                  Политика обработки ПД и тексты согласий
                </button>
                <p className={styles.lineNote}>Информация о продукции и ценах не является публичной офертой.</p>
              </fieldset>
            </div>
            <div className={styles.submit}>
              {draft.error && <p role="alert">{draft.error}</p>}
              <button type="submit" className="button button--full" disabled={!draft.canSubmit || draft.pending}>
                {draft.pending ? "Сохраняем…" : "Отправить заявку"}
              </button>
            </div>
          </form>
        )}
      </div>
      {policy && (
        <div className={styles.policyPanel}>
          <header className={styles.policyHeader}>
            <button type="button" className="text-button" ref={back} onClick={() => setPolicy(false)}>Закрыть и вернуться к заявке</button>
          </header>
          <div className={styles.scroll}><PolicyContent inDialog /></div>
        </div>
      )}
    </dialog>
  );
}
