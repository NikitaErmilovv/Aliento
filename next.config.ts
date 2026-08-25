import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev assets/HMR when opening the site via LAN IP (not only localhost).
  allowedDevOrigins: ["172.18.0.1", "127.0.0.1", "localhost"],
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;
