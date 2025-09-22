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
    BFF_BASE_URL: process.env.BFF_BASE_URL || 'http://localhost:3002',
  },
  async rewrites() {
    const bffBaseUrl = process.env.BFF_BASE_URL || 'http://localhost:3002';

    return [
      {
        source: '/api/:path*',
        destination: `${bffBaseUrl}/api/:path*`,
      },
      {
        source: '/health',
        destination: `${bffBaseUrl}/health`,
      },
    ];
  },
};

module.exports = nextConfig;
