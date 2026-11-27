import { site } from "@/lib/site";
import type { CopyField } from "../form-fields";

export const companyFields = [
  { key: "legalName", label: "Полное юридическое наименование *" },
  { key: "taxId", label: "ИНН *" },
  { key: "registrationId", label: "ОГРН / ОГРНИП *" },
  { key: "email", label: "Контактный email *", type: "email" },
  { key: "legalAddress", label: "Юридический адрес *" },
  { key: "officeAddress", label: "Фактический адрес *" },
  { key: "phone", label: "Телефон компании *", type: "tel", hint: site.phone },
  { key: "brand", label: "Бренд на сайте" },
] as const satisfies readonly CopyField[];

export const companySeed: Record<string, string> = { brand: site.name };

export const disclosureFields = [
  { key: "requiredConsent", label: "Текст обязательного согласия" },
  { key: "marketingConsent", label: "Текст необязательного согласия" },
  { key: "version", label: "Версия и дата публикации" },
  { key: "retention", label: "Срок хранения заявок" },
  { key: "withdrawal", label: "Запросы на отзыв и удаление", hint: "Контакт оператора" },
] as const satisfies readonly CopyField[];

export const privacySeed: Record<string, string> = {
  policy: "Оператор: [полное наименование, ИНН, адрес, email].\nЦели: рассмотрение заявки и обратная связь. Данные: телефон и состав заявки.\nСрок хранения: [указать обоснованный срок]. Отзыв и обращения: [email оператора].\nПолучатели, обработчики, хранение, защита и аналитика: заполнить перед публикацией.",
  requiredConsent: "Обработка ПД для заявки и обратного звонка · отдельный документ",
  marketingConsent: "Получение прайсов и акций по указанному телефону",
};

export const analyticsSeed: Record<string, string> = {
  enabled: "off", provider: "", optIn: "Только после отдельного выбора посетителя · без предвыбора", marketing: "on",
};

export const documents = [
  { id: "compliance", title: "Декларации о соответствии", note: "Проверьте список продукции, номер и срок действия перед публикацией.", accept: ".pdf" },
  { id: "company", title: "Карточка предприятия (PDF)", note: "При изменении реквизитов загрузите новую версию PDF.", accept: ".pdf" },
  { id: "contract", title: "Типовой договор поставки", note: "Образец без данных конкретного покупателя. PDF или DOCX.", accept: ".pdf,.docx" },
] as const;

export type DocumentInfo = { fileId: string; fileName: string; published: boolean };
