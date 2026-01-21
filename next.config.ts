import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // @ts-ignore - allowedDevOrigins est supporté mais pas encore typé
    allowedDevOrigins: ["192.168.1.138"],
  },
  images: {
    remotePatterns: [
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
      // Ajouter votre domaine de production ici
      // {
      //   protocol: 'https',
      //   hostname: 'api.votre-domaine.com',
      //   pathname: '/storage/**',
      // },
    ],
    // Désactiver l'optimisation des images en développement pour éviter les problèmes CORS
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
