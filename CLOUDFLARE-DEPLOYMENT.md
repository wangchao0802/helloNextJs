# Cloudflare Pages 部署指南

本项目已配置为可以部署到 Cloudflare Pages，支持 Next.js 应用和 Supabase 集成。

## 🚀 自动部署（推荐）

### 1. 连接 GitHub 仓库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** 页面
3. 点击 **Create a project**
4. 选择 **Connect to Git**
5. 连接你的 GitHub 仓库

### 2. 配置构建设置

在 Cloudflare Pages 项目配置中设置：

**Framework preset**: `Next.js`
**Build command**: `pnpm run pages:build`
**Build output directory**: `.vercel/output/static`

### 3. 设置环境变量

在 Cloudflare Pages 项目的 **Settings** -> **Environment variables** 中添加：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

⚠️ **注意**: 确保环境变量名称以 `NEXT_PUBLIC_` 开头，这样 Next.js 才能在客户端访问这些变量。

## 🛠️ 手动部署

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 构建并部署

```bash
# 构建项目
pnpm run pages:build

# 部署到 Cloudflare Pages
wrangler pages deploy .vercel/output/static
```

## 📁 项目结构

```
├── next.config.js           # Next.js 配置（已配置 Cloudflare Pages）
├── wrangler.toml           # Cloudflare Pages 配置
├── package.json            # 包含部署脚本
├── lib/
│   └── supabase.js         # Supabase 客户端配置
└── app/
    └── supabase-demo/      # Supabase 演示页面
```

## 🔧 配置说明

### next.config.js
```javascript
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
```

### wrangler.toml
```toml
name = "hellonextjs"
compatibility_date = "2023-12-18"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"

# Pages 配置
pages_build_output_dir = ".vercel/output/static"

[[pages]]
functions = ".vercel/output/functions"
```

## 🐛 常见问题

### 1. 构建失败：`vc: not found`
**解决方案**: 确保已安装 Vercel CLI
```bash
pnpm add -D vercel
```

### 2. 环境变量未生效
**解决方案**: 
- 确保变量名以 `NEXT_PUBLIC_` 开头
- 在 Cloudflare Pages 控制台中正确设置环境变量
- 重新部署项目

### 3. Supabase 连接失败
**解决方案**:
- 检查 Supabase URL 和 API Key 是否正确
- 确保 Supabase 项目已创建相应的数据表
- 检查网络连接和 CORS 设置

### 4. 图片显示异常
**解决方案**: 项目已配置 `images.unoptimized: true`，如需使用图片优化，请参考 Cloudflare Images 文档

## 📊 监控与日志

1. **实时日志**: 在 Cloudflare Dashboard 中查看部署日志
2. **分析**: 使用 Cloudflare Analytics 监控网站性能
3. **错误追踪**: 查看 Functions 标签页中的错误日志

## 🔗 有用链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)
- [Supabase 文档](https://supabase.com/docs)

## 📝 部署检查清单

- [ ] Vercel CLI 已安装 (`pnpm add -D vercel`)
- [ ] 环境变量已设置（`NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
- [ ] Supabase 项目已创建并配置
- [ ] 数据库表已创建（todos 表）
- [ ] GitHub 仓库已连接到 Cloudflare Pages
- [ ] 构建设置已正确配置
- [ ] 部署成功并可以访问

---

🎉 **完成！** 你的 Next.js + Supabase 应用现在应该可以在 Cloudflare Pages 上正常运行了！ 