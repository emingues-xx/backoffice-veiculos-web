/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  eslint: {
    // Disable ESLint during builds in production
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    // Disable TypeScript errors during builds in production
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  env: {
    BFF_BASE_URL: process.env.NEXT_PUBLIC_BFF_BASE_URL || 'https://backoffice-veiculos-api-production.up.railway.app',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.webmotors.com.br',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Removed rewrites since we're using BFF directly
};

module.exports = nextConfig;
