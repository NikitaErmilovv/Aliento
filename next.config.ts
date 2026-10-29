import type { NextConfig } from "next";

const melissaExport = process.env.ALIENTO_MELISSA_EXPORT === "1";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.18.0.1", "127.0.0.1", "localhost"],
  experimental: {
    cpus: 2,
  },
  ...(melissaExport
    ? {
        basePath: "/aliento",
        assetPrefix: "/aliento",
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
