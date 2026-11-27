import Link from "next/link";
import type { ComponentProps } from "react";

export type ActionLinkProps = ComponentProps<typeof Link> & { accent?: boolean; full?: boolean };

/** Primary or accent action rendered as a semantic link. */
export function ActionLink({ accent, full, className, ...props }: ActionLinkProps) {
  const classes = ["button", accent && "button--accent", full && "button--full", className].filter(Boolean);
  return <Link {...props} className={classes.join(" ")} />;
}
