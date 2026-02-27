import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // AWS S3/CloudFlare R2 - Production (accès direct)
      {
        protocol: 'https',
        hostname: '367be3a203552894324007d0096e0cd.r2.cloudflarestorage.com',
        pathname: '/**',
      },
      // Laravel Cloud - Production (domaine principal)
      {
        protocol: 'https',
        hostname: 'fls-a0e47b48-31ff-4bd2-a880-530e181a3129.laravel.cloud',
        pathname: '/**',
      },
      // Laravel Cloud - Ancien domaine (fallback)
      {
        protocol: 'https',
        hostname: 'nutriscan-main-yyhc0n.laravel.cloud',
        pathname: '/**',
      },
      // Localhost - Développement
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      // Google OAuth
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.google.com',
        pathname: '**',
      },
    ],
    // Désactiver l'optimisation des images en développement pour éviter les problèmes CORS
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
