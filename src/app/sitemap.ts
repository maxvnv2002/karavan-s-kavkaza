import type { MetadataRoute } from "next";
import { batches } from "@/features/catalog/data";
import { absoluteSiteUrl, withBasePath } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/catalog", "/production", "/contacts", "/privacy", ...batches.map(({ id }) => `/catalog/${id}`)];
  return routes.flatMap((route) => {
    const pathname = process.env.BUILD_FOR_PAGES === "true" && route !== "/" ? `${route}/` : route;
    const url = absoluteSiteUrl(withBasePath(pathname));
    return url ? [{ url }] : [];
  });
}
