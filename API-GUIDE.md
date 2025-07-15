# Next.js API 调用完整指南

## 🎯 什么是 API 调用？

API (Application Programming Interface) 调用是应用程序与外部服务交换数据的方式。在我们的天气应用示例中，我们使用了 Next.js API 路由来封装 Open-Meteo 天气 API，提供更安全和可控的数据获取方式。

## 🏗️ API 架构设计

### 为什么使用 API 路由？

我们创建了自己的 API 路由 `/api/weather` 而不是直接在前端调用外部 API：

```javascript
// app/api/weather/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || '北京';
  
  // 调用外部 Open-Meteo API
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?...`);
  const data = await response.json();
  
  // 数据处理和格式化
  return Response.json({
    success: true,
    city,
    current: { /* 处理后的数据 */ },
    forecast: [ /* 7天预报 */ ]
  });
}
```

### 🎯 API 路由的优势

✅ **安全性**: API 密钥等敏感信息保存在服务端  
✅ **避免 CORS**: 前端调用同域 API，无跨域问题  
✅ **统一处理**: 统一的错误处理、数据格式化、缓存策略  
✅ **降级处理**: 外部 API 失败时提供备用数据  
✅ **监控调试**: 服务端日志记录，便于监控和调试  
✅ **数据转换**: 将外部 API 响应转换为应用需要的格式

## 🌤️ 天气 API 示例分析

### API 地址解析
```
https://api.open-meteo.com/v1/forecast?latitude=39.9042&longitude=116.4074&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto
```

**参数说明**:
- `latitude=39.9042` - 纬度 (北京)
- `longitude=116.4074` - 经度 (北京)
- `current=temperature_2m,weather_code` - 当前天气数据
- `daily=weather_code,temperature_2m_max,temperature_2m_min` - 每日预报数据
- `timezone=auto` - 自动检测时区

## 🔄 Next.js 中的 4 种 API 调用方式

### 1. 🖥️ 服务端渲染 (SSR)

```javascript
// app/weather/page.js
export default async function WeatherPage() {
  // 在服务端调用我们的 API 路由
  const res = await fetch(`${baseUrl}/api/weather?city=北京`);
  const data = await res.json();
  
  return <div>{/* 渲染天气数据 */}</div>;
}
```

**特点**:
- ✅ SEO 友好，搜索引擎可以索引内容
- ✅ 首屏加载快，内容直接渲染
- ✅ 安全，API 密钥不会暴露给客户端
- ❌ 每次请求都会调用 API
- ❌ 服务器负载较高

### 2. 🔄 增量静态再生成 (ISR)

```javascript
// app/weather/page.js
async function getWeatherData() {
  const res = await fetch(`${baseUrl}/api/weather?city=北京`, {
    next: { revalidate: 600 } // 10分钟重新验证
  });
  return res.json();
}

export default async function WeatherPage() {
  const data = await getWeatherData();
  return <div>{/* 渲染天气数据 */}</div>;
}

export const revalidate = 600; // 页面级重新验证
```

**特点**:
- ✅ 页面静态生成，加载极快
- ✅ 数据定期更新，保持新鲜度
- ✅ 服务器负载低
- ✅ SEO 友好
- ❌ 数据不是实时的

### 3. ⚡ 客户端渲染 (CSR)

```javascript
// app/weather-client/page.js
"use client";

import { useState, useEffect } from 'react';

export default function WeatherClientPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather?city=北京')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>加载中...</div>;
  
  return <div>{/* 渲染天气数据 */}</div>;
}
```

**特点**:
- ✅ 交互性强，可以实时更新
- ✅ 用户体验好，有加载状态
- ✅ 减少服务器负载
- ✅ 通过 API 路由保证安全性
- ❌ 首屏加载慢，需要等待 JS 执行
- ❌ SEO 不友好

### 4. 📊 静态生成 (SSG)

```javascript
// 构建时获取数据
export async function generateStaticParams() {
  // 如果有动态路由参数
  return [{ city: 'beijing' }, { city: 'shanghai' }];
}

