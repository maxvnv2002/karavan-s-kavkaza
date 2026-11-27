"use client";

import { AdminMain, Fields, Heading, Note, Panel } from "../admin-ui";
import { CopyFields } from "../form-fields";
import { companyFields } from "./company-config";
import { companyStore } from "./company-store";
import { DocumentsPanel } from "./documents-panel";
import { AnalyticsPanel, PrivacyPanel } from "./privacy-panel";
import { SettingsForm } from "./settings-form";
import styles from "./company.module.css";

export function CompanyDashboard() {
  return (
    <AdminMain className={styles.main}>
      <Heading title="Реквизиты, документы и приватность" />
      <Panel variant="wide">
        <h2>Компания и контакты оператора ПД</h2>
        <SettingsForm resource={companyStore} label="Сохранить реквизиты">
          {(values, change) => (
            <>
              <div className={styles.companyFields}><Fields><CopyFields fields={companyFields} values={values} change={change} /></Fields></div>
              <Note>Укажите реквизиты оператора для страницы контактов, политики и согласий.</Note>
            </>
          )}
        </SettingsForm>
      </Panel>
      <DocumentsPanel />
      <PrivacyPanel />
      <AnalyticsPanel />
    </AdminMain>
  );
}
