import { Fields, Input, Note, Panel, Select, Textarea } from "../admin-ui";
import { CopyFields } from "../form-fields";
import { disclosureFields } from "./company-config";
import { analyticsStore, privacyStore } from "./company-store";
import { SettingsForm } from "./settings-form";
import styles from "./company.module.css";

export function PrivacyPanel() {
  return (
    <Panel variant="wide">
      <h2>Политика и отдельные согласия</h2>
      <SettingsForm resource={privacyStore} label="Сохранить черновики">
        {(values, change) => (
          <>
            <p className={styles.green}>Черновик. Публикация выключена.</p>
            <Textarea label="Политика обработки персональных данных" className={styles.policy} value={values.policy} maxLength={10000} onChange={(event) => change("policy", event.target.value)} />
            <CopyFields fields={disclosureFields.slice(0, 3)} values={values} change={change} />
            <Note>Сохранять с заявкой версию текста, дату, источник и факт каждого согласия отдельно. Ни один чекбокс не отмечается заранее.</Note>
            <Fields><CopyFields fields={disclosureFields.slice(3)} values={values} change={change} /></Fields>
          </>
        )}
      </SettingsForm>
    </Panel>
  );
}

export function AnalyticsPanel() {
  return (
    <Panel variant="wide">
      <h2>Cookies, аналитика и рассылка</h2>
      <SettingsForm resource={analyticsStore} label="Сохранить настройки">
        {(values, change) => (
          <>
            <Fields>
              <Select label="Настройки веб-аналитики" value={values.enabled} onChange={(event) => change("enabled", event.target.value)} options={[["off", "Не настроены"], ["on", "Подготовить настройки"]]} />
              <Input label="ID счётчика / провайдер" value={values.provider} onChange={(event) => change("provider", event.target.value)} maxLength={160} required={values.enabled === "on"} />
            </Fields>
            <Input label="Порядок включения" value={values.optIn} readOnly />
            <Note>Посетители могут изменить выбор в настройках cookies в подвале сайта.</Note>
            <Select label="Сбор согласия на рассылку" value={values.marketing} onChange={(event) => change("marketing", event.target.value)}
              options={[["on", "Показывать отдельный необязательный чекбокс"], ["off", "Не собирать согласие"]]} />
            <Note>Отказ от рассылки не блокирует заявку. Отправлять прайсы и акции можно только контактам с отдельным согласием, предусмотреть отзыв.</Note>
          </>
        )}
      </SettingsForm>
    </Panel>
  );
}
