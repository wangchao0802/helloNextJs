// 天气页面 - 展示 API 调用示例
import styles from "./weather.module.css";
import { fetchWeatherData } from "../../lib/weather-api.js";

// 获取北京天气数据 - 使用共享 API 函数 (ISR)
async function getWeatherData() {
  console.log("🚀 ISR: 调用共享API函数，10分钟缓存...");

  // 在ISR模式下，Next.js会自动处理缓存
  // 我们直接使用共享函数，避免HTTP调用
  return await fetchWeatherData("北京");
}

// 天气代码映射已移至 API 路由中处理

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

export default async function WeatherPage() {
  const weatherData = await getWeatherData();

  // 如果API调用失败，使用fallback数据
  if (!weatherData.success) {
    const fallbackData = weatherData.fallback;
    return (
      <div className={styles.container}>
        <div className={styles.weatherCard}>
          <header className={styles.header}>
            <h1 className={styles.title}>🌤️ {fallbackData.city}天气</h1>
            <p className={styles.subtitle}>内部 API 路由调用示例</p>
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
          <h1 className={styles.title}>🌤️ {weatherData.city}天气</h1>
          <p className={styles.subtitle}>内部 API 路由调用示例</p>
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
              更新时间:{" "}
              {new Date(weatherData.lastUpdated).toLocaleTimeString("zh-CN")}
            </p>
          </div>
        </div>

        {/* 额外信息 */}
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

        {/* 7天预报 */}
        <div className={styles.forecast}>
          <h3 className={styles.forecastTitle}>📅 7天预报</h3>
          <div className={styles.forecastGrid}>
            {weatherData.forecast.map((dayForecast) => (
              <div key={dayForecast.date} className={styles.forecastItem}>
                <div className={styles.forecastDate}>
                  {formatDate(dayForecast.date)}
                </div>
                <div className={styles.forecastWeather}>
                  <span className={styles.forecastEmoji}>
                    {dayForecast.emoji}
                  </span>
                  <span className={styles.forecastName}>
                    {dayForecast.name}
                  </span>
                </div>
                <div className={styles.forecastTemp}>
                  <span className={styles.tempHigh}>
                    {dayForecast.maxTemp}°
                  </span>
                  <span className={styles.tempLow}>{dayForecast.minTemp}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API 信息 */}
        <div className={styles.apiInfo}>
          <h3 className={styles.apiTitle}>🔗 API 调用信息</h3>
          <div className={styles.apiDetails}>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>API 地址:</span>
              <code className={styles.apiUrl}>/api/weather</code>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>坐标:</span>
              <span className={styles.apiValue}>
                {weatherData.coordinates.latitude}°N,{" "}
                {weatherData.coordinates.longitude}°E
              </span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>时区:</span>
              <span className={styles.apiValue}>{weatherData.timezone}</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>缓存策略:</span>
              <span className={styles.apiValue}>ISR - 10分钟重新验证</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>架构优势:</span>
              <span className={styles.apiValue}>统一错误处理 + 数据格式化</span>
            </div>
          </div>
        </div>

        {/* 导航链接 */}
        <div className={styles.navigation}>
          <a href="/" className={styles.navButton}>
            🏠 返回首页
          </a>
          <a href="/weather-client" className={styles.navButton}>
            ⚡ 客户端版本
          </a>
          <a href="/weather-ssr" className={styles.navButton}>
            🔄 纯SSR版本
          </a>
        </div>
      </div>
    </div>
  );
}

// 设置重新验证 - 10分钟
export const revalidate = 600;
