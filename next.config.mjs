/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    // Ensure SWC is used for all transformations
    forceSwcTransforms: true
  },
  images: {
    domains: ['images.unsplash.com'], // Allow image loading from Unsplash if needed in the future
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig; 