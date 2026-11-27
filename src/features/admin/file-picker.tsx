import { useId, useRef } from "react";
import { Button } from "./admin-ui";

export function FilePicker({ children, accept, width, busy, buttonClass, pick }: {
  children: string; accept: string; width?: number; busy: boolean; buttonClass?: string; pick: (file: File) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  return (
    <>
      <input hidden ref={input} type="file" id={id} accept={accept} onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) pick(file);
        event.target.value = "";
      }} />
      {buttonClass ? <button type="button" className={buttonClass} disabled={busy} onClick={() => input.current?.click()}>{children}</button>
        : <Button width={width} disabled={busy} onClick={() => input.current?.click()}>{children}</Button>}
    </>
  );
}
