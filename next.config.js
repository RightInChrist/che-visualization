/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static HTML export
  trailingSlash: true,
  // Optimize for static hosting
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
