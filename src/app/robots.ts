import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const url = process.env.SITE_URL;
  return { rules: { userAgent: "*", allow: "/", disallow: "/admin" }, sitemap: url ? new URL("/sitemap.xml", url).href : undefined };
}
