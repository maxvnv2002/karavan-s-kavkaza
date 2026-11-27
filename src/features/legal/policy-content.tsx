import styles from "./policy.module.css";

const policy = [
  ["1. Оператор персональных данных", "Наименование, реквизиты и контакты оператора готовятся к публикации."],
  ["2. Какие данные и для чего", "Телефон и выбранная продукция с объёмами — для рассмотрения заявки малого опта и обратной связи.", "Прайсы и акции — только при отдельном необязательном согласии. Отказ от рассылки не влияет на рассмотрение заявки."],
  ["3. Обработка, хранение и получатели", "Сведения о порядке и сроках обработки будут доступны после публикации политики."],
  ["4. Обращения и отзыв согласия", "Контакты для исправления, удаления данных и отзыва согласия готовятся к публикации."],
  ["5. Cookies и веб-аналитика", "Необходимые cookies поддерживают работу сайта и сохраняют ваш выбор. Веб-аналитика требует отдельного разрешения.", "Изменить выбор можно в разделе «Настройки cookies» в подвале сайта."],
];

const consents = [
  ["Согласие на обработку персональных данных", "В форме заявки согласие на обработку телефона и сведений о заявке отмечается отдельно."],
  ["Согласие на получение прайсов и акций", "Вы можете отдельно согласиться на получение прайсов и акций по указанному телефону. Это необязательно для заявки."],
];

export const policyTitle = "Политика обработки персональных данных";

export function PolicyContent({ inDialog = false }: { inDialog?: boolean }) {
  const Title = inDialog ? "h2" : "h1";
  const SectionTitle = inDialog ? "h3" : "h2";

  return (
    <div className={`${styles.content} ${inDialog ? styles.inDialog : ""}`}>
      <Title id={inDialog ? "request-policy-title" : undefined}>{policyTitle}</Title>
      <section className={styles.notice}>
        <SectionTitle>Документы готовятся к публикации</SectionTitle>
        <p>Утверждённые тексты политики и согласий будут доступны на этой странице.</p>
      </section>
      {policy.map(([title, ...paragraphs], index) => (
        <section className={styles.clause} key={title} id={!inDialog && index === 4 ? "cookies" : undefined}>
          <SectionTitle>{title}</SectionTitle>
          <div>{paragraphs.map((value) => <p key={value}>{value}</p>)}</div>
        </section>
      ))}
      {consents.map(([title, ...paragraphs]) => (
        <section className={styles.consent} key={title}>
          <SectionTitle>{title}</SectionTitle>
          <div>{paragraphs.map((value) => <p key={value}>{value}</p>)}</div>
        </section>
      ))}
    </div>
  );
}
