import Image from "next/image";
import { media } from "@/lib/site";
import styles from "./home.module.css";

const steps = [
  ["Выберите продукцию", "Розничные и оптовые цены в каталоге."],
  ["Позвоните на фабрику", "Уточним наличие, объём и время получения."],
  ["Получите продукцию", "Самовывоз с фабрики. Оптовую доставку согласуйте с менеджером."],
];

export function PurchaseSteps() {
  return (
    <section id="purchase" className={styles.purchase}>
      <div className={`wrap ${styles.purchaseInner}`}>
        <h2>Условия покупки</h2>
        <ol>
          {steps.map(([title, text], index) => (
            <li key={title}>
              <span aria-hidden="true" className={styles.stepNumber}>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Factory() {
  return (
    <section id="about" className={`wrap ${styles.factory}`}>
      <figure className={styles.factoryPhoto}>
        <Image className="photo" src={media.hens} alt="Куры на выгуле у фабрики" fill sizes="(max-width: 767px) 100vw, 592px" />
      </figure>
      <div className={styles.factoryCopy}>
        <h2>О фабрике</h2>
        <p>Выращиваем птицу. Каждая партия под контролем. Работаем с частными покупателями, магазинами и предприятиями питания.</p>
      </div>
    </section>
  );
}
