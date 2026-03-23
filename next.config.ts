import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'pub-4ce47cb45f514d68a7bca7e1ad862db3.r2.dev',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
