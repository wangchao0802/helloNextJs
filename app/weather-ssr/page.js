// 纯 SSR 天气页面 - 每次访问都重新渲染
import styles from "../weather/weather.module.css";
import { fetchWeatherData } from "../../lib/weather-api.js";

// 强制动态渲染，禁用所有缓存
export const dynamic = "force-dynamic";
export const revalidate = 0;
// Cloudflare Pages 要求使用 Edge Runtime
export const runtime = "edge";

// 获取天气数据 - 每次都重新获取
async function getWeatherData() {
  console.log("🔄 SSR: 每次访问都直接调用共享API函数...");

  // 直接使用共享的天气API函数，避免HTTP调用
  const data = await fetchWeatherData("北京");

  return {
    ...data,
    renderTime: new Date().toISOString(),
    renderMode: data.success
      ? "SSR - 服务端每次重新渲染"
      : "SSR - 服务端每次重新渲染 (Fallback)",
  };
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "今天";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "明天";
  } else {
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  }
}

export default async function WeatherSSRPage() {
  const weatherData = await getWeatherData();

  // 如果API调用失败，使用fallback数据
  if (!weatherData.success) {
    const fallbackData = weatherData.fallback;
    return (
      <div className={styles.container}>
        <div className={styles.weatherCard}>
          <header className={styles.header}>
            <h1 className={styles.title}>🔄 {fallbackData.city}天气 (纯SSR)</h1>
            <p className={styles.subtitle}>每次访问都重新渲染</p>
            <div className={styles.errorBadge}>
              ⚠️ API 调用失败，显示备用数据
            </div>
          </header>
          <div className={styles.currentWeather}>
            <div className={styles.currentTemp}>
              <span className={styles.emoji}>{fallbackData.current.emoji}</span>
              <span className={styles.temperature}>
                {fallbackData.current.temperature}°C
              </span>
            </div>
            <div className={styles.currentInfo}>
              <p className={styles.weatherName}>{fallbackData.current.name}</p>
              <p className={styles.location}>📍 {fallbackData.city}市</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.weatherCard}>
        {/* 页面标题 */}
        <header className={styles.header}>
          <h1 className={styles.title}>🔄 {weatherData.city}天气 (纯SSR)</h1>
          <p className={styles.subtitle}>每次访问都重新渲染</p>
          <div
            style={{
              background: "#e74c3c",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontSize: "0.9rem",
              marginTop: "0.5rem",
            }}
          >
            ⚠️ 每次访问都会重新服务端渲染 - 响应较慢
          </div>
        </header>

        {/* 当前天气 */}
        <div className={styles.currentWeather}>
          <div className={styles.currentTemp}>
            <span className={styles.emoji}>{weatherData.current.emoji}</span>
            <span className={styles.temperature}>
              {weatherData.current.temperature}°C
            </span>
          </div>
          <div className={styles.currentInfo}>
            <p className={styles.weatherName}>{weatherData.current.name}</p>
            <p className={styles.location}>📍 {weatherData.city}市</p>
            <p className={styles.updateTime}>
              数据获取时间:{" "}
              {new Date(weatherData.lastUpdated).toLocaleTimeString("zh-CN")}
            </p>
            <p className={styles.updateTime}>
              页面渲染时间:{" "}
              {new Date(weatherData.renderTime).toLocaleTimeString("zh-CN")}
            </p>
          </div>
        </div>

        {/* 性能对比说明 */}
        <div className={styles.forecast}>
          <h3 className={styles.forecastTitle}>⚡ 渲染模式对比</h3>
          <div className={styles.apiDetails}>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>当前模式:</span>
              <span className={styles.apiValue}>{weatherData.renderMode}</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>缓存策略:</span>
              <span className={styles.apiValue}>
                cache: 'no-store' - 完全禁用缓存
              </span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>性能特点:</span>
              <span className={styles.apiValue}>每次访问都慢，但数据实时</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>适用场景:</span>
              <span className={styles.apiValue}>需要绝对实时数据的场景</span>
            </div>
          </div>
        </div>

        {/* 当前详情 */}
        <div className={styles.forecast}>
          <h3 className={styles.forecastTitle}>🌡️ 当前详情</h3>
          <div className={styles.apiDetails}>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>风速:</span>
              <span className={styles.apiValue}>
                {weatherData.current.windSpeed} {weatherData.units.windSpeed}
              </span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>湿度:</span>
              <span className={styles.apiValue}>
                {weatherData.current.humidity}%
              </span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>描述:</span>
              <span className={styles.apiValue}>
                {weatherData.current.desc}
              </span>
            </div>
          </div>
        </div>

        {/* 性能测试区域 */}
        <div
          style={{
            background: "#fff3e0",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            borderLeft: "4px solid #e74c3c",
          }}
        >
          <h3
            style={{
              color: "#2d3436",
              margin: "0 0 1rem 0",
              fontSize: "1.2rem",
            }}
          >
            🧪 性能测试
          </h3>
          <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.9rem" }}>
            <div>
              <strong>纯 SSR (当前页面)</strong>: 每次访问都慢，数据绝对实时
            </div>
            <div>
              <strong>ISR (/weather)</strong>: 首次快，后续极快，数据定期更新
            </div>
            <div>
              <strong>CSR (/weather-client)</strong>: 首次慢，后续较快，交互性强
            </div>
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem",
                background: "#ffebee",
                borderRadius: "4px",
              }}
            >
              💡 <strong>建议</strong>: 多次刷新页面体验不同渲染模式的性能差异
            </div>
          </div>
        </div>

        {/* 导航链接 */}
        <div className={styles.navigation}>
          <a href="/weather" className={styles.navButton}>
            🚀 ISR版本 (推荐)
          </a>
          <a href="/weather-client" className={styles.navButton}>
            ⚡ CSR版本
          </a>
          <a href="/" className={styles.navButton}>
            🏠 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
