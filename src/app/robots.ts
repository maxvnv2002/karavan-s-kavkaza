import type { MetadataRoute } from "next";
import { absoluteSiteUrl, withBasePath } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: withBasePath("/"), disallow: withBasePath("/admin") },
    sitemap: absoluteSiteUrl(withBasePath("/sitemap.xml")),
  };
}