export default async function StaticWeatherPage() {
  // 构建时调用 API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/weather?city=北京`);
  const data = await res.json();
  
  return <div>{/* 渲染天气数据 */}</div>;
}
```

**特点**:
- ✅ 最快的加载速度
- ✅ 完全静态，CDN 友好
- ✅ SEO 友好
- ❌ 数据在构建时固定，不会更新
- ❌ 需要重新构建才能更新数据

## 🛠️ 实现技巧与最佳实践

### 1. 错误处理

```javascript
async function fetchWeatherData() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?...');
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('API Error:', error);
    
    // 返回备用数据
    return {
      current: { temperature_2m: 25, weather_code: 1 },
      daily: { /* 备用数据 */ },
      error: true
    };
  }
}
```

### 2. 加载状态管理

```javascript
"use client";

export default function WeatherPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('...');
      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 渲染不同状态
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <NoData />;
  
  return <WeatherDisplay data={data} />;
}
```

### 3. 缓存策略

```javascript
// 不同的缓存策略
const strategies = {
  // 无缓存，每次都重新获取
  noCache: {
    cache: 'no-store'
  },
  
  // 浏览器缓存 5 分钟
  browserCache: {
    cache: 'force-cache',
    next: { revalidate: 300 }
  },
  
  // ISR 缓存
  isr: {
    next: { revalidate: 600 }
  },
  
  // 标签缓存 (可手动清除)
  tagCache: {
    next: { tags: ['weather'] }
  }
};

// 使用示例
const res = await fetch(url, strategies.isr);
```

### 4. 数据转换与验证

```javascript
// 天气代码映射
const WEATHER_CODES = {
  0: { name: '晴朗', emoji: '☀️' },
  1: { name: '大部晴朗', emoji: '🌤️' },
  // ... 更多映射
};

// 数据转换函数
function transformWeatherData(apiData) {
  return {
    current: {
      temperature: Math.round(apiData.current.temperature_2m),
      weather: WEATHER_CODES[apiData.current.weather_code] || { name: '未知', emoji: '❓' }
    },
    forecast: apiData.daily.time.map((date, index) => ({
      date: formatDate(date),
      high: Math.round(apiData.daily.temperature_2m_max[index]),
      low: Math.round(apiData.daily.temperature_2m_min[index]),
      weather: WEATHER_CODES[apiData.daily.weather_code[index]]
    }))
  };
}

// 数据验证
function validateWeatherData(data) {
  if (!data || !data.current || !data.daily) {
    throw new Error('Invalid weather data structure');
  }
  
  if (typeof data.current.temperature_2m !== 'number') {
    throw new Error('Invalid temperature data');
  }
  
  return true;
}
```

## 🎨 UI 状态管理模式

### 1. 简单状态管理

```javascript
function useWeatherData() {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await getWeatherData();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { ...state, refetch: fetchData };
}
```

### 2. 自动刷新

```javascript
function useAutoRefreshWeather(interval = 300000) { // 5分钟
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWeatherData();
        setData(result);
      } catch (error) {
        console.error('Auto refresh failed:', error);
      }
    };

    // 立即获取一次
    fetchData();

    // 设置定时器
    const timer = setInterval(fetchData, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return data;
}
```

## 📊 性能优化策略

### 1. 预加载关键数据

```javascript
// 在路由组件中预加载
export default function WeatherLayout({ children }) {
  useEffect(() => {
    // 预加载天气数据
    fetch('/api/weather').then(res => res.json());
  }, []);

  return <div>{children}</div>;
}
```

### 2. 数据去重

```javascript
// 避免重复请求
const requestCache = new Map();

