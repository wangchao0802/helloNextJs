export async function GET(request) {
  try {
    // 从查询参数获取经纬度，默认使用北京的坐标
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get("lat") || "39.9042";
    const longitude = searchParams.get("lon") || "116.4074";
    const city = searchParams.get("city") || "北京";

    // 调用Open-Meteo API
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`,
      {
        headers: {
          "User-Agent": "NextJS-Weather-App/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 天气代码映射
    const getWeatherInfo = (code) => {
      const weatherMap = {
        0: { name: "晴天", emoji: "☀️", desc: "万里无云" },
        1: { name: "晴朗", emoji: "🌤️", desc: "主要晴朗" },
        2: { name: "多云", emoji: "⛅", desc: "部分多云" },
        3: { name: "阴天", emoji: "☁️", desc: "阴云密布" },
        45: { name: "雾", emoji: "🌫️", desc: "有雾" },
        48: { name: "雾凇", emoji: "🌫️", desc: "雾凇" },
        51: { name: "小雨", emoji: "🌦️", desc: "轻微毛毛雨" },
        53: { name: "中雨", emoji: "🌧️", desc: "中等毛毛雨" },
        55: { name: "大雨", emoji: "🌧️", desc: "密集毛毛雨" },
        61: { name: "小雨", emoji: "🌦️", desc: "轻微降雨" },
        63: { name: "中雨", emoji: "🌧️", desc: "中等降雨" },
        65: { name: "大雨", emoji: "🌧️", desc: "大雨" },
        80: { name: "阵雨", emoji: "🌦️", desc: "轻微阵雨" },
        81: { name: "阵雨", emoji: "🌧️", desc: "中等阵雨" },
        82: { name: "暴雨", emoji: "⛈️", desc: "猛烈阵雨" },
        71: { name: "小雪", emoji: "🌨️", desc: "轻微降雪" },
        73: { name: "中雪", emoji: "❄️", desc: "中等降雪" },
        75: { name: "大雪", emoji: "❄️", desc: "大雪" },
        95: { name: "雷暴", emoji: "⛈️", desc: "雷暴" },
        96: { name: "雷雨", emoji: "⛈️", desc: "轻微冰雹雷暴" },
        99: { name: "冰雹", emoji: "⛈️", desc: "大冰雹雷暴" },
      };
      return (
        weatherMap[code] || { name: "未知", emoji: "❓", desc: "未知天气" }
      );
    };

    // 处理当前天气数据
    const currentWeather = data.current;
    const currentWeatherInfo = getWeatherInfo(currentWeather.weather_code);

    // 处理每日预报数据
    const dailyForecasts = data.daily.time.map((date, index) => {
      const weatherInfo = getWeatherInfo(data.daily.weather_code[index]);
      return {
        date,
        weatherCode: data.daily.weather_code[index],
        maxTemp: Math.round(data.daily.temperature_2m_max[index]),
        minTemp: Math.round(data.daily.temperature_2m_min[index]),
        ...weatherInfo,
      };
    });

    // 返回格式化的天气数据
    return Response.json({
      success: true,
      city,
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      current: {
        temperature: Math.round(currentWeather.temperature_2m),
        weatherCode: currentWeather.weather_code,
        windSpeed: currentWeather.wind_speed_10m,
        humidity: currentWeather.relative_humidity_2m,
        ...currentWeatherInfo,
      },
      forecast: dailyForecasts,
      units: {
        temperature: data.current_units.temperature_2m,
        windSpeed: data.current_units.wind_speed_10m,
      },
      timezone: data.timezone,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Weather API Error:", error);

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
            desc: "万里无云",
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
