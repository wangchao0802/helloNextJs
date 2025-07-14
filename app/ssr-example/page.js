// 这是一个SSR示例页面
// 强制动态渲染
export const dynamic = "force-dynamic";
// 使用Edge Runtime以支持Cloudflare Pages
export const runtime = "edge";

export default async function SSRPage() {
  // 模拟服务端数据获取
  const timestamp = new Date().toISOString();

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        🔄 SSR 示例页面
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        这个页面使用服务端渲染 (SSR)
      </p>

      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "1rem",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <p>
          <strong>服务器时间:</strong>
        </p>
        <p style={{ fontFamily: "monospace", fontSize: "1.1rem" }}>
          {timestamp}
        </p>
        <p style={{ fontSize: "0.9rem", opacity: "0.8", marginTop: "0.5rem" }}>
          每次刷新页面，时间都会更新
        </p>
      </div>

      <a
        href="/"
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          background: "rgba(255, 255, 255, 0.2)",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        回到首页
      </a>
    </main>
  );
}
