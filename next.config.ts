import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // @ts-ignore - allowedDevOrigins est supporté mais pas encore typé
    allowedDevOrigins: ["192.168.1.138"],
  },
};

export default nextConfig;
