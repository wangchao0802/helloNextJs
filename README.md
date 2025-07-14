# Next.js Hello World 项目

这是一个简单的Next.js Hello World例子，帮助你从零开始学习Next.js。

## 项目结构

```
firstNextjs/
├── app/
│   ├── layout.js      # 根布局组件
│   ├── page.js        # 首页
│   └── about/
│       └── page.js    # 关于页面
├── package.json       # 项目依赖和脚本
├── next.config.js     # Next.js配置
└── README.md          # 项目说明
```

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 打开浏览器
访问 [http://localhost:3000](http://localhost:3000) 查看应用

## 学习要点

### 1. App Router (应用路由)
- Next.js 13+ 使用新的App Router
- `app/` 目录下的文件自动成为路由
- `page.js` 文件定义页面组件

### 2. 文件系统路由
- `app/page.js` → `/` (首页)
- `app/about/page.js` → `/about` (关于页面)

### 3. 布局系统
- `layout.js` 定义共享布局
- 自动包装子页面

### 4. 服务端渲染 (SSR)
- Next.js 默认进行服务端渲染
- 更好的SEO和性能

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 代码检查

## 下一步学习

1. 尝试修改 `app/page.js` 中的内容
2. 创建新的页面和路由
3. 学习组件化开发
4. 探索Next.js的数据获取方法
5. 学习CSS样式处理

## 有用的资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev/)
- [Next.js 学习课程](https://nextjs.org/learn)

祝你学习愉快！🚀 