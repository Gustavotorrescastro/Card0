import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. images.domains foi substituído por remotePatterns por segurança
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // 2. O Next.js moderno (App Router) não usa mais a chave "i18n" aqui.
  // A internacionalização agora é feita via middleware e pastas [lang].
  // Se você estiver usando App Router, pode remover a chave i18n.

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/:path*',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/simulador-risco-operacional',
        permanent: false,
      },
    ];
  },

  // 3. appDir não é mais necessário em 'experimental', já é o padrão.
};

export default nextConfig;