import type { ComponentProps } from "react";
import { Input, Textarea } from "./admin-ui";

export type CopyField = {
  key: string;
  label: string;
  hint?: string;
  type?: ComponentProps<"input">["type"];
  multiline?: boolean;
  maxLength?: number;
};

export function CopyFields({ fields, values, change }: {
  fields: readonly CopyField[];
  values: Record<string, string>;
  change: (key: string, value: string) => void;
}) {
  return fields.map(({ key, label, hint, type, multiline, maxLength }) => {
    const props = { label, value: values[key] ?? "", placeholder: hint, maxLength: maxLength ?? (multiline ? 3000 : 500),
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => change(key, event.target.value) };
    return multiline ? <Textarea key={key} {...props} /> : <Input key={key} type={type} {...props} />;
  });
}
