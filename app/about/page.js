export default function About() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        color: "#333",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        关于页面
      </h1>

      <p
        style={{
          fontSize: "1.1rem",
          textAlign: "center",
          maxWidth: "600px",
          marginBottom: "2rem",
        }}
      >
        这是一个额外的页面，展示了Next.js的路由功能。 你可以通过访问 /about
        来查看这个页面。
      </p>

      <a
        href="/"
        style={{
          padding: "0.75rem 1.5rem",
          background: "#007acc",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontSize: "1rem",
        }}
      >
        回到首页
      </a>
    </main>
  );
}
