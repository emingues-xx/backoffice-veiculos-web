/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
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
