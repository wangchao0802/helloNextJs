"use client";

import { useState, useEffect } from "react";
import styles from "../weather/weather.module.css";

// 格式化日期 (复用服务端的逻辑)
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

export default function WeatherClientPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // 获取天气数据的函数 - 通过我们的 API 路由
  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/weather?city=北京");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData = await response.json();

      if (!apiData.success) {
        setError(apiData.message || "Weather API returned error");
        setWeatherData(apiData.fallback || null);
      } else {
        setWeatherData(apiData);
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // 加载状态
  if (loading && !weatherData) {
    return (
      <div className={styles.container}>
        <div className={styles.weatherCard}>
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌀</div>
            <h2>正在获取天气数据...</h2>
            <p style={{ color: "#636e72" }}>客户端正在调用内部 API 路由</p>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className={styles.container}>
        <div className={styles.weatherCard}>
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
            <h2>无法获取天气数据</h2>
            <p style={{ color: "#636e72" }}>请检查网络连接或稍后重试</p>
            <button
              onClick={fetchWeatherData}
              className={styles.navButton}
              style={{ marginTop: "1rem" }}
            >
              🔄 重新获取
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 处理 fallback 数据（API 失败时）
  if (!weatherData.success && weatherData.city) {
    return (
      <div className={styles.container}>
        <div className={styles.weatherCard}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              ⚡ {weatherData.city}天气 (客户端版)
            </h1>
            <p className={styles.subtitle}>Client-Side API 调用示例</p>
            <div className={styles.errorBadge}>
              ⚠️ API 调用失败，显示备用数据
            </div>
          </header>

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
            </div>
          </div>

          <div className={styles.navigation}>
            <button onClick={fetchWeatherData} className={styles.navButton}>
              🔄 重新获取
            </button>
            <a href="/weather" className={styles.navButton}>
              🏠 服务端版本
            </a>
            <a href="/" className={styles.navButton}>
              🏠 返回首页
            </a>
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
          <h1 className={styles.title}>⚡ {weatherData.city}天气 (客户端版)</h1>
          <p className={styles.subtitle}>Client-Side API 调用示例</p>
          {error && <div className={styles.errorBadge}>⚠️ {error}</div>}
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
              {lastUpdate
                ? `更新时间: ${lastUpdate.toLocaleTimeString("zh-CN")}`
                : "数据获取中..."}
            </p>
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

        {/* 客户端 API 信息 */}
        <div className={styles.apiInfo}>
          <h3 className={styles.apiTitle}>⚡ 客户端 API 调用信息</h3>
          <div className={styles.apiDetails}>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>API 地址:</span>
              <span className={styles.apiValue}>/api/weather (内部路由)</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>调用方式:</span>
              <span className={styles.apiValue}>Client-Side Fetch</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>渲染模式:</span>
              <span className={styles.apiValue}>CSR (客户端渲染)</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>更新策略:</span>
              <span className={styles.apiValue}>用户主动刷新</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>架构优势:</span>
              <span className={styles.apiValue}>通过内部API路由避免CORS</span>
            </div>
            <div className={styles.apiItem}>
              <span className={styles.apiLabel}>状态管理:</span>
              <span className={styles.apiValue}>
                React useState + useEffect
              </span>
            </div>
          </div>
        </div>

        {/* 对比说明 */}
        <div
          style={{
            background: "#fff3e0",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            borderLeft: "4px solid #ff9500",
          }}
        >
          <h3
            style={{
              color: "#2d3436",
              margin: "0 0 1rem 0",
              fontSize: "1.2rem",
            }}
          >
            📊 SSR vs CSR 对比
          </h3>
          <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.9rem" }}>
            <div>
              <strong>服务端版本 (/weather)</strong>: 页面预渲染，SEO
              友好，首屏更快
            </div>
            <div>
              <strong>客户端版本 (当前)</strong>:
              交互性更强，实时更新，加载状态可控
            </div>
            <div>
              <strong>共同优势</strong>: 都通过内部API路由统一处理数据和错误
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className={styles.navigation}>
          <button
            onClick={fetchWeatherData}
            className={styles.navButton}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            🔄 {loading ? "获取中..." : "刷新数据"}
          </button>
          <a href="/weather" className={styles.navButton}>
            🏠 服务端版本
          </a>
          <a href="/" className={styles.navButton}>
            🏠 返回首页
          </a>
        </div>
      </div>
    </div>
  );
}
