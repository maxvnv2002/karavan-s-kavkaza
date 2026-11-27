import type { MetadataRoute } from "next";
import { batches } from "@/features/catalog/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.SITE_URL;
  if (!url) return [];
  const routes = ["/", "/catalog", "/production", "/contacts", "/privacy", ...batches.map(({ id }) => `/catalog/${id}`)];
  return routes.map((route) => ({ url: new URL(route, url).href }));
}
