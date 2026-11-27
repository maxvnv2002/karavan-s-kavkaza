import type { NextConfig } from "next";

const pages = process.env.BUILD_FOR_PAGES === "true";
const basePath = pages ? (process.env.PAGES_BASE_PATH ?? "/karavan-s-kavkaza") : "";

const config: NextConfig = {
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(pages ? {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {
    async redirects() {
      return [
        { source: "/admin/catalog/products/:id", destination: "/admin/catalog/products?id=:id", permanent: false },
        { source: "/admin/catalog/slaughters/:id", destination: "/admin/catalog/slaughters?id=:id", permanent: false },
      ];
    },
  }),
};

export default config;
