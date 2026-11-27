import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/site";
import { Note, Notice } from "../admin-ui";
import { FilePicker } from "../file-picker";
import { readFile } from "../local-files";
import styles from "./content.module.css";

export function HeroPhotoField({ fileId, selection, choose }: { fileId: string; selection?: File; choose: (file: File) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const target = ref.current;
    if (!target || (!fileId && !selection)) return;
    const controller = new AbortController();
    let url: string | undefined;

    async function show() {
      const file = selection ?? await readFile(fileId);
      if (file && !controller.signal.aborted && target) {
        url = URL.createObjectURL(file);
        target.style.backgroundImage = `url("${url}")`;
        target.dataset.custom = "true";
      }
    }
    void show().catch(() => { if (!controller.signal.aborted) setNotice("Не удалось загрузить сохранённое фото."); });
    return () => {
      controller.abort();
      if (url) URL.revokeObjectURL(url);
      delete target.dataset.custom;
      target.style.removeProperty("background-image");
    };
  }, [fileId, selection]);

  return (
    <div className={styles.photoRow}>
      <div className={styles.photo} ref={ref}><Image src={media.farm} alt="Фотография фабрики" fill sizes="150px" unoptimized /></div>
      <div className={styles.photoText}>
        <p>Фотография первого экрана</p>
        <FilePicker buttonClass={`text-button ${styles.green}`} accept="image/jpeg,image/png" busy={false} pick={(file) => {
          if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 10 * 1024 * 1024 || !file.size) {
            setNotice("Выберите JPG или PNG до 10 МБ.");
            return;
          }
          setNotice("");
          choose(file);
        }}>Заменить фото</FilePicker>
        <Note className={styles.small}>{selection?.name ?? "JPG или PNG, до 10 МБ"}</Note>
        <Notice message={notice} error />
      </div>
    </div>
  );
}
