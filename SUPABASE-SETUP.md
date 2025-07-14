# Supabase 设置指南

这是一个简单的 Supabase TODO 应用演示，展示了如何使用 Supabase 进行基本的 CRUD 操作。

## 🚀 快速开始

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 创建一个新账户或登录
3. 点击 "New Project" 创建新项目
4. 填写项目名称和数据库密码
5. 等待项目创建完成

### 2. 创建数据库表

在 Supabase 控制台中：

1. 进入 "SQL Editor"
2. 运行以下 SQL 语句创建 todos 表：

```sql
CREATE TABLE todos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. 配置环境变量

1. 在 Supabase 控制台中，进入 "Settings" -> "API"
2. 复制 "Project URL" 和 "Public anon key"
3. 在项目根目录创建 `.env.local` 文件
4. 添加以下内容：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 启动应用

```bash
pnpm dev
```

访问 `http://localhost:3000/supabase-demo` 即可看到 TODO 应用。

## 🎯 功能特色

- ✅ **创建**：添加新的待办事项
- 📖 **读取**：显示所有待办事项
- ✏️ **更新**：标记完成/未完成状态
- 🗑️ **删除**：移除待办事项
- 🔄 **实时**：可以扩展为实时同步（使用 Supabase Realtime）

## 📁 项目结构

```
├── lib/
│   └── supabase.js          # Supabase 客户端配置和操作函数
├── app/
│   └── supabase-demo/
│       └── page.js          # TODO 应用页面
├── .env.local               # 环境变量配置
└── .env.local.example       # 环境变量示例文件
```

## 🔧 核心代码说明

### Supabase 客户端初始化

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 基本 CRUD 操作

```javascript
// 查询数据
const { data, error } = await supabase
  .from('todos')
  .select('*')
  .order('created_at', { ascending: false })

// 插入数据
const { data, error } = await supabase
  .from('todos')
  .insert([{ title, completed: false }])
  .select()

// 更新数据
const { data, error } = await supabase
  .from('todos')
  .update({ completed: true })
  .eq('id', todoId)

// 删除数据
const { error } = await supabase
  .from('todos')
  .delete()
  .eq('id', todoId)
```

## 🚀 扩展功能

### 实时同步

你可以添加实时同步功能，让多个用户之间的数据自动同步：

```javascript
// 监听数据变化
const subscription = supabase
  .channel('todos')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, (payload) => {
    console.log('Change received!', payload)
    // 更新本地状态
  })
  .subscribe()

// 取消订阅
subscription.unsubscribe()
```

### 用户认证

Supabase 也提供了完整的用户认证系统：

```javascript
// 用户注册
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// 用户登录
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// 获取当前用户
const { data: { user } } = await supabase.auth.getUser()
```

### 文件存储

Supabase 还提供了文件存储功能：

```javascript
// 上传文件
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('path/to/file.jpg', file)

// 下载文件
const { data, error } = await supabase.storage
  .from('bucket-name')
  .download('path/to/file.jpg')
```

## 📚 了解更多

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript)
- [Next.js 与 Supabase 集成](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 🤝 贡献

如果你有任何建议或发现问题，欢迎提交 Issue 或 Pull Request！ 