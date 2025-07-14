/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置 Cloudflare Pages
  experimental: {
    runtime: 'nodejs',
  },
  // 静态导出配置
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
