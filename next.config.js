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
  async rewrites() {
    const bffBaseUrl = process.env.NEXT_PUBLIC_BFF_BASE_URL || 'https://backoffice-veiculos-api-production.up.railway.app';
    
    // Debug log to see what URL is being used
    console.log('BFF Base URL:', bffBaseUrl);
    console.log('NEXT_PUBLIC_BFF_BASE_URL env var:', process.env.NEXT_PUBLIC_BFF_BASE_URL);

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
