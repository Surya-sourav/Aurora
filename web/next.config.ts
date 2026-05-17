import type { NextConfig } from 'next';
import path from 'node:path';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const apiParsed = new URL(apiUrl);

const config: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: apiParsed.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiParsed.hostname,
        port: apiParsed.port || undefined,
        pathname: '/images/**',
      },
      {
        protocol: apiParsed.protocol.replace(':', '') as 'http' | 'https',
        hostname: apiParsed.hostname,
        port: apiParsed.port || undefined,
        pathname: '/personal/images/**',
      },
    ],
  },
};

export default config;
