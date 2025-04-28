/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Explicitly enable SWC compiler
  swcMinify: true,
  experimental: {
    // Use SWC by default, don't fall back to Babel
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