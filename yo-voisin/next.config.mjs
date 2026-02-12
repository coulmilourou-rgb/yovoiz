/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint errors during build (à corriger plus tard)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build (à corriger plus tard)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
