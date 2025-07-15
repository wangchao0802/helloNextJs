/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出配置 for Cloudflare Pages
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 避免在构建时出现错误
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
