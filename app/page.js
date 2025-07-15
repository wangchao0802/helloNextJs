export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        🎉 Hello, Next.js! 🎉
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          marginBottom: "2rem",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        欢迎来到你的第一个Next.js应用！这是一个简单的Hello World例子。
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3>🚀 快速开始</h3>
          <p>修改 app/page.js 来编辑这个页面</p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3>📖 学习</h3>
          <p>探索Next.js的强大功能和特性</p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h3>🛠️ 构建</h3>
          <p>创建令人惊叹的Web应用程序</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <a
          href="/about"
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          📄 关于页面 (Static)
        </a>
        <a
          href="/ssr-example"
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          🔄 SSR 示例页面 (Dynamic)
        </a>
        <a
          href="/supabase-demo"
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          🗄️ Supabase 数据库演示
        </a>
        <a
          href="/test.html"
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          📄 纯HTML测试页面 (Static)
        </a>
        <a
          href="/html-route-test"
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          🌈 复古测试页面 (Next.js)
        </a>
        <a
          href="/isr-example"
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          🔄 ISR 示例页面 (Incremental)
        </a>
        <a
          href="/weather"
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          🌤️ 天气API (服务端)
        </a>
        <a
          href="/weather-client"
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          ⚡ 天气API (客户端)
        </a>
      </div>

      <footer
        style={{
          marginTop: "3rem",
          textAlign: "center",
          opacity: "0.8",
        }}
      >
        <p>由 Next.js 强力驱动 ⚡</p>
      </footer>
    </main>
  );
}
