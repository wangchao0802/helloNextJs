import { fetchWeatherData } from "../../../lib/weather-api.js";

export async function GET(request) {
  try {
    // 从查询参数获取城市，默认使用北京
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "北京";

    console.log(`🌤️ API Route: 获取 ${city} 天气数据...`);

    // 使用共享的天气API函数
    const weatherData = await fetchWeatherData(city);

    return Response.json(weatherData);
  } catch (error) {
    console.error("Weather API Route Error:", error);

    // 返回错误响应
    return Response.json(
      {
        success: false,
        error: "Failed to fetch weather data",
        message: error.message,
        fallback: {
          city: "北京",
          current: {
            temperature: 20,
            name: "晴天",
            emoji: "☀️",
            desc: "万里无云 (API路由错误)",
            windSpeed: 5,
            humidity: 60,
          },
          forecast: [
            {
              date: new Date().toISOString().split("T")[0],
              name: "晴天",
              emoji: "☀️",
              maxTemp: 25,
              minTemp: 15,
            },
          ],
        },
      },
      { status: 500 }
    );
  }
}