async function fetchWithCache(url) {
  if (requestCache.has(url)) {
    return requestCache.get(url);
  }

  const promise = fetch(url).then(res => res.json());
  requestCache.set(url, promise);

  // 5分钟后清除缓存
  setTimeout(() => requestCache.delete(url), 300000);

  return promise;
}
```

### 3. 条件渲染优化

```javascript
// 使用 memo 优化渲染
const WeatherCard = memo(({ weather }) => {
  return (
    <div>
      <span>{weather.emoji}</span>
      <span>{weather.temperature}°C</span>
    </div>
  );
});

// 避免不必要的重新渲染
const ForecastList = memo(({ forecast }) => {
  return (
    <div>
      {forecast.map(day => (
        <WeatherCard key={day.date} weather={day} />
      ))}
    </div>
  );
});
```

## 🔒 安全考虑

### 1. API 密钥保护

```javascript
// ❌ 错误：在客户端暴露 API 密钥
const API_KEY = 'sk-1234567890'; // 不要这样做！

// ✅ 正确：使用环境变量 (服务端)
const API_KEY = process.env.WEATHER_API_KEY;

// ✅ 正确：通过 API 路由代理
// app/api/weather/route.js
export async function GET() {
  const res = await fetch(`https://api.weather.com?key=${process.env.API_KEY}`);
  return Response.json(await res.json());
}
```

### 2. 输入验证

```javascript
function validateCoordinates(lat, lon) {
  if (typeof lat !== 'number' || lat < -90 || lat > 90) {
    throw new Error('Invalid latitude');
  }
  
  if (typeof lon !== 'number' || lon < -180 || lon > 180) {
    throw new Error('Invalid longitude');
  }
}
```

### 3. 请求限制

```javascript
// 实现简单的请求限制
class RateLimiter {
  constructor(maxRequests = 10, timeWindow = 60000) {
    this.requests = [];
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
}

const limiter = new RateLimiter();

async function fetchWeatherWithLimit() {
  if (!limiter.canMakeRequest()) {
    throw new Error('请求过于频繁，请稍后再试');
  }
  
  return fetch('...');
}
```

## 📈 不同场景的选择指南

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| 博客文章 | SSG | 内容不经常变化，加载速度最重要 |
| 新闻网站 | ISR | 内容需要定期更新，但不需要实时 |
| 社交媒体 | CSR | 需要实时交互和个性化内容 |
| 电商产品页 | ISR | 价格库存需要更新，但不需要实时 |
| 聊天应用 | CSR + WebSocket | 需要实时双向通信 |
| 天气应用 | ISR/CSR | 数据更新频率中等，两种方式都适合 |
| 仪表板 | CSR | 需要频繁更新和用户交互 |

## 🎯 实践项目

基于我们的天气应用，你可以尝试：

1. **扩展功能**: 添加多城市支持
2. **优化性能**: 实现数据缓存和预加载
3. **增强UI**: 添加图表和动画
4. **添加功能**: 实现位置自动检测
5. **错误处理**: 完善各种错误场景
6. **测试**: 添加单元测试和集成测试

## 🚀 下一步学习

- [Next.js 数据获取官方文档](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [React Query / TanStack Query](https://tanstack.com/query)
- [SWR 数据获取库](https://swr.vercel.app)
- [Open-Meteo API 文档](https://open-meteo.com/en/docs)

## 💡 总结

API 调用是现代 Web 应用的核心功能。通过我们的天气应用示例，你学到了：

1. **4种不同的调用方式**: SSR、ISR、CSR、SSG
2. **错误处理和状态管理**: 让应用更健壮
3. **性能优化**: 缓存、预加载、去重
4. **安全最佳实践**: 保护 API 密钥和验证输入
5. **实际应用**: 完整的天气应用示例

选择合适的方案取决于你的具体需求：数据更新频率、SEO 要求、用户交互需求等。

---

🎉 **现在去体验我们的天气应用示例吧！**
- [🌤️ 服务端版本 (/weather)](/weather) - ISR 示例
- [⚡ 客户端版本 (/weather-client)](/weather-client) - CSR 示例 