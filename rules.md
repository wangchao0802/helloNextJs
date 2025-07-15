# Cursor Rules - Next.js & Cloudflare 全栈开发规范

> 基于 Next.js 2025 年最佳实践，专注于性能优化、SEO 友好、项目结构清晰和现代开发体验

## 🚀 核心技术栈

- **框架**: Next.js 15+ (App Router + React Server Components)
- **包管理器**: pnpm (强制要求)
- **语言**: TypeScript (必须)
- **样式**: Tailwind CSS
- **部署平台**: Cloudflare Pages
- **数据库**: Supabase (推荐)
- **样式**: Tailwind CSS
- **语言**: TypeScript

## 📦 包管理规范

### pnpm 强制使用原则
- 禁止使用 npm/yarn，统一使用 pnpm
- 保留 `pnpm-lock.yaml` 文件
- 定期使用 `pnpm dlx depcheck` 清理未使用依赖
- monorepo 项目使用 `pnpm workspace`

## 🏗️ 项目结构规范

### App Router 目录架构 (2025 标准)
```
app/                         # App Router 主目录
├── (auth)/                  # 路由分组 - 认证相关
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx           # 认证页面专用布局
├── (dashboard)/             # 路由分组 - 仪表盘
│   ├── analytics/
│   ├── settings/
│   └── layout.tsx           # 仪表盘布局
├── api/                     # API 路由 (Route Handlers)
│   ├── auth/
│   │   └── route.ts
│   ├── users/
│   │   └── [id]/
│   │       └── route.ts
│   └── webhook/
│       └── route.ts
├── [locale]/                # 国际化动态路由
│   └── [...slug]/
│       └── page.tsx
├── globals.css              # 全局样式
├── layout.tsx               # 根布局 (RootLayout)
├── page.tsx                 # 首页
├── loading.tsx              # 全局加载UI
├── error.tsx                # 全局错误边界
├── not-found.tsx            # 404页面
└── sitemap.ts               # 自动生成sitemap

components/                  # 可复用 UI 组件
├── ui/                      # 基础 UI 组件 (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   └── modal.tsx
├── forms/                   # 表单组件
├── layouts/                 # 布局组件
└── features/                # 功能模块组件
    ├── auth/
    └── dashboard/

lib/                         # 共享逻辑
├── api/                     # API 客户端函数
├── auth/                    # 认证相关
├── db/                      # 数据库相关
├── hooks/                   # 自定义 Hooks
├── stores/                  # 状态管理
├── utils/                   # 工具函数
├── validations/             # 数据验证 schemas
├── constants.ts             # 常量定义
└── types.ts                 # TypeScript 类型

styles/                      # 样式文件
├── globals.css
├── components.css
└── themes/

public/                      # 静态资源
├── images/                  # 优化图片
├── icons/                   # 图标文件
├── robots.txt               # SEO 配置
└── manifest.json            # PWA 配置

middleware.ts                # 中间件 (认证、国际化等)
next.config.js              # Next.js 配置
tailwind.config.ts          # Tailwind 配置
tsconfig.json               # TypeScript 配置
```

### 文件命名规范 (严格执行)
- **目录**: kebab-case (`user-profile`, `auth-forms`)
- **组件**: PascalCase (`UserCard.tsx`, `AuthButton.tsx`)
- **页面文件**: 固定名称 (`page.tsx`, `layout.tsx`, `loading.tsx`)
- **API 路由**: 固定名称 (`route.ts`)
- **工具函数**: camelCase (`formatDate.ts`, `apiClient.ts`)
- **常量**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS`, `ERROR_MESSAGES`)
- **类型定义**: PascalCase (`UserProfile`, `ApiResponse`)

## 🔀 渲染模式策略 (核心原则)

### 决策树
```
是否需要实时数据？
├─ 否 → 使用 SSG (静态生成)
└─ 是
   ├─ 数据变化频率低 → 使用 ISR (增量静态再生)
   ├─ 需要用户特定数据 → 使用 SSR (服务端渲染)
   └─ 需要客户端交互 → 使用 RSC + 客户端组件
