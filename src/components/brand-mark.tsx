import Image from "next/image";
import { media } from "@/lib/site";

/** Displays the original Figma brand mark using its source crop. */
export function BrandMark() {
  return (
    <span className="brand-mark">
      <Image src={media.logo} alt="" width={73} height={59} unoptimized preload />
    </span>
  );
}
