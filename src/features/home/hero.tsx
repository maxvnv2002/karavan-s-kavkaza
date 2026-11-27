import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import { media } from "@/lib/site";
import styles from "./home.module.css";

export function Hero() {
  return (
    <section className={`wrap ${styles.hero}`}>
      <div className={styles.headline}>
        <h1>Мясо птицы и полуфабрикаты</h1>
        <p>Розница и малый опт</p>
      </div>
      <ActionLink href="/catalog" className={styles.heroAction}>Смотреть каталог</ActionLink>
      <figure className={styles.heroPhoto}>
        <Image className="photo" src={media.farm} alt="Птицефабрика и пастбище" fill sizes="(max-width: 767px) 100vw, 564px" preload />
      </figure>
      <div className={`soft-green ${styles.schedule}`}>
        <p className={styles.dates}>
          Последний забой: 23.11.2026<br />
          Плановый забой: 26.11.2026
        </p>
        <p className="muted">Плановая дата может измениться.</p>
      </div>
    </section>
  );
}