```

### 渲染模式使用规范

#### 1. SSG (静态生成) - 最佳性能
- **适用**: 博客文章、产品页面、营销页面
- **要求**: 必须实现 `generateStaticParams()`
- **SEO**: 必须配置 `generateMetadata()`

#### 2. ISR (增量静态再生) - 默认推荐
- **适用**: 产品列表、新闻页面、数据展示
- **配置**: 设置合理的 `revalidate` 时间 (推荐 10-60 分钟)
- **缓存**: 利用 Cloudflare 边缘缓存优势

#### 3. SSR (服务端渲染) - 实时数据
- **适用**: 用户仪表盘、实时数据、个性化内容
- **要求**: 使用 `dynamic = 'force-dynamic'`
- **性能**: 注意服务器响应时间

#### 4. React Server Components 混合策略
- **原则**: 服务器组件处理数据获取，客户端组件处理交互
- **最小化**: 减少 `'use client'` 使用
- **优化**: 避免客户端重复获取服务端已有数据

#### 5. 客户端数据获取
- **工具**: 优先使用 SWR 或 TanStack Query
- **缓存**: 合理配置缓存策略和重试机制
- **性能**: 实现乐观更新和错误处理

### 性能对比参考

| 模式 | 首屏速度 | 后续访问 | SEO | 实时性 | 适用场景 |
|------|---------|----------|-----|--------|----------|
| SSG | 🟢 极快 | 🟢 极快 | 🟢 完美 | 🔴 差 | 静态内容 |
| ISR | 🟢 快 | 🟢 极快 | 🟢 完美 | 🟡 中等 | 半静态内容 |
| SSR | 🟡 中等 | 🟡 中等 | 🟢 完美 | 🟢 完美 | 动态内容 |
| CSR | 🔴 慢 | 🟢 快 | 🔴 差 | 🟢 完美 | 交互应用 |

## 🎯 SEO 优化要求

### 必须实现的 SEO 功能
1. **Metadata API**: 根布局和页面级元数据配置
2. **动态 Metadata**: 为动态路由生成 SEO 友好的元数据
3. **结构化数据**: 实现 JSON-LD 结构化数据标记
4. **自动 Sitemap**: 使用 `app/sitemap.ts` 自动生成
5. **Robots.txt**: 使用 `app/robots.ts` 配置爬虫规则
6. **Open Graph**: 社交媒体分享优化
7. **Core Web Vitals**: 确保性能指标达标

### SEO 检查清单
- [ ] 页面标题和描述唯一且描述性强
- [ ] 图片包含 alt 属性
- [ ] 页面加载速度 < 3秒
- [ ] 移动端友好设计
- [ ] 结构化数据验证通过
- [ ] 内部链接结构合理

## 🌐 API 架构规范

### API 设计原则
- **内部调用**: 直接使用共享函数，避免 HTTP 请求开销
- **外部调用**: 通过 `/api` 路由，支持缓存和错误处理
- **错误处理**: 统一错误格式和 HTTP 状态码
- **类型安全**: API 输入输出必须有 TypeScript 类型定义

### API 路由要求
- 使用 Route Handlers (`route.ts`)
- 实现适当的错误处理和日志记录
- 设置合理的缓存策略
- 输入验证和数据清理

## ☁️ Cloudflare Pages 部署要求

### 必需配置
1. **next.config.js**: 配置静态导出和图片优化禁用
2. **wrangler.toml**: Cloudflare Workers 配置
3. **package.json**: 添加构建和部署脚本
4. **Edge Runtime**: 动态 API 路由必须使用 Edge Runtime

### 构建脚本要求
- `pages:build`: 使用 `@cloudflare/next-on-pages`
- `pages:deploy`: 构建并部署到 Cloudflare Pages
- `pages:dev`: 本地 Cloudflare 环境测试

### 环境变量规范
- 客户端变量必须以 `NEXT_PUBLIC_` 开头
- 敏感信息仅在服务端使用
- 生产和开发环境分别配置

### Cloudflare 限制适配
- 避免 Node.js 特定 API，使用 Web 标准 API
- 图片优化在 Cloudflare 环境下禁用
- 文件系统操作不支持

## ⚡ 性能优化要求

### Core Web Vitals 目标
- **LCP** (Largest Contentful Paint): < 2.5秒
- **FID** (First Input Delay): < 100毫秒
- **CLS** (Cumulative Layout Shift): < 0.1

### 必须实现的优化
1. **图片优化**: 使用适当的图片格式和懒加载
2. **代码分割**: 动态导入和 Suspense 边界
3. **字体优化**: 使用 `next/font` 和 `display: swap`
4. **缓存策略**: API 响应缓存和 SWR 配置
5. **Bundle 优化**: 分析和减少包体积
6. **预加载**: 关键路由预加载和数据预获取

### 性能监控
- 集成 Web Vitals 报告
- 使用 Lighthouse 定期审计
- 监控 Cloudflare Analytics
- 实现错误追踪 (推荐 Sentry)

## 🔧 开发工作流程

### 项目初始化标准流程
1. 使用 `pnpm create next-app` 创建项目
2. 安装 Cloudflare 相关依赖
3. 配置 TypeScript 和 Tailwind
4. 设置 Git 和提交规范
5. 配置 ESLint 和 Prettier

### 开发规范要求
- **组件**: 优先 Server Components，最小化客户端组件
- **状态管理**: URL 搜索参数 > Server State > Client State
- **样式**: Tailwind 优先，禁止内联样式
- **类型**: 强制 TypeScript，所有导出必须有类型
- **测试**: 单元测试覆盖核心逻辑

### 代码质量工具
- **TypeScript**: 零错误编译
- **ESLint**: Next.js 规则集
- **Prettier**: 代码格式化
- **Husky**: Git Hooks
- **Lint-staged**: 提交前检查

## 📊 监控和调试

### 开发环境工具
- `pnpm dev`: 开发服务器
- `pnpm tsc --noEmit`: 类型检查
- `pnpm next lint`: Lint 检查
- `pnpm run analyze`: Bundle 分析

### 生产环境监控
- **Cloudflare Analytics**: 性能和流量监控
- **Sentry**: 错误追踪和性能监控
- **Lighthouse**: 定期性能审计
- **Real User Monitoring**: 真实用户体验监控

## 🔒 安全最佳实践

### 环境变量安全
- 客户端变量以 `NEXT_PUBLIC_` 开头
- 敏感信息仅在服务端使用
- 使用 `.env.example` 文档化环境变量

### API 安全要求
- 输入验证和数据清理
- 适当的 CORS 配置
- 速率限制和防护
- 敏感操作的身份验证

### 内容安全策略
- 配置 CSP 头部
- 防止 XSS 攻击
- 安全的外部资源加载

## 📚 推荐技术栈

### 核心依赖 (必需)
- `next@^15.0.0`
- `react@^18.0.0`
- `typescript@^5.0.0`
- `tailwindcss@^3.0.0`
- `@cloudflare/next-on-pages@^1.13.12`

### 推荐工具库
- **状态管理**: Zustand, SWR/TanStack Query
- **表单处理**: React Hook Form + Zod
- **UI 组件**: shadcn/ui, Headless UI
- **图标**: Lucide React, Heroicons
- **日期处理**: date-fns
- **数据验证**: Zod
- **测试**: Vitest, Testing Library

### 开发工具
- **代码质量**: ESLint, Prettier, Husky
- **类型检查**: TypeScript strict mode
- **构建分析**: `@next/bundle-analyzer`
- **性能监控**: Web Vitals, Lighthouse CI

## 🎯 部署检查清单

### 部署前必检项目
- [ ] `pnpm` 作为唯一包管理器
- [ ] TypeScript 编译无错误
- [ ] ESLint 检查通过
- [ ] Next.js 配置适配 Cloudflare
- [ ] 环境变量正确设置
- [ ] API 路由使用 Edge Runtime
- [ ] 图片优化已禁用 (生产环境)
- [ ] 构建命令配置正确
- [ ] 错误页面已创建
- [ ] 性能优化已实施
- [ ] SEO 元数据完整
- [ ] 安全检查完成
- [ ] 性能审计通过

### 生产环境验证
- [ ] 页面加载速度 < 3秒
- [ ] Core Web Vitals 达标
- [ ] SEO 元数据正确显示
- [ ] 社交媒体分享预览正常
- [ ] 移动端体验良好
- [ ] 错误处理正常工作
- [ ] 缓存策略生效

---

🎉 **遵循这些规则，构建高性能、可维护、SEO 友好的现代 Next.js 应用！** 